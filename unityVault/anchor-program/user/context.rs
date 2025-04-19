use anchor_lang::prelude::*;
use crate::user::state::*;

#[derive(Accounts)]
pub struct CreateUserProfile<'info> {
    #[account(
        init,
        payer = authority,
        space = UserProfile::LEN
    )]
    pub user_profile: Account<'info, UserProfile>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateUserProfile<'info> {
    #[account(
        mut,
        has_one = authority
    )]
    pub user_profile: Account<'info, UserProfile>,
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct EnableTwoFactor<'info> {
    #[account(
        mut,
        has_one = authority
    )]
    pub user_profile: Account<'info, UserProfile>,
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct VerifyKyc<'info> {
    #[account(
        mut,
        has_one = authority
    )]
    pub user_profile: Account<'info, UserProfile>,
    pub authority: Signer<'info>,
} 