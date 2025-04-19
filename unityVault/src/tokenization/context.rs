use solana_program::{
    account_info::AccountInfo,
    entrypoint::ProgramResult,
    program_error::ProgramError,
    program_pack::Pack,
    pubkey::Pubkey,
    sysvar::Sysvar,
};
use std::str::FromStr;
use crate::tokenization::state::TokenInfo;

pub struct CreateTokenContext<'a> {
    pub token_info: &'a AccountInfo<'a>,
    pub mint: &'a AccountInfo<'a>,
    pub creator_token_account: &'a AccountInfo<'a>,
    pub creator: &'a AccountInfo<'a>,
    pub token_program: &'a AccountInfo<'a>,
    pub system_program: &'a AccountInfo<'a>,
    pub rent: &'a AccountInfo<'a>,
}

pub struct TransferTokensContext<'a> {
    pub from: &'a AccountInfo<'a>,
    pub to: &'a AccountInfo<'a>,
    pub authority: &'a AccountInfo<'a>,
    pub token_program: &'a AccountInfo<'a>,
}

pub struct BurnTokensContext<'a> {
    pub token_info: &'a AccountInfo<'a>,
    pub mint: &'a AccountInfo<'a>,
    pub from: &'a AccountInfo<'a>,
    pub authority: &'a AccountInfo<'a>,
    pub token_program: &'a AccountInfo<'a>,
}

impl<'a> CreateTokenContext<'a> {
    pub fn validate(&self, _program_id: &Pubkey) -> ProgramResult {
        // Verify token info is not initialized
        let token_info_data = TokenInfo::unpack_unchecked(&self.token_info.data.borrow())?;
        if token_info_data.is_initialized {
            return Err(ProgramError::AccountAlreadyInitialized);
        }
        
        // Verify creator is signer
        if !self.creator.is_signer {
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

impl<'a> TransferTokensContext<'a> {
    pub fn validate(&self, _program_id: &Pubkey) -> ProgramResult {
        // Verify authority is signer
        if !self.authority.is_signer {
            return Err(ProgramError::MissingRequiredSignature);
        }
        
        // Verify token program
        if self.token_program.key != &Pubkey::from_str(&spl_token::ID.to_string()).unwrap() {
            return Err(ProgramError::IncorrectProgramId);
        }
        
        Ok(())
    }
}

impl<'a> BurnTokensContext<'a> {
    pub fn validate(&self, _program_id: &Pubkey) -> ProgramResult {
        // Verify token info is initialized
        let token_info_data = TokenInfo::unpack_unchecked(&self.token_info.data.borrow())?;
        if !token_info_data.is_initialized {
            return Err(ProgramError::UninitializedAccount);
        }
        
        // Verify authority is signer
        if !self.authority.is_signer {
            return Err(ProgramError::MissingRequiredSignature);
        }
        
        // Verify token program
        if self.token_program.key != &Pubkey::from_str(&spl_token::ID.to_string()).unwrap() {
            return Err(ProgramError::IncorrectProgramId);
        }
        
        Ok(())
    }
} 