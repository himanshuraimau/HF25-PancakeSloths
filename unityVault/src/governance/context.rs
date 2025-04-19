use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint::ProgramResult,
    program_error::ProgramError,
    pubkey::Pubkey,
};
use crate::governance::state::Proposal;
use std::convert::TryFrom;

pub struct CreateProposalContext<'a> {
    pub proposal: &'a AccountInfo<'a>,
    pub authority: &'a AccountInfo<'a>,
    pub system_program: &'a AccountInfo<'a>,
}

impl<'a> TryFrom<&'a [AccountInfo<'a>]> for CreateProposalContext<'a> {
    type Error = ProgramError;

    fn try_from(accounts: &'a [AccountInfo<'a>]) -> Result<Self, Self::Error> {
        let account_info_iter = &mut accounts.iter();
        let proposal = next_account_info(account_info_iter)?;
        let authority = next_account_info(account_info_iter)?;
        let system_program = next_account_info(account_info_iter)?;

        Ok(CreateProposalContext {
            proposal,
            authority,
            system_program,
        })
    }
}

pub struct UpdateProposalContext<'a> {
    pub proposal: &'a AccountInfo<'a>,
    pub authority: &'a AccountInfo<'a>,
}

pub struct VoteProposalContext<'a> {
    pub proposal: &'a AccountInfo<'a>,
    pub voter: &'a AccountInfo<'a>,
}

impl<'a> CreateProposalContext<'a> {
    pub fn validate(&self, program_id: &Pubkey) -> ProgramResult {
        // Verify proposal account is not initialized
        let proposal_data = Proposal::unpack_unchecked(&self.proposal.data.borrow())?;
        if proposal_data.is_initialized {
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

impl<'a> UpdateProposalContext<'a> {
    pub fn validate(&self, program_id: &Pubkey) -> ProgramResult {
        // Verify proposal account is initialized
        let proposal_data = Proposal::unpack_unchecked(&self.proposal.data.borrow())?;
        if !proposal_data.is_initialized {
            return Err(ProgramError::UninitializedAccount);
        }
        
        // Verify authority is signer
        if !self.authority.is_signer {
            return Err(ProgramError::MissingRequiredSignature);
        }
        
        // Verify authority matches
        if proposal_data.authority != *self.authority.key {
            return Err(ProgramError::IllegalOwner);
        }
        
        Ok(())
    }
}

impl<'a> VoteProposalContext<'a> {
    pub fn validate(&self, program_id: &Pubkey) -> ProgramResult {
        // Verify proposal account is initialized
        let proposal_data = Proposal::unpack_unchecked(&self.proposal.data.borrow())?;
        if !proposal_data.is_initialized {
            return Err(ProgramError::UninitializedAccount);
        }
        
        // Verify voter is signer
        if !self.voter.is_signer {
            return Err(ProgramError::MissingRequiredSignature);
        }
        
        Ok(())
    }
} 