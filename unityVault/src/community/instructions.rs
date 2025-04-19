use solana_program::{
    account_info::{next_account_info, AccountInfo},
    clock::Clock,
    entrypoint::ProgramResult,
    program_error::ProgramError,
    program_pack::Pack,
    pubkey::Pubkey,
    sysvar::Sysvar,
};
use crate::community::state::{Community, CommunityParams, CommunityStatus};
use borsh::{BorshSerialize, BorshDeserialize};

pub fn create_community(
    _program_id: &Pubkey,
    accounts: &[AccountInfo],
    params: CommunityParams,
) -> ProgramResult {
    let account_info_iter = &mut accounts.iter();
    
    let community = next_account_info(account_info_iter)?;
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
    
    // Create and initialize community
    let community_data = Community {
        is_initialized: true,
        authority: *authority.key,
        name: params.name,
        description: params.description,
        rules: params.rules,
        is_private: params.is_private,
        status: CommunityStatus::Active,
        member_count: 1,
        created_at: Clock::get()?.unix_timestamp,
        updated_at: Clock::get()?.unix_timestamp,
    };
    
    // Pack the data into the account
    community_data.pack_into_slice(&mut community.data.borrow_mut());
    
    Ok(())
}

pub fn update_community(
    _program_id: &Pubkey,
    accounts: &[AccountInfo],
    params: CommunityParams,
) -> ProgramResult {
    let account_info_iter = &mut accounts.iter();
    
    let community = next_account_info(account_info_iter)?;
    let authority = next_account_info(account_info_iter)?;
    
    // Verify authority is signer
    if !authority.is_signer {
        return Err(ProgramError::MissingRequiredSignature);
    }
    
    // Verify authority matches
    let mut community_data = Community::unpack_from_slice(&community.data.borrow())?;
    if community_data.authority != *authority.key {
        return Err(ProgramError::IllegalOwner);
    }
    
    // Update community
    community_data.name = params.name;
    community_data.description = params.description;
    community_data.rules = params.rules;
    community_data.is_private = params.is_private;
    community_data.updated_at = Clock::get()?.unix_timestamp;
    
    // Pack the updated data
    community_data.pack_into_slice(&mut community.data.borrow_mut());
    
    Ok(())
}

pub fn suspend_community(
    _program_id: &Pubkey,
    accounts: &[AccountInfo],
) -> ProgramResult {
    let account_info_iter = &mut accounts.iter();
    
    let community = next_account_info(account_info_iter)?;
    let authority = next_account_info(account_info_iter)?;
    
    // Verify authority is signer
    if !authority.is_signer {
        return Err(ProgramError::MissingRequiredSignature);
    }
    
    // Verify authority matches
    let mut community_data = Community::unpack_from_slice(&community.data.borrow())?;
    if community_data.authority != *authority.key {
        return Err(ProgramError::IllegalOwner);
    }
    
    // Suspend community
    community_data.status = CommunityStatus::Suspended;
    community_data.updated_at = Clock::get()?.unix_timestamp;
    
    // Pack the updated data
    community_data.pack_into_slice(&mut community.data.borrow_mut());
    
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;
    use solana_program::clock::Epoch;
    use std::cell::RefCell;
    
    fn create_test_account<'a>(lamports: u64, owner: &'a Pubkey, data: &'a mut [u8]) -> AccountInfo<'a> {
        static KEY: Pubkey = Pubkey::new_from_array([0; 32]);
        static mut LAMPORTS: u64 = 0;
        unsafe {
            LAMPORTS = lamports;
            AccountInfo::new(
                &KEY,
                false,
                true,
                &mut LAMPORTS,
                data,
                owner,
                false,
                Epoch::default(),
            )
        }
    }

    #[test]
    fn test_create_community() {
        let program_id = Pubkey::new_unique();
        let authority = Pubkey::new_unique();
        let system_program_id = solana_program::system_program::id();
        
        // Create community account
        let mut community_data = vec![0; Community::LEN];
        let community_account = create_test_account(
            1000000000,
            &program_id,
            &mut community_data
        );
        
        // Create authority account
        let mut authority_data = vec![];
        let authority_account = create_test_account(
            1000000000,
            &authority,
            &mut authority_data
        );
        
        // Create system program account
        let mut system_program_data = vec![];
        let system_program_account = create_test_account(
            0,
            &system_program_id,
            &mut system_program_data
        );
        
        let accounts = vec![
            community_account.clone(),
            authority_account,
            system_program_account,
        ];
        
        let params = CommunityParams {
            name: "Test Community".to_string(),
            description: "Test Description".to_string(),
            rules: "Test Rules".to_string(),
            is_private: false,
        };
        
        assert!(create_community(&program_id, &accounts, params).is_ok());
        
        let community_data = RefCell::new(community_data);
        let community = Community::unpack(&community_data.borrow()).unwrap();
        assert!(community.is_initialized);
        assert_eq!(community.authority, authority);
        assert_eq!(community.name, "Test Community");
        assert_eq!(community.description, "Test Description");
        assert_eq!(community.rules, "Test Rules");
        assert!(!community.is_private);
        assert_eq!(community.status, CommunityStatus::Active);
        assert_eq!(community.member_count, 1);
    }

    #[test]
    fn test_update_community() {
        let program_id = Pubkey::new_unique();
        let authority = Pubkey::new_unique();
        
        // Create initial community
        let mut community_data = vec![0; Community::LEN];
        let community_account = create_test_account(
            1000000000,
            &program_id,
            &mut community_data
        );
        
        // Create authority account
        let mut authority_data = vec![];
        let authority_account = create_test_account(
            1000000000,
            &authority,
            &mut authority_data
        );
        
        let accounts = vec![
            community_account.clone(),
            authority_account,
        ];
        
        let params = CommunityParams {
            name: "New Name".to_string(),
            description: "New Description".to_string(),
            rules: "New Rules".to_string(),
            is_private: true,
        };
        
        assert!(update_community(&program_id, &accounts, params).is_ok());
        
        let community_data = RefCell::new(community_data);
        let community = Community::unpack(&community_data.borrow()).unwrap();
        assert_eq!(community.name, "New Name");
        assert_eq!(community.description, "New Description");
        assert_eq!(community.rules, "New Rules");
        assert!(community.is_private);
    }

    #[test]
    fn test_suspend_community() {
        let program_id = Pubkey::new_unique();
        let authority = Pubkey::new_unique();
        
        // Create initial community
        let mut community_data = vec![0; Community::LEN];
        let community_account = create_test_account(
            1000000000,
            &program_id,
            &mut community_data
        );
        
        // Create authority account
        let mut authority_data = vec![];
        let authority_account = create_test_account(
            1000000000,
            &authority,
            &mut authority_data
        );
        
        let accounts = vec![
            community_account.clone(),
            authority_account,
        ];
        
        assert!(suspend_community(&program_id, &accounts).is_ok());
        
        let community_data = RefCell::new(community_data);
        let community = Community::unpack(&community_data.borrow()).unwrap();
        assert_eq!(community.status, CommunityStatus::Suspended);
    }
} 