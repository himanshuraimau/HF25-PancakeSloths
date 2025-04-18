use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount};

declare_id!("598Swc49CxCyKgdqA3LCLSYQu8r6sninckgSeZdisjiP");

#[program]
pub mod user_management {
    use super::*;

    pub fn create_user_profile(
        ctx: Context<CreateUserProfile>,
        params: UserProfileParams,
    ) -> Result<()> {
        let user_profile = &mut ctx.accounts.user_profile;
        
        // Initialize user profile
        user_profile.owner = ctx.accounts.owner.key();
        user_profile.full_name = params.full_name;
        user_profile.email = params.email;
        user_profile.role = params.role;
        user_profile.status = UserStatus::Active;
        user_profile.created_at = Clock::get()?.unix_timestamp;
        user_profile.updated_at = Clock::get()?.unix_timestamp;
        user_profile.kyc_status = KycStatus::Pending;
        user_profile.accredited_status = false;
        user_profile.two_factor_enabled = false;

        Ok(())
    }

    pub fn update_user_profile(
        ctx: Context<UpdateUserProfile>,
        params: UpdateUserProfileParams,
    ) -> Result<()> {
        let user_profile = &mut ctx.accounts.user_profile;
        require!(
            user_profile.owner == ctx.accounts.owner.key(),
            UserError::Unauthorized
        );
        
        // Update allowed fields
        if let Some(full_name) = params.full_name {
            user_profile.full_name = full_name;
        }
        if let Some(role) = params.role {
            user_profile.role = role;
        }
        if let Some(status) = params.status {
            user_profile.status = status;
        }
        
        user_profile.updated_at = Clock::get()?.unix_timestamp;
        
        Ok(())
    }

    pub fn enable_two_factor(
        ctx: Context<EnableTwoFactor>,
        secret: String,
        backup_codes: Vec<String>,
    ) -> Result<()> {
        let user_profile = &mut ctx.accounts.user_profile;
        require!(
            user_profile.owner == ctx.accounts.owner.key(),
            UserError::Unauthorized
        );
        
        user_profile.two_factor_secret = Some(secret);
        user_profile.two_factor_backup_codes = backup_codes;
        user_profile.two_factor_enabled = true;
        user_profile.updated_at = Clock::get()?.unix_timestamp;
        
        Ok(())
    }

    pub fn verify_kyc(
        ctx: Context<VerifyKyc>,
        kyc_data: KycData,
    ) -> Result<()> {
        let user_profile = &mut ctx.accounts.user_profile;
        require!(
            ctx.accounts.verifier.key() == ctx.accounts.kyc_authority.key(),
            UserError::Unauthorized
        );
        
        user_profile.kyc_status = KycStatus::Verified;
        user_profile.kyc_data = Some(kyc_data);
        user_profile.kyc_verified_at = Some(Clock::get()?.unix_timestamp);
        user_profile.updated_at = Clock::get()?.unix_timestamp;
        
        Ok(())
    }
}

#[derive(Accounts)]
pub struct CreateUserProfile<'info> {
    #[account(
        init,
        payer = owner,
        space = UserProfile::LEN
    )]
    pub user_profile: Account<'info, UserProfile>,
    
    #[account(mut)]
    pub owner: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateUserProfile<'info> {
    #[account(mut)]
    pub user_profile: Account<'info, UserProfile>,
    pub owner: Signer<'info>,
}

#[derive(Accounts)]
pub struct EnableTwoFactor<'info> {
    #[account(mut)]
    pub user_profile: Account<'info, UserProfile>,
    pub owner: Signer<'info>,
}

#[derive(Accounts)]
pub struct VerifyKyc<'info> {
    #[account(mut)]
    pub user_profile: Account<'info, UserProfile>,
    
    /// CHECK: This is the KYC authority
    pub kyc_authority: AccountInfo<'info>,
    
    pub verifier: Signer<'info>,
}

#[account]
pub struct UserProfile {
    pub owner: Pubkey,
    pub full_name: String,
    pub email: String,
    pub role: UserRole,
    pub status: UserStatus,
    pub kyc_status: KycStatus,
    pub kyc_data: Option<KycData>,
    pub kyc_verified_at: Option<i64>,
    pub accredited_status: bool,
    pub two_factor_enabled: bool,
    pub two_factor_secret: Option<String>,
    pub two_factor_backup_codes: Vec<String>,
    pub created_at: i64,
    pub updated_at: i64,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct UserProfileParams {
    pub full_name: String,
    pub email: String,
    pub role: UserRole,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct UpdateUserProfileParams {
    pub full_name: Option<String>,
    pub role: Option<UserRole>,
    pub status: Option<UserStatus>,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct KycData {
    pub document_type: String,
    pub document_number: String,
    pub country: String,
    pub verified_by: String,
    pub verification_date: i64,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum UserRole {
    Admin,
    Investor,
    Issuer,
    Verifier,
    User,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum UserStatus {
    Active,
    Inactive,
    Suspended,
    Banned,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum KycStatus {
    Pending,
    Verified,
    Rejected,
    Expired,
}

#[error_code]
pub enum UserError {
    #[msg("Unauthorized access")]
    Unauthorized,
    #[msg("Invalid KYC data")]
    InvalidKycData,
    #[msg("User already exists")]
    UserExists,
    #[msg("User not found")]
    UserNotFound,
}

impl UserProfile {
    pub const LEN: usize = 8 + // discriminator
        32 + // owner
        4 + 100 + // full_name (max 100 chars)
        4 + 100 + // email (max 100 chars)
        1 + // role
        1 + // status
        1 + // kyc_status
        1 + 200 + // kyc_data (optional, max 200 bytes)
        8 + // kyc_verified_at (optional)
        1 + // accredited_status
        1 + // two_factor_enabled
        1 + 32 + // two_factor_secret (optional, max 32 chars)
        4 + 10 * 32 + // two_factor_backup_codes (max 10 codes, 32 chars each)
        8 + // created_at
        8; // updated_at
} 