use anchor_lang::prelude::*;

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