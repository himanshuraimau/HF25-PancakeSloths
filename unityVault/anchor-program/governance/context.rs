use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token, TokenAccount};
use crate::governance::state::*;

#[derive(Accounts)]
pub struct CreateGovernance<'info> {
    #[account(
        init,
        payer = authority,
        space = Governance::LEN
    )]
    pub governance: Account<'info, Governance>,
    
    pub voting_token_mint: Account<'info, Mint>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CreateProposal<'info> {
    #[account(
        init,
        payer = proposer,
        space = Proposal::LEN
    )]
    pub proposal: Account<'info, Proposal>,
    
    #[account(mut)]
    pub governance: Account<'info, Governance>,
    
    #[account(mut)]
    pub proposer: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CastVote<'info> {
    #[account(
        init,
        payer = voter,
        space = Vote::LEN
    )]
    pub vote: Account<'info, Vote>,
    
    #[account(mut)]
    pub proposal: Account<'info, Proposal>,
    
    #[account(mut)]
    pub governance: Account<'info, Governance>,
    
    #[account(mut)]
    pub voter_token_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub voter: Signer<'info>,
    
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ExecuteProposal<'info> {
    #[account(mut)]
    pub proposal: Account<'info, Proposal>,
    
    #[account(mut)]
    pub governance: Account<'info, Governance>,
    
    pub authority: Signer<'info>,
} 