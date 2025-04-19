use solana_program::{
    account_info::{next_account_info, AccountInfo},
    clock::Clock,
    entrypoint::ProgramResult,
    program_error::ProgramError,
    program_pack::Pack,
    pubkey::Pubkey,
    sysvar::Sysvar,
};
use crate::tokenization::{
    state::{TokenInfo, TokenParams, TokenStatus},
    context::{CreateTokenContext, TransferTokensContext, BurnTokensContext},
};

pub fn create_token<'a>(
    program_id: &Pubkey,
    accounts: &'a [AccountInfo<'a>],
    params: TokenParams,
) -> ProgramResult {
    let account_info_iter = &mut accounts.iter();
    
    let context = CreateTokenContext {
        token_info: next_account_info(account_info_iter)?,
        mint: next_account_info(account_info_iter)?,
        creator_token_account: next_account_info(account_info_iter)?,
        creator: next_account_info(account_info_iter)?,
        token_program: next_account_info(account_info_iter)?,
        system_program: next_account_info(account_info_iter)?,
        rent: next_account_info(account_info_iter)?,
    };
    
    context.validate(program_id)?;
    
    let clock = Clock::get()?;
    let token_info_data = TokenInfo {
        is_initialized: true,
        creator: *context.creator.key,
        mint: *context.mint.key,
        name: params.name,
        symbol: params.symbol,
        decimals: params.decimals,
        total_supply: params.total_supply,
        status: TokenStatus::Active,
        created_at: clock.unix_timestamp,
        updated_at: clock.unix_timestamp,
    };
    
    TokenInfo::pack(token_info_data, &mut context.token_info.data.borrow_mut())?;
    
    // Initialize mint and mint tokens using CPI calls
    // This part would need to be implemented using CPI calls to the SPL Token program
    // Similar to how it's done in the lending program
    
    Ok(())
}

pub fn transfer_tokens<'a>(
    program_id: &Pubkey,
    accounts: &'a [AccountInfo<'a>],
    _amount: u64,
) -> ProgramResult {
    let account_info_iter = &mut accounts.iter();
    
    let context = TransferTokensContext {
        from: next_account_info(account_info_iter)?,
        to: next_account_info(account_info_iter)?,
        authority: next_account_info(account_info_iter)?,
        token_program: next_account_info(account_info_iter)?,
    };
    
    context.validate(program_id)?;
    
    // Transfer tokens using CPI calls
    // This part would need to be implemented using CPI calls to the SPL Token program
    // Similar to how it's done in the lending program
    
    Ok(())
}

pub fn burn_tokens<'a>(
    program_id: &Pubkey,
    accounts: &'a [AccountInfo<'a>],
    amount: u64,
) -> ProgramResult {
    let account_info_iter = &mut accounts.iter();
    
    let context = BurnTokensContext {
        token_info: next_account_info(account_info_iter)?,
        mint: next_account_info(account_info_iter)?,
        from: next_account_info(account_info_iter)?,
        authority: next_account_info(account_info_iter)?,
        token_program: next_account_info(account_info_iter)?,
    };
    
    context.validate(program_id)?;
    
    // Burn tokens using CPI calls
    // This part would need to be implemented using CPI calls to the SPL Token program
    // Similar to how it's done in the lending program
    
    // Update token supply
    let mut token_info_data = TokenInfo::unpack(&context.token_info.data.borrow())?;
    token_info_data.total_supply = token_info_data.total_supply.checked_sub(amount)
        .ok_or(ProgramError::InvalidArgument)?;
    token_info_data.updated_at = Clock::get()?.unix_timestamp;
    TokenInfo::pack(token_info_data, &mut context.token_info.data.borrow_mut())?;
    
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;
    use solana_program::clock::Epoch;
    use std::str::FromStr;
    
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
    fn test_create_token() {
        let program_id = Pubkey::new_unique();
        let creator = Pubkey::new_unique();
        let mint = Pubkey::new_unique();
        let creator_token_account = Pubkey::new_unique();
        let system_program_id = solana_program::system_program::id();
        let spl_token_id = Pubkey::from_str(&spl_token::ID.to_string()).unwrap();
        let rent_id = solana_program::sysvar::rent::id();
        
        let mut token_info_data = vec![0; TokenInfo::LEN];
        let token_info_account = create_test_account(
            1000000,
            &program_id,
            &mut token_info_data,
        );
        
        let params = TokenParams {
            name: "Test Token".to_string(),
            symbol: "TEST".to_string(),
            decimals: 9,
            total_supply: 1000000000,
        };
        
        let mut mint_data = vec![];
        let mut creator_token_account_data = vec![];
        let mut creator_data = vec![];
        let mut system_program_data = vec![];
        let mut spl_token_data = vec![];
        let mut rent_data = vec![];
        
        let accounts = vec![
            token_info_account.clone(),
            create_test_account(1000000, &mint, &mut mint_data),
            create_test_account(1000000, &creator_token_account, &mut creator_token_account_data),
            create_test_account(1000000, &creator, &mut creator_data),
            create_test_account(1000000, &system_program_id, &mut system_program_data),
            create_test_account(1000000, &spl_token_id, &mut spl_token_data),
            create_test_account(1000000, &rent_id, &mut rent_data),
        ];
        
        assert!(create_token(&program_id, &accounts, params).is_ok());
        
        let token_info = TokenInfo::unpack(&token_info_account.data.borrow()).unwrap();
        assert!(token_info.is_initialized);
        assert_eq!(token_info.creator, creator);
        assert_eq!(token_info.mint, mint);
        assert_eq!(token_info.name, "Test Token");
        assert_eq!(token_info.symbol, "TEST");
        assert_eq!(token_info.decimals, 9);
        assert_eq!(token_info.total_supply, 1000000000);
        assert_eq!(token_info.status, TokenStatus::Active);
    }
} 