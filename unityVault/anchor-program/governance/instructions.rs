use anchor_lang::prelude::*;
use crate::governance::state::*;
use crate::governance::context::*;

pub fn create_governance(
    ctx: Context<CreateGovernance>,
    params: GovernanceParams,
) -> Result<()> {
    let governance = &mut ctx.accounts.governance;
    
    // Initialize governance
    governance.authority = ctx.accounts.authority.key();
    governance.voting_token_mint = ctx.accounts.voting_token_mint.key();
    governance.min_voting_power = params.min_voting_power;
    governance.proposal_count = 0;
    governance.created_at = Clock::get()?.unix_timestamp;
    governance.updated_at = Clock::get()?.unix_timestamp;
    
    Ok(())
}

pub fn create_proposal(
    ctx: Context<CreateProposal>,
    params: ProposalParams,
) -> Result<()> {
    let proposal = &mut ctx.accounts.proposal;
    let governance = &mut ctx.accounts.governance;
    
    // Initialize proposal
    proposal.governance = governance.key();
    proposal.proposer = ctx.accounts.proposer.key();
    proposal.title = params.title;
    proposal.description = params.description;
    proposal.category = params.category;
    proposal.status = ProposalStatus::Draft;
    proposal.start_time = Clock::get()?.unix_timestamp;
    proposal.end_time = Clock::get()?.unix_timestamp.checked_add(params.duration).unwrap();
    proposal.yes_votes = 0;
    proposal.no_votes = 0;
    proposal.abstain_votes = 0;
    proposal.created_at = Clock::get()?.unix_timestamp;
    proposal.updated_at = Clock::get()?.unix_timestamp;
    
    // Update governance
    governance.proposal_count = governance.proposal_count.checked_add(1).unwrap();
    governance.updated_at = Clock::get()?.unix_timestamp;
    
    Ok(())
}

pub fn cast_vote(
    ctx: Context<CastVote>,
    vote_type: VoteType,
) -> Result<()> {
    let vote = &mut ctx.accounts.vote;
    let proposal = &mut ctx.accounts.proposal;
    
    // Check if voting period is active
    let current_time = Clock::get()?.unix_timestamp;
    require!(
        current_time >= proposal.start_time && current_time <= proposal.end_time,
        GovernanceError::NotInVotingPeriod
    );
    
    // Initialize vote record
    vote.voter = ctx.accounts.voter.key();
    vote.proposal = proposal.key();
    vote.choice = vote_type;
    vote.voting_power = ctx.accounts.voter_token_account.amount;
    vote.created_at = current_time;
    vote.updated_at = current_time;
    
    // Update proposal votes
    match vote_type {
        VoteType::Yes => proposal.yes_votes = proposal.yes_votes.checked_add(vote.voting_power).unwrap(),
        VoteType::No => proposal.no_votes = proposal.no_votes.checked_add(vote.voting_power).unwrap(),
        VoteType::Abstain => proposal.abstain_votes = proposal.abstain_votes.checked_add(vote.voting_power).unwrap(),
    }
    proposal.updated_at = current_time;
    
    Ok(())
}

pub fn execute_proposal(
    ctx: Context<ExecuteProposal>,
) -> Result<()> {
    let proposal = &mut ctx.accounts.proposal;
    
    // Validate proposal status
    require!(
        proposal.status == ProposalStatus::Passed,
        GovernanceError::ProposalNotPassed
    );
    
    // Validate execution time
    let current_time = Clock::get()?.unix_timestamp;
    require!(
        current_time > proposal.end_time,
        GovernanceError::VotingPeriodNotEnded
    );
    
    // Update proposal status
    proposal.status = ProposalStatus::Executed;
    proposal.updated_at = current_time;
    
    Ok(())
}

#[error_code]
pub enum GovernanceError {
    #[msg("Proposal is not active")]
    ProposalNotActive,
    #[msg("Not in voting period")]
    NotInVotingPeriod,
    #[msg("Insufficient voting power")]
    InsufficientVotingPower,
    #[msg("Proposal has not passed")]
    ProposalNotPassed,
    #[msg("Voting period has not ended")]
    VotingPeriodNotEnded,
} 