use solana_program::{
    account_info::{next_account_info, AccountInfo},
    clock::Clock,
    entrypoint::ProgramResult,
    program_error::ProgramError,
    program_pack::Pack,
    pubkey::Pubkey,
    sysvar::Sysvar,
};
use crate::user::state::{UserProfile, UserRole, UserStatus, KycStatus, KycData};
use borsh::{BorshSerialize, BorshDeserialize};

#[derive(BorshSerialize, BorshDeserialize)]
pub struct UserProfileParams {
    pub full_name: String,
    pub email: String,
    pub role: UserRole,
}

pub fn create_user_profile(
    _program_id: &Pubkey,
    accounts: &[AccountInfo],
    params: UserProfileParams,
) -> ProgramResult {
    let account_info_iter = &mut accounts.iter();
    
    let user_profile = next_account_info(account_info_iter)?;
    let authority = next_account_info(account_info_iter)?;
    let system_program = next_account_info(account_info_iter)?;
    
    // Verify authority is signer
    if !authority.is_signer {
        return Err(ProgramError::MissingRequiredSignature);
    }
    
    // Verify system program
    if system_program.key != &solana_program::system_program::id() {
        return Err(ProgramError::IncorrectProgramId);
    }
    
    // Create and initialize user profile
    let mut user_profile_data = UserProfile {
        is_initialized: true,
        authority: *authority.key,
        full_name: params.full_name,
        email: params.email,
        role: params.role,
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
        created_at: Clock::get()?.unix_timestamp,
        updated_at: Clock::get()?.unix_timestamp,
    };
    
    // Pack the data into the account
    user_profile_data.pack_into_slice(&mut user_profile.data.borrow_mut());
    
    Ok(())
}

pub fn update_user_profile(
    _program_id: &Pubkey,
    accounts: &[AccountInfo],
    params: UserProfileParams,
) -> ProgramResult {
    let account_info_iter = &mut accounts.iter();
    
    let user_profile = next_account_info(account_info_iter)?;
    let authority = next_account_info(account_info_iter)?;
    
    // Verify authority is signer
    if !authority.is_signer {
        return Err(ProgramError::MissingRequiredSignature);
    }
    
    // Verify authority matches
    let mut user_profile_data = UserProfile::unpack_from_slice(&user_profile.data.borrow())?;
    if user_profile_data.authority != *authority.key {
        return Err(ProgramError::IllegalOwner);
    }
    
    // Update profile
    user_profile_data.full_name = params.full_name;
    user_profile_data.email = params.email;
    user_profile_data.role = params.role;
    user_profile_data.updated_at = Clock::get()?.unix_timestamp;
    
    // Pack the updated data
    user_profile_data.pack_into_slice(&mut user_profile.data.borrow_mut());
    
    Ok(())
}

pub fn enable_two_factor(
    _program_id: &Pubkey,
    accounts: &[AccountInfo],
    secret: String,
    backup_codes: Vec<String>,
) -> ProgramResult {
    let account_info_iter = &mut accounts.iter();
    
    let user_profile = next_account_info(account_info_iter)?;
    let authority = next_account_info(account_info_iter)?;
    
    // Verify authority is signer
    if !authority.is_signer {
        return Err(ProgramError::MissingRequiredSignature);
    }
    
    // Verify authority matches
    let mut user_profile_data = UserProfile::unpack_from_slice(&user_profile.data.borrow())?;
    if user_profile_data.authority != *authority.key {
        return Err(ProgramError::IllegalOwner);
    }
    
    // Enable 2FA
    user_profile_data.two_factor_enabled = true;
    user_profile_data.two_factor_secret = secret;
    user_profile_data.two_factor_backup_codes = backup_codes;
    user_profile_data.updated_at = Clock::get()?.unix_timestamp;
    
    // Pack the updated data
    user_profile_data.pack_into_slice(&mut user_profile.data.borrow_mut());
    
    Ok(())
}

pub fn verify_kyc(
    _program_id: &Pubkey,
    accounts: &[AccountInfo],
    kyc_data: KycData,
) -> ProgramResult {
    let account_info_iter = &mut accounts.iter();
    
    let user_profile = next_account_info(account_info_iter)?;
    let authority = next_account_info(account_info_iter)?;
    
    // Verify authority is signer
    if !authority.is_signer {
        return Err(ProgramError::MissingRequiredSignature);
    }
    
    // Verify authority matches
    let mut user_profile_data = UserProfile::unpack_from_slice(&user_profile.data.borrow())?;
    if user_profile_data.authority != *authority.key {
        return Err(ProgramError::IllegalOwner);
    }
    
    // Update KYC status
    user_profile_data.kyc_verified = true;
    user_profile_data.kyc_status = KycStatus::Verified;
    user_profile_data.kyc_data = kyc_data;
    user_profile_data.updated_at = Clock::get()?.unix_timestamp;
    
    // Pack the updated data
    user_profile_data.pack_into_slice(&mut user_profile.data.borrow_mut());
    
    Ok(())
} 