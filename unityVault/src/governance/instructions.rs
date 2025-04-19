use solana_program::{
    account_info::{next_account_info, AccountInfo},
    clock::Clock,
    entrypoint::ProgramResult,
    program_error::ProgramError,
    program_pack::Pack,
    pubkey::Pubkey,
    sysvar::Sysvar,
};
use crate::governance::state::{Proposal, ProposalParams, ProposalStatus, VoteType};
use crate::governance::context::{CreateProposalContext, UpdateProposalContext, VoteProposalContext};

pub fn create_proposal(
    _program_id: &Pubkey,
    accounts: &[AccountInfo],
    params: ProposalParams,
) -> ProgramResult {
    let account_info_iter = &mut accounts.iter();
    
    let proposal = next_account_info(account_info_iter)?;
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
    
    // Create and initialize proposal
    let mut proposal_data = Proposal {
        is_initialized: true,
        authority: *authority.key,
        title: params.title,
        description: params.description,
        status: ProposalStatus::Draft,
        voting_duration: params.voting_duration,
        min_votes: params.min_votes,
        min_approval_percentage: params.min_approval_percentage,
        yes_votes: 0,
        no_votes: 0,
        abstain_votes: 0,
        created_at: Clock::get()?.unix_timestamp,
        updated_at: Clock::get()?.unix_timestamp,
        executed_at: 0,
    };
    
    // Pack the data into the account
    proposal_data.pack_into_slice(&mut proposal.data.borrow_mut());
    
    Ok(())
}

pub fn update_proposal(
    _program_id: &Pubkey,
    accounts: &[AccountInfo],
    params: ProposalParams,
) -> ProgramResult {
    let account_info_iter = &mut accounts.iter();
    
    let proposal = next_account_info(account_info_iter)?;
    let authority = next_account_info(account_info_iter)?;
    
    // Verify authority is signer
    if !authority.is_signer {
        return Err(ProgramError::MissingRequiredSignature);
    }
    
    // Verify authority matches
    let mut proposal_data = Proposal::unpack_from_slice(&proposal.data.borrow())?;
    if proposal_data.authority != *authority.key {
        return Err(ProgramError::IllegalOwner);
    }
    
    // Update proposal
    proposal_data.title = params.title;
    proposal_data.description = params.description;
    proposal_data.voting_duration = params.voting_duration;
    proposal_data.min_votes = params.min_votes;
    proposal_data.min_approval_percentage = params.min_approval_percentage;
    proposal_data.updated_at = Clock::get()?.unix_timestamp;
    
    // Pack the updated data
    proposal_data.pack_into_slice(&mut proposal.data.borrow_mut());
    
    Ok(())
}

pub fn vote_proposal(
    _program_id: &Pubkey,
    accounts: &[AccountInfo],
    vote_type: VoteType,
) -> ProgramResult {
    let account_info_iter = &mut accounts.iter();
    
    let proposal = next_account_info(account_info_iter)?;
    let voter = next_account_info(account_info_iter)?;
    
    // Verify voter is signer
    if !voter.is_signer {
        return Err(ProgramError::MissingRequiredSignature);
    }
    
    // Get proposal data
    let mut proposal_data = Proposal::unpack_from_slice(&proposal.data.borrow())?;
    
    // Verify proposal is active
    if proposal_data.status != ProposalStatus::Active {
        return Err(ProgramError::InvalidAccountData);
    }
    
    // Update vote counts
    match vote_type {
        VoteType::Yes => proposal_data.yes_votes += 1,
        VoteType::No => proposal_data.no_votes += 1,
        VoteType::Abstain => proposal_data.abstain_votes += 1,
    }
    
    // Update proposal status if voting period has ended
    let current_time = Clock::get()?.unix_timestamp;
    if current_time >= proposal_data.created_at + proposal_data.voting_duration {
        let total_votes = proposal_data.yes_votes + proposal_data.no_votes + proposal_data.abstain_votes;
        let approval_percentage = (proposal_data.yes_votes as f64 / total_votes as f64) * 100.0;
        
        if total_votes >= proposal_data.min_votes && approval_percentage >= proposal_data.min_approval_percentage as f64 {
            proposal_data.status = ProposalStatus::Passed;
        } else {
            proposal_data.status = ProposalStatus::Rejected;
        }
    }
    
    proposal_data.updated_at = current_time;
    
    // Pack the updated data
    proposal_data.pack_into_slice(&mut proposal.data.borrow_mut());
    
    Ok(())
} 