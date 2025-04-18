use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount};

declare_id!("Lending1111111111111111111111111111111111111");

#[program]
pub mod lending {
    use super::*;

    pub fn create_loan_pool(
        ctx: Context<CreateLoanPool>,
        params: LoanPoolParams,
    ) -> Result<()> {
        let loan_pool = &mut ctx.accounts.loan_pool;
        
        // Initialize loan pool
        loan_pool.creator = ctx.accounts.creator.key();
        loan_pool.name = params.name;
        loan_pool.description = params.description;
        loan_pool.asset_type = params.asset_type;
        loan_pool.status = LoanPoolStatus::Active;
        loan_pool.interest_rate = params.interest_rate;
        loan_pool.max_loan_amount = params.max_loan_amount;
        loan_pool.min_loan_amount = params.min_loan_amount;
        loan_pool.loan_term = params.loan_term;
        loan_pool.collateral_ratio = params.collateral_ratio;
        loan_pool.total_loans = 0;
        loan_pool.total_borrowed = 0;
        loan_pool.total_available = params.max_loan_amount;
        loan_pool.created_at = Clock::get()?.unix_timestamp;
        loan_pool.updated_at = Clock::get()?.unix_timestamp;

        Ok(())
    }

    pub fn request_loan(
        ctx: Context<RequestLoan>,
        params: LoanRequestParams,
    ) -> Result<()> {
        let loan = &mut ctx.accounts.loan;
        let loan_pool = &mut ctx.accounts.loan_pool;
        
        // Validate loan request
        require!(
            params.amount >= loan_pool.min_loan_amount && 
            params.amount <= loan_pool.max_loan_amount,
            LendingError::InvalidLoanAmount
        );
        
        require!(
            loan_pool.total_available >= params.amount,
            LendingError::InsufficientFunds
        );
        
        // Calculate required collateral
        let required_collateral = params.amount
            .checked_mul(loan_pool.collateral_ratio)
            .ok_or(LendingError::Overflow)?
            .checked_div(100)
            .ok_or(LendingError::Overflow)?;
        
        // Initialize loan
        loan.borrower = ctx.accounts.borrower.key();
        loan.loan_pool = loan_pool.key();
        loan.amount = params.amount;
        loan.interest_rate = loan_pool.interest_rate;
        loan.term = loan_pool.loan_term;
        loan.status = LoanStatus::Pending;
        loan.collateral_amount = required_collateral;
        loan.remaining_amount = params.amount;
        loan.created_at = Clock::get()?.unix_timestamp;
        loan.updated_at = Clock::get()?.unix_timestamp;
        
        // Update loan pool
        loan_pool.total_available = loan_pool.total_available
            .checked_sub(params.amount)
            .ok_or(LendingError::Overflow)?;
        
        Ok(())
    }

    pub fn approve_loan(
        ctx: Context<ApproveLoan>,
    ) -> Result<()> {
        let loan = &mut ctx.accounts.loan;
        let loan_pool = &mut ctx.accounts.loan_pool;
        
        require!(
            loan.status == LoanStatus::Pending,
            LendingError::InvalidLoanStatus
        );
        
        // Transfer collateral to loan pool
        token::transfer(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                token::Transfer {
                    from: ctx.accounts.borrower_collateral_account.to_account_info(),
                    to: ctx.accounts.loan_pool_collateral_account.to_account_info(),
                    authority: ctx.accounts.borrower.to_account_info(),
                },
            ),
            loan.collateral_amount,
        )?;
        
        // Update loan status
        loan.status = LoanStatus::Active;
        loan.approved_at = Some(Clock::get()?.unix_timestamp);
        loan.updated_at = Clock::get()?.unix_timestamp;
        
        // Update loan pool
        loan_pool.total_loans = loan_pool.total_loans.checked_add(1)
            .ok_or(LendingError::Overflow)?;
        loan_pool.total_borrowed = loan_pool.total_borrowed.checked_add(loan.amount)
            .ok_or(LendingError::Overflow)?;
        
        Ok(())
    }

    pub fn make_payment(
        ctx: Context<MakePayment>,
        amount: u64,
    ) -> Result<()> {
        let loan = &mut ctx.accounts.loan;
        
        require!(
            loan.status == LoanStatus::Active,
            LendingError::InvalidLoanStatus
        );
        
        // Calculate interest
        let interest = calculate_interest(loan.amount, loan.interest_rate)?;
        
        // Update loan state
        loan.remaining_amount = loan.remaining_amount
            .checked_sub(amount)
            .ok_or(LendingError::Overflow)?;
        
        // If loan is fully paid
        if loan.remaining_amount == 0 {
            loan.status = LoanStatus::Completed;
            // Return collateral to borrower
            token::transfer(
                CpiContext::new(
                    ctx.accounts.token_program.to_account_info(),
                    token::Transfer {
                        from: ctx.accounts.loan_pool_collateral_account.to_account_info(),
                        to: ctx.accounts.borrower_collateral_account.to_account_info(),
                        authority: ctx.accounts.loan_pool_authority.to_account_info(),
                    },
                ),
                loan.collateral_amount,
            )?;
        }
        
        loan.updated_at = Clock::get()?.unix_timestamp;
        
        Ok(())
    }
}

fn calculate_interest(principal: u64, rate: u64) -> Result<u64> {
    principal
        .checked_mul(rate)
        .ok_or(LendingError::Overflow)?
        .checked_div(100)
        .ok_or(LendingError::Overflow)
}

#[derive(Accounts)]
pub struct CreateLoanPool<'info> {
    #[account(
        init,
        payer = creator,
        space = LoanPool::LEN
    )]
    pub loan_pool: Account<'info, LoanPool>,
    
    #[account(mut)]
    pub creator: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct RequestLoan<'info> {
    #[account(
        init,
        payer = borrower,
        space = Loan::LEN
    )]
    pub loan: Account<'info, Loan>,
    
    #[account(mut)]
    pub loan_pool: Account<'info, LoanPool>,
    
    #[account(mut)]
    pub borrower: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ApproveLoan<'info> {
    #[account(mut)]
    pub loan: Account<'info, Loan>,
    
    #[account(mut)]
    pub loan_pool: Account<'info, LoanPool>,
    
    #[account(mut)]
    pub borrower: Signer<'info>,
    
    #[account(mut)]
    pub borrower_collateral_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub loan_pool_collateral_account: Account<'info, TokenAccount>,
    
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct MakePayment<'info> {
    #[account(mut)]
    pub loan: Account<'info, Loan>,
    
    #[account(mut)]
    pub borrower: Signer<'info>,
    
    #[account(mut)]
    pub loan_pool_collateral_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub borrower_collateral_account: Account<'info, TokenAccount>,
    
    /// CHECK: This is the loan pool authority
    pub loan_pool_authority: AccountInfo<'info>,
    
    pub token_program: Program<'info, Token>,
}

#[account]
pub struct LoanPool {
    pub creator: Pubkey,
    pub name: String,
    pub description: String,
    pub asset_type: AssetType,
    pub status: LoanPoolStatus,
    pub interest_rate: u64,
    pub max_loan_amount: u64,
    pub min_loan_amount: u64,
    pub loan_term: u64,
    pub collateral_ratio: u64,
    pub total_loans: u64,
    pub total_borrowed: u64,
    pub total_available: u64,
    pub created_at: i64,
    pub updated_at: i64,
}

#[account]
pub struct Loan {
    pub borrower: Pubkey,
    pub loan_pool: Pubkey,
    pub amount: u64,
    pub interest_rate: u64,
    pub term: u64,
    pub status: LoanStatus,
    pub collateral_amount: u64,
    pub remaining_amount: u64,
    pub approved_at: Option<i64>,
    pub created_at: i64,
    pub updated_at: i64,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct LoanPoolParams {
    pub name: String,
    pub description: String,
    pub asset_type: AssetType,
    pub interest_rate: u64,
    pub max_loan_amount: u64,
    pub min_loan_amount: u64,
    pub loan_term: u64,
    pub collateral_ratio: u64,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct LoanRequestParams {
    pub amount: u64,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum AssetType {
    RealEstate,
    Art,
    Collectibles,
    Other,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum LoanPoolStatus {
    Active,
    Paused,
    Closed,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum LoanStatus {
    Pending,
    Active,
    Completed,
    Defaulted,
    Cancelled,
}

#[error_code]
pub enum LendingError {
    #[msg("Invalid loan amount")]
    InvalidLoanAmount,
    #[msg("Insufficient funds in loan pool")]
    InsufficientFunds,
    #[msg("Invalid loan status")]
    InvalidLoanStatus,
    #[msg("Arithmetic overflow")]
    Overflow,
}

impl LoanPool {
    pub const LEN: usize = 8 + // discriminator
        32 + // creator
        4 + 100 + // name (max 100 chars)
        4 + 500 + // description (max 500 chars)
        1 + // asset_type
        1 + // status
        8 + // interest_rate
        8 + // max_loan_amount
        8 + // min_loan_amount
        8 + // loan_term
        8 + // collateral_ratio
        8 + // total_loans
        8 + // total_borrowed
        8 + // total_available
        8 + // created_at
        8; // updated_at
}

impl Loan {
    pub const LEN: usize = 8 + // discriminator
        32 + // borrower
        32 + // loan_pool
        8 + // amount
        8 + // interest_rate
        8 + // term
        1 + // status
        8 + // collateral_amount
        8 + // remaining_amount
        1 + 8 + // approved_at (optional)
        8 + // created_at
        8; // updated_at
} 