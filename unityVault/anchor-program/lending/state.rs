use anchor_lang::prelude::*;

#[account]
pub struct LendingPool {
    pub authority: Pubkey,
    pub token_mint: Pubkey,
    pub token_vault: Pubkey,
    pub interest_rate: u64,
    pub max_loan_amount: u64,
    pub min_loan_amount: u64,
    pub total_borrowed: u64,
    pub total_deposited: u64,
    pub created_at: i64,
    pub updated_at: i64,
}

#[account]
pub struct Loan {
    pub borrower: Pubkey,
    pub lending_pool: Pubkey,
    pub amount: u64,
    pub interest_rate: u64,
    pub start_time: i64,
    pub due_time: i64,
    pub status: LoanStatus,
    pub created_at: i64,
    pub updated_at: i64,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum LoanStatus {
    Active,
    Repaid,
    Defaulted,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct LendingPoolParams {
    pub interest_rate: u64,
    pub max_loan_amount: u64,
    pub min_loan_amount: u64,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct LoanParams {
    pub amount: u64,
    pub duration: i64,
}

impl LendingPool {
    pub const LEN: usize = 8 + // discriminator
        32 + // authority
        32 + // token_mint
        32 + // token_vault
        8 + // interest_rate
        8 + // max_loan_amount
        8 + // min_loan_amount
        8 + // total_borrowed
        8 + // total_deposited
        8 + // created_at
        8; // updated_at
}

impl Loan {
    pub const LEN: usize = 8 + // discriminator
        32 + // borrower
        32 + // lending_pool
        8 + // amount
        8 + // interest_rate
        8 + // start_time
        8 + // due_time
        1 + // status
        8 + // created_at
        8; // updated_at
} 