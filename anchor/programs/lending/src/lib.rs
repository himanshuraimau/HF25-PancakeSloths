use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount};

declare_id!("5J7J6ReABPxr6ZDoWuokyqwT8M6ehNDQ8fm5GrF9QryK");

#[program]
pub mod lending {
    use super::*;

    pub fn create_loan_pool(
        ctx: Context<CreateLoanPool>,
        params: LoanPoolParams,
    ) -> Result<()> {
        let loan_pool = &mut ctx.accounts.loan_pool;
        
        // Initialize loan pool
        loan_pool.authority = ctx.accounts.authority.key();
        loan_pool.name = params.name;
        loan_pool.description = params.description;
        loan_pool.asset_type = params.asset_type;
        loan_pool.interest_rate = params.interest_rate;
        loan_pool.max_loan_amount = params.max_loan_amount;
        loan_pool.min_loan_amount = params.min_loan_amount;
        loan_pool.loan_term = params.loan_term;
        loan_pool.collateral_ratio = params.collateral_ratio;
        loan_pool.status = LoanPoolStatus::Active;
        loan_pool.total_loans = 0;
        loan_pool.total_borrowed = 0;
        loan_pool.available_funds = params.max_loan_amount;
        loan_pool.created_at = Clock::get()?.unix_timestamp;
        loan_pool.updated_at = Clock::get()?.unix_timestamp;
        
        Ok(())
    }

    pub fn request_loan(
        ctx: Context<RequestLoan>,
        amount: u64,
    ) -> Result<()> {
        let loan = &mut ctx.accounts.loan;
        let loan_pool = &mut ctx.accounts.loan_pool;
        
        // Validate loan request
        require!(
            amount >= loan_pool.min_loan_amount && amount <= loan_pool.available_funds,
            LendingError::InvalidLoanAmount
        );
        
        // Initialize loan
        loan.borrower = ctx.accounts.borrower.key();
        loan.loan_pool = loan_pool.key();
        loan.amount = amount;
        loan.interest_rate = loan_pool.interest_rate;
        loan.term = loan_pool.loan_term;
        loan.status = LoanStatus::Requested;
        loan.created_at = Clock::get()?.unix_timestamp;
        loan.updated_at = Clock::get()?.unix_timestamp;
        
        // Update loan pool
        loan_pool.available_funds = loan_pool.available_funds.checked_sub(amount).unwrap();
        loan_pool.updated_at = Clock::get()?.unix_timestamp;
        
        Ok(())
    }

    pub fn approve_loan(
        ctx: Context<ApproveLoan>,
    ) -> Result<()> {
        let loan = &mut ctx.accounts.loan;
        let loan_pool = &mut ctx.accounts.loan_pool;
        
        // Validate loan status
        require!(loan.status == LoanStatus::Requested, LendingError::InvalidLoanStatus);
        
        // Update loan status
        loan.status = LoanStatus::Active;
        loan.updated_at = Clock::get()?.unix_timestamp;
        
        // Update loan pool
        loan_pool.total_loans = loan_pool.total_loans.checked_add(1).unwrap();
        loan_pool.total_borrowed = loan_pool.total_borrowed.checked_add(loan.amount).unwrap();
        loan_pool.updated_at = Clock::get()?.unix_timestamp;
        
        Ok(())
    }

    pub fn make_payment(
        ctx: Context<MakePayment>,
        amount: u64,
    ) -> Result<()> {
        let loan = &mut ctx.accounts.loan;
        let loan_pool = &mut ctx.accounts.loan_pool;
        
        // Validate loan status
        require!(loan.status == LoanStatus::Active, LendingError::InvalidLoanStatus);
        
        // Calculate interest
        let interest = calculate_interest(loan.amount, loan.interest_rate, loan.term);
        let total_payment = amount.checked_add(interest).unwrap();
        
        // Update loan
        loan.amount = loan.amount.checked_sub(amount).unwrap();
        loan.updated_at = Clock::get()?.unix_timestamp;
        
        // Check if loan is fully paid
        if loan.amount == 0 {
            loan.status = LoanStatus::Completed;
        }
        
        // Update loan pool
        loan_pool.available_funds = loan_pool.available_funds.checked_add(total_payment).unwrap();
        loan_pool.updated_at = Clock::get()?.unix_timestamp;
        
        Ok(())
    }
}

#[derive(Accounts)]
pub struct CreateLoanPool<'info> {
    #[account(
        init,
        payer = authority,
        space = LoanPool::LEN
    )]
    pub loan_pool: Account<'info, LoanPool>,
    #[account(mut)]
    pub authority: Signer<'info>,
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
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct MakePayment<'info> {
    #[account(mut)]
    pub loan: Account<'info, Loan>,
    #[account(mut)]
    pub loan_pool: Account<'info, LoanPool>,
    #[account(mut)]
    pub borrower: Signer<'info>,
}

#[account]
pub struct LoanPool {
    pub authority: Pubkey,
    pub name: String,
    pub description: String,
    pub asset_type: AssetType,
    pub interest_rate: u64,
    pub max_loan_amount: u64,
    pub min_loan_amount: u64,
    pub loan_term: u64,
    pub collateral_ratio: u64,
    pub status: LoanPoolStatus,
    pub total_loans: u64,
    pub total_borrowed: u64,
    pub available_funds: u64,
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
    pub created_at: i64,
    pub updated_at: i64,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum AssetType {
    RealEstate,
    Vehicle,
    Equipment,
    Other,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum LoanPoolStatus {
    Active,
    Paused,
    Closed,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum LoanStatus {
    Requested,
    Active,
    Completed,
    Defaulted,
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

#[error_code]
pub enum LendingError {
    #[msg("Invalid loan amount")]
    InvalidLoanAmount,
    #[msg("Invalid loan status")]
    InvalidLoanStatus,
    #[msg("Insufficient funds")]
    InsufficientFunds,
}

impl LoanPool {
    pub const LEN: usize = 8 + // discriminator
        32 + // authority
        4 + 100 + // name (max 100 chars)
        4 + 500 + // description (max 500 chars)
        1 + // asset_type
        8 + // interest_rate
        8 + // max_loan_amount
        8 + // min_loan_amount
        8 + // loan_term
        8 + // collateral_ratio
        1 + // status
        8 + // total_loans
        8 + // total_borrowed
        8 + // available_funds
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
        8 + // created_at
        8; // updated_at
}

fn calculate_interest(amount: u64, rate: u64, term: u64) -> u64 {
    // Simple interest calculation: I = P * r * t
    amount.checked_mul(rate).unwrap().checked_mul(term).unwrap().checked_div(10000).unwrap()
} 