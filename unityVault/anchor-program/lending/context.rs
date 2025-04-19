use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token, TokenAccount};
use crate::lending::state::*;

#[derive(Accounts)]
pub struct CreateLendingPool<'info> {
    #[account(
        init,
        payer = authority,
        space = LendingPool::LEN
    )]
    pub lending_pool: Account<'info, LendingPool>,
    
    #[account(mut)]
    pub token_vault: Account<'info, TokenAccount>,
    
    pub token_mint: Account<'info, Mint>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CreateLoan<'info> {
    #[account(
        init,
        payer = borrower,
        space = Loan::LEN
    )]
    pub loan: Account<'info, Loan>,
    
    #[account(mut)]
    pub lending_pool: Account<'info, LendingPool>,
    
    #[account(mut)]
    pub token_vault: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub borrower_token_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub borrower: Signer<'info>,
    
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct RepayLoan<'info> {
    #[account(mut)]
    pub loan: Account<'info, Loan>,
    
    #[account(mut)]
    pub lending_pool: Account<'info, LendingPool>,
    
    #[account(mut)]
    pub token_vault: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub borrower_token_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub borrower: Signer<'info>,
    
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct LiquidateLoan<'info> {
    #[account(mut)]
    pub loan: Account<'info, Loan>,
    
    #[account(mut)]
    pub lending_pool: Account<'info, LendingPool>,
    
    #[account(mut)]
    pub token_vault: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub liquidator_token_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub liquidator: Signer<'info>,
    
    pub token_program: Program<'info, Token>,
} 