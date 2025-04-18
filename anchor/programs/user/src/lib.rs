use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount};

declare_id!("598Swc49CxCyKgdqA3LCLSYQu8r6sninckgSeZdisjiP");

#[program]
pub mod user {
    use super::*;

    pub fn create_user_profile(
        ctx: Context<CreateUserProfile>,
        params: UserProfileParams,
    ) -> Result<()> {
        let user_profile = &mut ctx.accounts.user_profile;
        
        // Initialize user profile
        user_profile.authority = ctx.accounts.authority.key();
        user_profile.full_name = params.full_name;
        user_profile.email = params.email;
        user_profile.role = params.role;
        user_profile.status = UserStatus::Active;
        user_profile.two_factor_enabled = false;
        user_profile.two_factor_secret = String::new();
        user_profile.two_factor_backup_codes = Vec::new();
        user_profile.kyc_verified = false;
        user_profile.kyc_status = KycStatus::Pending;
        user_profile.kyc_data = KycData {
            document_type: String::new(),
            document_number: String::new(),
            verified_at: 0,
        };
        user_profile.accredited_status = false;
        user_profile.created_at = Clock::get()?.unix_timestamp;
        user_profile.updated_at = Clock::get()?.unix_timestamp;
        
        Ok(())
    }

    pub fn update_user_profile(
        ctx: Context<UpdateUserProfile>,
        params: UserProfileParams,
    ) -> Result<()> {
        let user_profile = &mut ctx.accounts.user_profile;
        
        // Update allowed fields
        user_profile.full_name = params.full_name;
        user_profile.email = params.email;
        user_profile.role = params.role;
        user_profile.updated_at = Clock::get()?.unix_timestamp;
        
        Ok(())
    }

    pub fn enable_two_factor(
        ctx: Context<EnableTwoFactor>,
        secret: String,
        backup_codes: Vec<String>,
    ) -> Result<()> {
        let user_profile = &mut ctx.accounts.user_profile;
        
        // Enable 2FA
        user_profile.two_factor_enabled = true;
        user_profile.two_factor_secret = secret;
        user_profile.two_factor_backup_codes = backup_codes;
        user_profile.updated_at = Clock::get()?.unix_timestamp;
        
        Ok(())
    }

    pub fn verify_kyc(
        ctx: Context<VerifyKyc>,
        kyc_data: KycData,
    ) -> Result<()> {
        let user_profile = &mut ctx.accounts.user_profile;
        
        // Verify KYC
        user_profile.kyc_verified = true;
        user_profile.kyc_status = KycStatus::Verified;
        user_profile.kyc_data = kyc_data;
        user_profile.updated_at = Clock::get()?.unix_timestamp;
        
        Ok(())
    }
}

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

#[account]
pub struct UserProfile {
    pub authority: Pubkey,
    pub full_name: String,
    pub email: String,
    pub role: UserRole,
    pub status: UserStatus,
    pub two_factor_enabled: bool,
    pub two_factor_secret: String,
    pub two_factor_backup_codes: Vec<String>,
    pub kyc_verified: bool,
    pub kyc_status: KycStatus,
    pub kyc_data: KycData,
    pub accredited_status: bool,
    pub created_at: i64,
    pub updated_at: i64,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum UserRole {
    Admin,
    Moderator,
    User,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum UserStatus {
    Active,
    Suspended,
    Banned,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum KycStatus {
    Pending,
    Verified,
    Rejected,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct UserProfileParams {
    pub full_name: String,
    pub email: String,
    pub role: UserRole,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct KycData {
    pub document_type: String,
    pub document_number: String,
    pub verified_at: i64,
}

impl UserProfile {
    pub const LEN: usize = 8 + // discriminator
        32 + // authority
        4 + 100 + // full_name (max 100 chars)
        4 + 100 + // email (max 100 chars)
        1 + // role
        1 + // status
        1 + // two_factor_enabled
        4 + 100 + // two_factor_secret (max 100 chars)
        4 + 10 * 50 + // two_factor_backup_codes (max 10 codes, 50 chars each)
        1 + // kyc_verified
        1 + // kyc_status
        4 + 100 + // kyc_data.document_type (max 100 chars)
        4 + 100 + // kyc_data.document_number (max 100 chars)
        8 + // kyc_data.verified_at
        1 + // accredited_status
        8 + // created_at
        8; // updated_at
} 