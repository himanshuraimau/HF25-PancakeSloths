use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount};

declare_id!("7JHfrrDpwArkzZ2dXCpSZoDgcHwBLoMdrcWbRBs3gK4w");

#[program]
pub mod tokenization {
    use super::*;

    pub fn initialize_tokenization_project(
        ctx: Context<InitializeTokenizationProject>,
        params: TokenizationParams,
    ) -> Result<()> {
        let project = &mut ctx.accounts.project;
        
        // Initialize project details
        project.owner = ctx.accounts.owner.key();
        project.name = params.name;
        project.description = params.description;
        project.asset_type = params.asset_type;
        project.status = TokenizationStatus::Draft;
        project.target_raise = params.target_raise;
        project.minimum_investment = params.minimum_investment;
        project.token_price = params.token_price;
        project.total_tokens = params.total_tokens;
        project.sold_tokens = 0;
        project.legal_structure = params.legal_structure;
        project.jurisdiction = params.jurisdiction;
        project.risk_level = params.risk_level;
        project.fees = params.fees;
        project.created_at = Clock::get()?.unix_timestamp;
        project.updated_at = Clock::get()?.unix_timestamp;

        Ok(())
    }

    pub fn update_tokenization_status(
        ctx: Context<UpdateTokenizationStatus>,
        new_status: TokenizationStatus,
    ) -> Result<()> {
        let project = &mut ctx.accounts.project;
        require!(
            project.owner == ctx.accounts.owner.key(),
            TokenizationError::Unauthorized
        );
        
        project.status = new_status;
        project.updated_at = Clock::get()?.unix_timestamp;
        
        Ok(())
    }

    pub fn invest_in_project(
        ctx: Context<InvestInProject>,
        amount: u64,
    ) -> Result<()> {
        let project = &mut ctx.accounts.project;
        let investor = &mut ctx.accounts.investor;
        
        // Validate investment amount
        require!(
            amount >= project.minimum_investment,
            TokenizationError::InvestmentBelowMinimum
        );
        
        // Calculate tokens to mint
        let tokens_to_mint = amount.checked_div(project.token_price)
            .ok_or(TokenizationError::Overflow)?;
            
        // Mint tokens to investor
        token::mint_to(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                token::MintTo {
                    mint: ctx.accounts.token_mint.to_account_info(),
                    to: ctx.accounts.investor_token_account.to_account_info(),
                    authority: ctx.accounts.project.to_account_info(),
                },
            ),
            tokens_to_mint,
        )?;
        
        // Update project state
        project.sold_tokens = project.sold_tokens.checked_add(tokens_to_mint)
            .ok_or(TokenizationError::Overflow)?;
            
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeTokenizationProject<'info> {
    #[account(
        init,
        payer = owner,
        space = TokenizationProject::LEN
    )]
    pub project: Account<'info, TokenizationProject>,
    
    #[account(mut)]
    pub owner: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateTokenizationStatus<'info> {
    #[account(mut)]
    pub project: Account<'info, TokenizationProject>,
    pub owner: Signer<'info>,
}

#[derive(Accounts)]
pub struct InvestInProject<'info> {
    #[account(mut)]
    pub project: Account<'info, TokenizationProject>,
    
    #[account(mut)]
    pub investor: Signer<'info>,
    
    #[account(mut)]
    pub token_mint: Account<'info, Mint>,
    
    #[account(mut)]
    pub investor_token_account: Account<'info, TokenAccount>,
    
    pub token_program: Program<'info, Token>,
}

#[account]
pub struct TokenizationProject {
    pub owner: Pubkey,
    pub name: String,
    pub description: String,
    pub asset_type: TokenizedAssetType,
    pub status: TokenizationStatus,
    pub target_raise: u64,
    pub minimum_investment: u64,
    pub token_price: u64,
    pub total_tokens: u64,
    pub sold_tokens: u64,
    pub legal_structure: String,
    pub jurisdiction: String,
    pub risk_level: RiskLevel,
    pub fees: TokenizationFees,
    pub created_at: i64,
    pub updated_at: i64,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct TokenizationParams {
    pub name: String,
    pub description: String,
    pub asset_type: TokenizedAssetType,
    pub target_raise: u64,
    pub minimum_investment: u64,
    pub token_price: u64,
    pub total_tokens: u64,
    pub legal_structure: String,
    pub jurisdiction: String,
    pub risk_level: RiskLevel,
    pub fees: TokenizationFees,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum TokenizedAssetType {
    RealEstate,
    Equity,
    Debt,
    Commodity,
    Art,
    IntellectualProperty,
    Infrastructure,
    Other,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum TokenizationStatus {
    Draft,
    PendingReview,
    Approved,
    Active,
    Funded,
    Completed,
    Rejected,
    Cancelled,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum RiskLevel {
    Low,
    Medium,
    High,
    VeryHigh,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct TokenizationFees {
    pub platform_fee: u64,
    pub management_fee: u64,
    pub performance_fee: u64,
    pub entry_fee: u64,
    pub exit_fee: u64,
}

#[error_code]
pub enum TokenizationError {
    #[msg("Unauthorized access")]
    Unauthorized,
    #[msg("Investment amount below minimum")]
    InvestmentBelowMinimum,
    #[msg("Arithmetic overflow")]
    Overflow,
}

impl TokenizationProject {
    pub const LEN: usize = 8 + // discriminator
        32 + // owner
        4 + 100 + // name (max 100 chars)
        4 + 500 + // description (max 500 chars)
        1 + // asset_type
        1 + // status
        8 + // target_raise
        8 + // minimum_investment
        8 + // token_price
        8 + // total_tokens
        8 + // sold_tokens
        4 + 50 + // legal_structure (max 50 chars)
        4 + 50 + // jurisdiction (max 50 chars)
        1 + // risk_level
        40 + // fees
        8 + // created_at
        8; // updated_at
} 