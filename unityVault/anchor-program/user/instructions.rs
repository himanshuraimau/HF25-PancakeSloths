use anchor_lang::prelude::*;
use crate::user::state::*;
use crate::user::context::*;

#[cfg(test)]
mod tests {
    use super::*;
    use anchor_lang::solana_program::test::*;
    use anchor_lang::solana_program::pubkey::Pubkey;
    use anchor_lang::solana_program::account_info::AccountInfo;
    use anchor_lang::solana_program::system_program;
    use std::cell::RefCell;

    fn create_test_account(lamports: u64, owner: &Pubkey, data: &[u8]) -> AccountInfo {
        let account = AccountInfo::new(
            &Pubkey::new_unique(),
            false,
            false,
            lamports,
            data.to_vec(),
            owner,
            false,
            0,
        );
        account
    }

    #[test]
    fn test_create_user_profile() {
        let program_id = Pubkey::new_unique();
        let authority = Pubkey::new_unique();
        
        // Create user profile account
        let user_profile = Pubkey::new_unique();
        let mut user_profile_data = vec![0; UserProfile::LEN];
        let user_profile_account = create_test_account(
            1000000000,
            &program_id,
            &user_profile_data
        );
        
        // Create authority account
        let authority_account = create_test_account(
            1000000000,
            &system_program::id(),
            &[]
        );
        
        // Create system program account
        let system_program_account = create_test_account(
            0,
            &system_program::id(),
            &[]
        );
        
        let accounts = vec![
            user_profile_account,
            authority_account,
            system_program_account,
        ];
        
        let params = UserProfileParams {
            full_name: "Test User".to_string(),
            email: "test@example.com".to_string(),
            role: UserRole::User,
        };
        
        let result = create_user_profile(
            &program_id,
            &accounts,
            params
        );
        
        assert!(result.is_ok());
    }

    #[test]
    fn test_update_user_profile() {
        let program_id = Pubkey::new_unique();
        let authority = Pubkey::new_unique();
        
        // Create initial user profile
        let user_profile = Pubkey::new_unique();
        let mut user_profile_data = UserProfile {
            is_initialized: true,
            authority,
            full_name: "Old Name".to_string(),
            email: "old@example.com".to_string(),
            role: UserRole::User,
            status: UserStatus::Active,
            two_factor_enabled: false,
            two_factor_secret: String::new(),
            two_factor_backup_codes: Vec::new(),
            kyc_verified: false,
            kyc_status: KycStatus::Pending,
            kyc_data: KycData {
                document_type: String::new(),
                document_number: String::new(),
                verified_at: 0,
            },
            accredited_status: false,
            created_at: 0,
            updated_at: 0,
        };
        
        let mut data = vec![0; UserProfile::LEN];
        user_profile_data.pack_into_slice(&mut data);
        
        let user_profile_account = create_test_account(
            1000000000,
            &program_id,
            &data
        );
        
        // Create authority account
        let authority_account = create_test_account(
            1000000000,
            &system_program::id(),
            &[]
        );
        
        let accounts = vec![
            user_profile_account,
            authority_account,
        ];
        
        let params = UserProfileParams {
            full_name: "New Name".to_string(),
            email: "new@example.com".to_string(),
            role: UserRole::Moderator,
        };
        
        let result = update_user_profile(
            &program_id,
            &accounts,
            params
        );
        
        assert!(result.is_ok());
    }

    #[test]
    fn test_enable_two_factor() {
        let program_id = Pubkey::new_unique();
        let authority = Pubkey::new_unique();
        
        // Create initial user profile
        let user_profile = Pubkey::new_unique();
        let mut user_profile_data = UserProfile {
            is_initialized: true,
            authority,
            full_name: "Test User".to_string(),
            email: "test@example.com".to_string(),
            role: UserRole::User,
            status: UserStatus::Active,
            two_factor_enabled: false,
            two_factor_secret: String::new(),
            two_factor_backup_codes: Vec::new(),
            kyc_verified: false,
            kyc_status: KycStatus::Pending,
            kyc_data: KycData {
                document_type: String::new(),
                document_number: String::new(),
                verified_at: 0,
            },
            accredited_status: false,
            created_at: 0,
            updated_at: 0,
        };
        
        let mut data = vec![0; UserProfile::LEN];
        user_profile_data.pack_into_slice(&mut data);
        
        let user_profile_account = create_test_account(
            1000000000,
            &program_id,
            &data
        );
        
        // Create authority account
        let authority_account = create_test_account(
            1000000000,
            &system_program::id(),
            &[]
        );
        
        let accounts = vec![
            user_profile_account,
            authority_account,
        ];
        
        let secret = "test_secret".to_string();
        let backup_codes = vec!["code1".to_string(), "code2".to_string()];
        
        let result = enable_two_factor(
            &program_id,
            &accounts,
            secret,
            backup_codes
        );
        
        assert!(result.is_ok());
    }
}

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