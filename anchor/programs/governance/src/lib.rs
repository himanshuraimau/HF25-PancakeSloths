use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount};

declare_id!("Govrnance1111111111111111111111111111111111");

#[program]
pub mod governance {
    use super::*;

    pub fn create_proposal(
        ctx: Context<CreateProposal>,
        params: ProposalParams,
    ) -> Result<()> {
        let proposal = &mut ctx.accounts.proposal;
        let governance = &mut ctx.accounts.governance;
        
        // Initialize proposal
        proposal.creator = ctx.accounts.creator.key();
        proposal.title = params.title;
        proposal.description = params.description;
        proposal.category = params.category;
        proposal.status = ProposalStatus::Active;
        proposal.created_at = Clock::get()?.unix_timestamp;
        proposal.updated_at = Clock::get()?.unix_timestamp;
        proposal.voting_start = params.voting_start;
        proposal.voting_end = params.voting_end;
        proposal.quorum = params.quorum;
        proposal.threshold = params.threshold;
        proposal.yes_votes = 0;
        proposal.no_votes = 0;
        proposal.abstain_votes = 0;
        
        // Update governance state
        governance.total_proposals = governance.total_proposals.checked_add(1)
            .ok_or(GovernanceError::Overflow)?;
        governance.active_proposals = governance.active_proposals.checked_add(1)
            .ok_or(GovernanceError::Overflow)?;
        
        Ok(())
    }

    pub fn cast_vote(
        ctx: Context<CastVote>,
        vote: VoteType,
        amount: u64,
    ) -> Result<()> {
        let proposal = &mut ctx.accounts.proposal;
        let voter = &mut ctx.accounts.voter;
        
        // Validate voting period
        let current_time = Clock::get()?.unix_timestamp;
        require!(
            current_time >= proposal.voting_start && current_time <= proposal.voting_end,
            GovernanceError::NotInVotingPeriod
        );
        
        // Validate proposal status
        require!(
            proposal.status == ProposalStatus::Active,
            GovernanceError::ProposalNotActive
        );
        
        // Update vote counts
        match vote {
            VoteType::Yes => {
                proposal.yes_votes = proposal.yes_votes.checked_add(amount)
                    .ok_or(GovernanceError::Overflow)?;
            },
            VoteType::No => {
                proposal.no_votes = proposal.no_votes.checked_add(amount)
                    .ok_or(GovernanceError::Overflow)?;
            },
            VoteType::Abstain => {
                proposal.abstain_votes = proposal.abstain_votes.checked_add(amount)
                    .ok_or(GovernanceError::Overflow)?;
            },
        }
        
        // Record voter participation
        proposal.voters.push(VoterRecord {
            voter: voter.key(),
            vote,
            amount,
            timestamp: current_time,
        });
        
        Ok(())
    }

    pub fn finalize_proposal(
        ctx: Context<FinalizeProposal>,
    ) -> Result<()> {
        let proposal = &mut ctx.accounts.proposal;
        let governance = &mut ctx.accounts.governance;
        
        // Validate proposal can be finalized
        let current_time = Clock::get()?.unix_timestamp;
        require!(
            current_time > proposal.voting_end,
            GovernanceError::VotingStillActive
        );
        
        // Calculate total votes
        let total_votes = proposal.yes_votes
            .checked_add(proposal.no_votes)
            .and_then(|sum| sum.checked_add(proposal.abstain_votes))
            .ok_or(GovernanceError::Overflow)?;
        
        // Check quorum
        require!(
            total_votes >= proposal.quorum,
            GovernanceError::QuorumNotMet
        );
        
        // Determine outcome
        if proposal.yes_votes >= proposal.threshold {
            proposal.status = ProposalStatus::Passed;
        } else {
            proposal.status = ProposalStatus::Rejected;
        }
        
        // Update governance state
        governance.active_proposals = governance.active_proposals.checked_sub(1)
            .ok_or(GovernanceError::Overflow)?;
        
        Ok(())
    }
}

#[derive(Accounts)]
pub struct CreateProposal<'info> {
    #[account(
        init,
        payer = creator,
        space = Proposal::LEN
    )]
    pub proposal: Account<'info, Proposal>,
    
    #[account(mut)]
    pub governance: Account<'info, Governance>,
    
    #[account(mut)]
    pub creator: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CastVote<'info> {
    #[account(mut)]
    pub proposal: Account<'info, Proposal>,
    
    #[account(mut)]
    pub voter: Signer<'info>,
    
    #[account(mut)]
    pub voter_token_account: Account<'info, TokenAccount>,
}

#[derive(Accounts)]
pub struct FinalizeProposal<'info> {
    #[account(mut)]
    pub proposal: Account<'info, Proposal>,
    
    #[account(mut)]
    pub governance: Account<'info, Governance>,
    
    pub finalizer: Signer<'info>,
}

#[account]
pub struct Proposal {
    pub creator: Pubkey,
    pub title: String,
    pub description: String,
    pub category: ProposalCategory,
    pub status: ProposalStatus,
    pub voting_start: i64,
    pub voting_end: i64,
    pub quorum: u64,
    pub threshold: u64,
    pub yes_votes: u64,
    pub no_votes: u64,
    pub abstain_votes: u64,
    pub voters: Vec<VoterRecord>,
    pub created_at: i64,
    pub updated_at: i64,
}

#[account]
pub struct Governance {
    pub total_proposals: u64,
    pub active_proposals: u64,
    pub total_voters: u64,
    pub created_at: i64,
    pub updated_at: i64,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct ProposalParams {
    pub title: String,
    pub description: String,
    pub category: ProposalCategory,
    pub voting_start: i64,
    pub voting_end: i64,
    pub quorum: u64,
    pub threshold: u64,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct VoterRecord {
    pub voter: Pubkey,
    pub vote: VoteType,
    pub amount: u64,
    pub timestamp: i64,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum ProposalCategory {
    ProtocolUpgrade,
    ParameterChange,
    Treasury,
    Community,
    Other,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum ProposalStatus {
    Draft,
    Active,
    Passed,
    Rejected,
    Cancelled,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum VoteType {
    Yes,
    No,
    Abstain,
}

#[error_code]
pub enum GovernanceError {
    #[msg("Not in voting period")]
    NotInVotingPeriod,
    #[msg("Proposal is not active")]
    ProposalNotActive,
    #[msg("Voting is still active")]
    VotingStillActive,
    #[msg("Quorum not met")]
    QuorumNotMet,
    #[msg("Arithmetic overflow")]
    Overflow,
}

impl Proposal {
    pub const LEN: usize = 8 + // discriminator
        32 + // creator
        4 + 100 + // title (max 100 chars)
        4 + 500 + // description (max 500 chars)
        1 + // category
        1 + // status
        8 + // voting_start
        8 + // voting_end
        8 + // quorum
        8 + // threshold
        8 + // yes_votes
        8 + // no_votes
        8 + // abstain_votes
        4 + 100 * 64 + // voters (max 100 voters, 64 bytes each)
        8 + // created_at
        8; // updated_at
}

impl Governance {
    pub const LEN: usize = 8 + // discriminator
        8 + // total_proposals
        8 + // active_proposals
        8 + // total_voters
        8 + // created_at
        8; // updated_at
} 