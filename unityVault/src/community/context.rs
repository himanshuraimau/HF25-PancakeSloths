use solana_program::{
    account_info::AccountInfo,
    entrypoint::ProgramResult,
    program_error::ProgramError,
    program_pack::Pack,
    pubkey::Pubkey,
};
use crate::community::state::Community;

pub struct CreateCommunityContext<'a> {
    pub community: &'a AccountInfo<'a>,
    pub authority: &'a AccountInfo<'a>,
    pub system_program: &'a AccountInfo<'a>,
}

pub struct UpdateCommunityContext<'a> {
    pub community: &'a AccountInfo<'a>,
    pub authority: &'a AccountInfo<'a>,
}

pub struct SuspendCommunityContext<'a> {
    pub community: &'a AccountInfo<'a>,
    pub authority: &'a AccountInfo<'a>,
}

impl<'a> CreateCommunityContext<'a> {
    pub fn validate(&self, _program_id: &Pubkey) -> ProgramResult {
        // Verify community is not initialized
        let community_data = Community::unpack(&self.community.data.borrow())?;
        if community_data.is_initialized {
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
        
        Ok(())
    }
}

impl<'a> UpdateCommunityContext<'a> {
    pub fn validate(&self, _program_id: &Pubkey) -> ProgramResult {
        // Verify community is initialized
        let community_data = Community::unpack(&self.community.data.borrow())?;
        if !community_data.is_initialized {
            return Err(ProgramError::UninitializedAccount);
        }
        
        // Verify authority is signer
        if !self.authority.is_signer {
            return Err(ProgramError::MissingRequiredSignature);
        }
        
        // Verify authority matches
        if community_data.authority != *self.authority.key {
            return Err(ProgramError::IllegalOwner);
        }
        
        Ok(())
    }
}

impl<'a> SuspendCommunityContext<'a> {
    pub fn validate(&self, _program_id: &Pubkey) -> ProgramResult {
        // Verify community is initialized
        let community_data = Community::unpack(&self.community.data.borrow())?;
        if !community_data.is_initialized {
            return Err(ProgramError::UninitializedAccount);
        }
        
        // Verify authority is signer
        if !self.authority.is_signer {
            return Err(ProgramError::MissingRequiredSignature);
        }
        
        // Verify authority matches
        if community_data.authority != *self.authority.key {
            return Err(ProgramError::IllegalOwner);
        }
        
        Ok(())
    }
} 