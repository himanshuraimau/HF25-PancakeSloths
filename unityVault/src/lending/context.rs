use solana_program::{
    account_info::AccountInfo,
    entrypoint::ProgramResult,
    program_error::ProgramError,
    program_pack::Pack,
    pubkey::Pubkey,
    sysvar::Sysvar,
};
use std::str::FromStr;
use crate::lending::state::{LendingPool, Loan};

pub struct InitLendingPoolContext<'a> {
    pub lending_pool: &'a AccountInfo<'a>,
    pub authority: &'a AccountInfo<'a>,
    pub token_mint: &'a AccountInfo<'a>,
    pub token_vault: &'a AccountInfo<'a>,
    pub system_program: &'a AccountInfo<'a>,
    pub token_program: &'a AccountInfo<'a>,
    pub rent: &'a AccountInfo<'a>,
}

pub struct CreateLoanContext<'a> {
    pub loan: &'a AccountInfo<'a>,
    pub lending_pool: &'a AccountInfo<'a>,
    pub borrower: &'a AccountInfo<'a>,
    pub system_program: &'a AccountInfo<'a>,
}

pub struct RepayLoanContext<'a> {
    pub loan: &'a AccountInfo<'a>,
    pub lending_pool: &'a AccountInfo<'a>,
    pub borrower: &'a AccountInfo<'a>,
    pub token_program: &'a AccountInfo<'a>,
}

impl<'a> InitLendingPoolContext<'a> {
    pub fn validate(&self, _program_id: &Pubkey) -> ProgramResult {
        // Verify lending pool is not initialized
        let lending_pool_data = LendingPool::unpack_unchecked(&self.lending_pool.data.borrow())?;
        if lending_pool_data.is_initialized {
            return Err(ProgramError::AccountAlreadyInitialized);
        }
        
        // Verify authority is signer
        if !self.authority.is_signer {
            return Err(ProgramError::MissingRequiredSignature);
        }
        
        // Verify system program
        if self.system_program.key != &solana_program::system_program::id() {
            return Err(ProgramError::IncorrectProgramId);
        }
        
        // Verify token program
        if self.token_program.key != &Pubkey::from_str(&spl_token::ID.to_string()).unwrap() {
            return Err(ProgramError::IncorrectProgramId);
        }
        
        Ok(())
    }
}

impl<'a> CreateLoanContext<'a> {
    pub fn validate(&self, _program_id: &Pubkey) -> ProgramResult {
        // Verify loan account is not initialized
        let loan_data = Loan::unpack_unchecked(&self.loan.data.borrow())?;
        if loan_data.is_initialized {
            return Err(ProgramError::AccountAlreadyInitialized);
        }
        
        // Verify lending pool is initialized
        let lending_pool_data = LendingPool::unpack_unchecked(&self.lending_pool.data.borrow())?;
        if !lending_pool_data.is_initialized {
            return Err(ProgramError::UninitializedAccount);
        }
        
        // Verify borrower is signer
        if !self.borrower.is_signer {
            return Err(ProgramError::MissingRequiredSignature);
        }
        
        // Verify system program
        if self.system_program.key != &solana_program::system_program::id() {
            return Err(ProgramError::IncorrectProgramId);
        }
        
        Ok(())
    }
}

impl<'a> RepayLoanContext<'a> {
    pub fn validate(&self, _program_id: &Pubkey) -> ProgramResult {
        // Verify loan is initialized
        let loan_data = Loan::unpack_unchecked(&self.loan.data.borrow())?;
        if !loan_data.is_initialized {
            return Err(ProgramError::UninitializedAccount);
        }
        
        // Verify lending pool is initialized
        let lending_pool_data = LendingPool::unpack_unchecked(&self.lending_pool.data.borrow())?;
        if !lending_pool_data.is_initialized {
            return Err(ProgramError::UninitializedAccount);
        }
        
        // Verify borrower is signer
        if !self.borrower.is_signer {
            return Err(ProgramError::MissingRequiredSignature);
        }
        
        // Verify borrower matches loan
        if loan_data.borrower != *self.borrower.key {
            return Err(ProgramError::InvalidAccountData);
        }
        
        // Verify token program
        if self.token_program.key != &Pubkey::from_str(&spl_token::ID.to_string()).unwrap() {
            return Err(ProgramError::IncorrectProgramId);
        }
        
        Ok(())
    }
} 