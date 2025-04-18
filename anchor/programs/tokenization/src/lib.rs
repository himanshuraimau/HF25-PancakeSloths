use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount};

declare_id!("7JHfrrDpwArkzZ2dXCpSZoDgcHwBLoMdrcWbRBs3gK4w");

#[program]
pub mod tokenization {
    use super::*;

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
                token::MintTo {
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
                token::Transfer {
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
                token::Burn {
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
}

#[derive(Accounts)]
pub struct CreateToken<'info> {
    #[account(
        init,
        payer = creator,
        space = TokenInfo::LEN
    )]
    pub token_info: Account<'info, TokenInfo>,
    #[account(
        init,
        payer = creator,
        space = 82
    )]
    pub mint: Account<'info, Mint>,
    #[account(
        init,
        payer = creator,
        space = 165
    )]
    pub creator_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub creator: Signer<'info>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct TransferTokens<'info> {
    #[account(mut)]
    pub from: Account<'info, TokenAccount>,
    #[account(mut)]
    pub to: Account<'info, TokenAccount>,
    pub authority: Signer<'info>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct BurnTokens<'info> {
    #[account(mut)]
    pub token_info: Account<'info, TokenInfo>,
    #[account(mut)]
    pub mint: Account<'info, Mint>,
    #[account(mut)]
    pub from: Account<'info, TokenAccount>,
    pub authority: Signer<'info>,
    pub token_program: Program<'info, Token>,
}

#[account]
pub struct TokenInfo {
    pub creator: Pubkey,
    pub mint: Pubkey,
    pub name: String,
    pub symbol: String,
    pub decimals: u8,
    pub total_supply: u64,
    pub status: TokenStatus,
    pub created_at: i64,
    pub updated_at: i64,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum TokenStatus {
    Active,
    Paused,
    Frozen,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct TokenParams {
    pub name: String,
    pub symbol: String,
    pub decimals: u8,
    pub total_supply: u64,
}

impl TokenInfo {
    pub const LEN: usize = 8 + // discriminator
        32 + // creator
        32 + // mint
        4 + 100 + // name (max 100 chars)
        4 + 10 + // symbol (max 10 chars)
        1 + // decimals
        8 + // total_supply
        1 + // status
        8 + // created_at
        8; // updated_at
}

#[error_code]
pub enum TokenizationError {
    #[msg("Invalid token amount")]
    InvalidAmount,
    #[msg("Insufficient balance")]
    InsufficientBalance,
    #[msg("Token is paused")]
    TokenPaused,
    #[msg("Token is frozen")]
    TokenFrozen,
} 