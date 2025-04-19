use solana_program::{
    account_info::{next_account_info, AccountInfo},
    clock::Clock,
    entrypoint::ProgramResult,
    program_error::ProgramError,
    program_pack::Pack,
    pubkey::Pubkey,
    sysvar::Sysvar,
};
use crate::lending::{
    state::{LendingPool, LendingPoolParams, Loan, LoanParams, LoanStatus},
    context::{InitLendingPoolContext, CreateLoanContext, RepayLoanContext},
};
use std::str::FromStr;

pub fn init_lending_pool<'a>(
    program_id: &Pubkey,
    accounts: &'a [AccountInfo<'a>],
    params: LendingPoolParams,
) -> ProgramResult {
    let account_info_iter = &mut accounts.iter();
    
    let context = InitLendingPoolContext {
        lending_pool: next_account_info(account_info_iter)?,
        authority: next_account_info(account_info_iter)?,
        token_mint: next_account_info(account_info_iter)?,
        token_vault: next_account_info(account_info_iter)?,
        system_program: next_account_info(account_info_iter)?,
        token_program: next_account_info(account_info_iter)?,
        rent: next_account_info(account_info_iter)?,
    };
    
    context.validate(program_id)?;
    
    let clock = Clock::get()?;
    let lending_pool_data = LendingPool {
        is_initialized: true,
        authority: *context.authority.key,
        token_mint: *context.token_mint.key,
        token_vault: *context.token_vault.key,
        interest_rate: params.interest_rate,
        max_loan_amount: params.max_loan_amount,
        min_loan_amount: params.min_loan_amount,
        total_borrowed: 0,
        total_deposited: 0,
        created_at: clock.unix_timestamp,
        updated_at: clock.unix_timestamp,
    };
    
    LendingPool::pack(lending_pool_data, &mut context.lending_pool.data.borrow_mut())?;
    
    Ok(())
}

pub fn create_loan<'a>(
    program_id: &Pubkey,
    accounts: &'a [AccountInfo<'a>],
    params: LoanParams,
) -> ProgramResult {
    let account_info_iter = &mut accounts.iter();
    
    let context = CreateLoanContext {
        loan: next_account_info(account_info_iter)?,
        lending_pool: next_account_info(account_info_iter)?,
        borrower: next_account_info(account_info_iter)?,
        system_program: next_account_info(account_info_iter)?,
    };
    
    context.validate(program_id)?;
    
    let lending_pool_data = LendingPool::unpack(&context.lending_pool.data.borrow())?;
    
    // Validate loan amount
    if params.amount < lending_pool_data.min_loan_amount || params.amount > lending_pool_data.max_loan_amount {
        return Err(ProgramError::InvalidArgument);
    }
    
    let clock = Clock::get()?;
    let loan_data = Loan {
        is_initialized: true,
        borrower: *context.borrower.key,
        lending_pool: *context.lending_pool.key,
        amount: params.amount,
        interest_rate: lending_pool_data.interest_rate,
        start_time: clock.unix_timestamp,
        due_time: clock.unix_timestamp + params.duration,
        status: LoanStatus::Active,
        created_at: clock.unix_timestamp,
        updated_at: clock.unix_timestamp,
    };
    
    let loan_data_clone = loan_data.clone();
    Loan::pack(loan_data, &mut context.loan.data.borrow_mut())?;
    
    // Update lending pool total borrowed
    let mut lending_pool_data = LendingPool::unpack(&context.lending_pool.data.borrow())?;
    let loan_amount = loan_data_clone.amount;
    lending_pool_data.total_borrowed += loan_amount;
    lending_pool_data.updated_at = clock.unix_timestamp;
    LendingPool::pack(lending_pool_data, &mut context.lending_pool.data.borrow_mut())?;
    
    Ok(())
}

pub fn repay_loan<'a>(
    program_id: &Pubkey,
    accounts: &'a [AccountInfo<'a>],
) -> ProgramResult {
    let account_info_iter = &mut accounts.iter();
    
    let context = RepayLoanContext {
        loan: next_account_info(account_info_iter)?,
        lending_pool: next_account_info(account_info_iter)?,
        borrower: next_account_info(account_info_iter)?,
        token_program: next_account_info(account_info_iter)?,
    };
    
    context.validate(program_id)?;
    
    let clock = Clock::get()?;
    
    // Update loan status
    let mut loan_data = Loan::unpack(&context.loan.data.borrow())?;
    let loan_amount = loan_data.amount;
    loan_data.status = LoanStatus::Repaid;
    loan_data.updated_at = clock.unix_timestamp;
    Loan::pack(loan_data, &mut context.loan.data.borrow_mut())?;
    
    // Update lending pool total borrowed
    let mut lending_pool_data = LendingPool::unpack(&context.lending_pool.data.borrow())?;
    lending_pool_data.total_borrowed -= loan_amount;
    lending_pool_data.updated_at = clock.unix_timestamp;
    LendingPool::pack(lending_pool_data, &mut context.lending_pool.data.borrow_mut())?;
    
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;
    use solana_program::clock::Epoch;
    
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
    fn test_init_lending_pool() {
        let program_id = Pubkey::new_unique();
        let authority = Pubkey::new_unique();
        let token_mint = Pubkey::new_unique();
        let token_vault = Pubkey::new_unique();
        let system_program_id = solana_program::system_program::id();
        let spl_token_id = Pubkey::from_str(&spl_token::ID.to_string()).unwrap();
        let rent_id = solana_program::sysvar::rent::id();
        
        let mut lending_pool_data = vec![0; LendingPool::LEN];
        let lending_pool_account = create_test_account(
            1000000,
            &program_id,
            &mut lending_pool_data,
        );
        
        let params = LendingPoolParams {
            interest_rate: 500, // 5%
            max_loan_amount: 1000000,
            min_loan_amount: 1000,
        };
        
        let mut authority_data = vec![];
        let mut token_mint_data = vec![];
        let mut token_vault_data = vec![];
        let mut system_program_data = vec![];
        let mut spl_token_data = vec![];
        let mut rent_data = vec![];
        
        let accounts = vec![
            lending_pool_account.clone(),
            create_test_account(1000000, &authority, &mut authority_data),
            create_test_account(1000000, &token_mint, &mut token_mint_data),
            create_test_account(1000000, &token_vault, &mut token_vault_data),
            create_test_account(1000000, &system_program_id, &mut system_program_data),
            create_test_account(1000000, &spl_token_id, &mut spl_token_data),
            create_test_account(1000000, &rent_id, &mut rent_data),
        ];
        
        assert!(init_lending_pool(&program_id, &accounts, params).is_ok());
        
        let lending_pool = LendingPool::unpack(&lending_pool_account.data.borrow()).unwrap();
        assert!(lending_pool.is_initialized);
        assert_eq!(lending_pool.authority, authority);
        assert_eq!(lending_pool.token_mint, token_mint);
        assert_eq!(lending_pool.token_vault, token_vault);
        assert_eq!(lending_pool.interest_rate, 500);
        assert_eq!(lending_pool.max_loan_amount, 1000000);
        assert_eq!(lending_pool.min_loan_amount, 1000);
        assert_eq!(lending_pool.total_borrowed, 0);
        assert_eq!(lending_pool.total_deposited, 0);
    }
} 