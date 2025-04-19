use anchor_lang::prelude::*;
use anchor_spl::token::{self, Transfer};
use crate::lending::state::*;
use crate::lending::context::*;

pub fn create_lending_pool(
    ctx: Context<CreateLendingPool>,
    params: LendingPoolParams,
) -> Result<()> {
    let lending_pool = &mut ctx.accounts.lending_pool;
    
    // Initialize lending pool
    lending_pool.authority = ctx.accounts.authority.key();
    lending_pool.token_mint = ctx.accounts.token_mint.key();
    lending_pool.token_vault = ctx.accounts.token_vault.key();
    lending_pool.interest_rate = params.interest_rate;
    lending_pool.max_loan_amount = params.max_loan_amount;
    lending_pool.min_loan_amount = params.min_loan_amount;
    lending_pool.total_borrowed = 0;
    lending_pool.total_deposited = 0;
    lending_pool.created_at = Clock::get()?.unix_timestamp;
    lending_pool.updated_at = Clock::get()?.unix_timestamp;
    
    Ok(())
}

pub fn create_loan(
    ctx: Context<CreateLoan>,
    params: LoanParams,
) -> Result<()> {
    let loan = &mut ctx.accounts.loan;
    let lending_pool = &mut ctx.accounts.lending_pool;
    
    // Validate loan amount
    require!(
        params.amount >= lending_pool.min_loan_amount,
        LendingError::LoanAmountTooSmall
    );
    require!(
        params.amount <= lending_pool.max_loan_amount,
        LendingError::LoanAmountTooLarge
    );
    require!(
        lending_pool.total_borrowed.checked_add(params.amount).unwrap() <= lending_pool.total_deposited,
        LendingError::InsufficientLiquidity
    );
    
    // Initialize loan
    loan.borrower = ctx.accounts.borrower.key();
    loan.lending_pool = lending_pool.key();
    loan.amount = params.amount;
    loan.interest_rate = lending_pool.interest_rate;
    loan.start_time = Clock::get()?.unix_timestamp;
    loan.due_time = Clock::get()?.unix_timestamp.checked_add(params.duration).unwrap();
    loan.status = LoanStatus::Active;
    loan.created_at = Clock::get()?.unix_timestamp;
    loan.updated_at = Clock::get()?.unix_timestamp;
    
    // Transfer tokens to borrower
    token::transfer(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.token_vault.to_account_info(),
                to: ctx.accounts.borrower_token_account.to_account_info(),
                authority: lending_pool.to_account_info(),
            },
        ),
        params.amount,
    )?;
    
    // Update lending pool
    lending_pool.total_borrowed = lending_pool.total_borrowed.checked_add(params.amount).unwrap();
    lending_pool.updated_at = Clock::get()?.unix_timestamp;
    
    Ok(())
}

pub fn repay_loan(
    ctx: Context<RepayLoan>,
    amount: u64,
) -> Result<()> {
    let loan = &mut ctx.accounts.loan;
    let lending_pool = &mut ctx.accounts.lending_pool;
    
    // Validate loan status
    require!(
        loan.status == LoanStatus::Active,
        LendingError::LoanNotActive
    );
    
    // Calculate interest
    let interest = calculate_interest(loan.amount, loan.interest_rate, loan.start_time)?;
    let total_amount = loan.amount.checked_add(interest).unwrap();
    
    // Validate repayment amount
    require!(
        amount >= total_amount,
        LendingError::InsufficientRepayment
    );
    
    // Transfer tokens to vault
    token::transfer(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.borrower_token_account.to_account_info(),
                to: ctx.accounts.token_vault.to_account_info(),
                authority: ctx.accounts.borrower.to_account_info(),
            },
        ),
        amount,
    )?;
    
    // Update loan status
    loan.status = LoanStatus::Repaid;
    loan.updated_at = Clock::get()?.unix_timestamp;
    
    // Update lending pool
    lending_pool.total_borrowed = lending_pool.total_borrowed.checked_sub(loan.amount).unwrap();
    lending_pool.updated_at = Clock::get()?.unix_timestamp;
    
    Ok(())
}

pub fn liquidate_loan(
    ctx: Context<LiquidateLoan>,
) -> Result<()> {
    let loan = &mut ctx.accounts.loan;
    let lending_pool = &mut ctx.accounts.lending_pool;
    
    // Validate loan status
    require!(
        loan.status == LoanStatus::Active,
        LendingError::LoanNotActive
    );
    
    // Validate loan is overdue
    let current_time = Clock::get()?.unix_timestamp;
    require!(
        current_time > loan.due_time,
        LendingError::LoanNotOverdue
    );
    
    // Calculate liquidation amount (principal + interest)
    let interest = calculate_interest(loan.amount, loan.interest_rate, loan.start_time)?;
    let liquidation_amount = loan.amount.checked_add(interest).unwrap();
    
    // Transfer tokens from vault to liquidator
    token::transfer(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.token_vault.to_account_info(),
                to: ctx.accounts.liquidator_token_account.to_account_info(),
                authority: lending_pool.to_account_info(),
            },
        ),
        liquidation_amount,
    )?;
    
    // Update loan status
    loan.status = LoanStatus::Defaulted;
    loan.updated_at = current_time;
    
    // Update lending pool
    lending_pool.total_borrowed = lending_pool.total_borrowed.checked_sub(loan.amount).unwrap();
    lending_pool.updated_at = current_time;
    
    Ok(())
}

fn calculate_interest(principal: u64, rate: u64, start_time: i64) -> Result<u64> {
    let current_time = Clock::get()?.unix_timestamp;
    let duration = current_time.checked_sub(start_time).unwrap();
    let interest = principal
        .checked_mul((rate as u128).try_into().unwrap())
        .unwrap()
        .checked_mul((duration as u128).try_into().unwrap())
        .unwrap()
        .checked_div(365 * 24 * 60 * 60 * 100) // 100 for percentage
        .unwrap();
    Ok(interest as u64)
}

#[error_code]
pub enum LendingError {
    #[msg("Loan amount is too small")]
    LoanAmountTooSmall,
    #[msg("Loan amount is too large")]
    LoanAmountTooLarge,
    #[msg("Insufficient liquidity in the pool")]
    InsufficientLiquidity,
    #[msg("Loan is not active")]
    LoanNotActive,
    #[msg("Insufficient repayment amount")]
    InsufficientRepayment,
    #[msg("Loan is not overdue")]
    LoanNotOverdue,
} 