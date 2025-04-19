use anchor_lang::prelude::*;
use anchor_spl::token::{self, MintTo, Transfer, Burn};
use crate::tokenization::state::*;
use crate::tokenization::context::*;

pub fn create_token(
    ctx: Context<CreateToken>,
    params: TokenParams,
) -> Result<()> {
    let token = &mut ctx.accounts.token_info;
    let mint = &ctx.accounts.mint;
    
    // Initialize token
    token.creator = ctx.accounts.creator.key();
    token.mint = mint.key();
    token.name = params.name;
    token.symbol = params.symbol;
    token.decimals = params.decimals;
    token.total_supply = params.total_supply;
    token.status = TokenStatus::Active;
    token.created_at = Clock::get()?.unix_timestamp;
    token.updated_at = Clock::get()?.unix_timestamp;
    
    // Initialize mint
    token::initialize_mint(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            token::InitializeMint {
                mint: mint.to_account_info(),
                rent: ctx.accounts.rent.to_account_info(),
            },
        ),
        params.decimals,
        &ctx.accounts.creator.key(),
        Some(&ctx.accounts.creator.key()),
    )?;
    
    // Mint initial supply
    token::mint_to(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            MintTo {
                mint: mint.to_account_info(),
                to: ctx.accounts.creator_token_account.to_account_info(),
                authority: ctx.accounts.creator.to_account_info(),
            },
        ),
        params.total_supply,
    )?;
    
    Ok(())
}

pub fn transfer_tokens(
    ctx: Context<TransferTokens>,
    amount: u64,
) -> Result<()> {
    // Transfer tokens
    token::transfer(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.from.to_account_info(),
                to: ctx.accounts.to.to_account_info(),
                authority: ctx.accounts.authority.to_account_info(),
            },
        ),
        amount,
    )?;
    
    Ok(())
}

pub fn burn_tokens(
    ctx: Context<BurnTokens>,
    amount: u64,
) -> Result<()> {
    // Burn tokens
    token::burn(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Burn {
                mint: ctx.accounts.mint.to_account_info(),
                from: ctx.accounts.from.to_account_info(),
                authority: ctx.accounts.authority.to_account_info(),
            },
        ),
        amount,
    )?;
    
    // Update token supply
    let token = &mut ctx.accounts.token_info;
    token.total_supply = token.total_supply.checked_sub(amount).unwrap();
    token.updated_at = Clock::get()?.unix_timestamp;
    
    Ok(())
} 