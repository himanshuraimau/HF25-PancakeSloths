use anchor_lang::prelude::*;

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