use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount};

declare_id!("Govz1Vy1h2fteYoWfD75UGj6XtgKQdW3tKkwD8Tigq6u");

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
        proposal.governance = governance.key();
        proposal.title = params.title;
        proposal.description = params.description;
        proposal.category = params.category;
        proposal.status = ProposalStatus::Draft;
        proposal.voting_start = params.voting_start;
        proposal.voting_end = params.voting_end;
        proposal.quorum = params.quorum;
        proposal.threshold = params.threshold;
        proposal.yes_votes = 0;
        proposal.no_votes = 0;
        proposal.abstain_votes = 0;
        proposal.total_votes = 0;
        proposal.created_at = Clock::get()?.unix_timestamp;
        proposal.updated_at = Clock::get()?.unix_timestamp;
        
        // Update governance
        governance.active_proposals = governance.active_proposals.checked_add(1).unwrap();
        governance.total_proposals = governance.total_proposals.checked_add(1).unwrap();
        governance.updated_at = Clock::get()?.unix_timestamp;
        
        Ok(())
    }

    pub fn cast_vote(
        ctx: Context<CastVote>,
        vote: Vote,
    ) -> Result<()> {
        let vote_record = &mut ctx.accounts.vote_record;
        let proposal = &mut ctx.accounts.proposal;
        
        // Check if voting period is active
        let current_time = Clock::get()?.unix_timestamp;
        require!(
            current_time >= proposal.voting_start && current_time <= proposal.voting_end,
            GovernanceError::NotInVotingPeriod
        );
        
        // Initialize vote record
        vote_record.voter = ctx.accounts.voter.key();
        vote_record.proposal = proposal.key();
        vote_record.vote = vote;
        vote_record.weight = ctx.accounts.voter_token_account.amount;
        vote_record.created_at = current_time;
        
        // Update proposal votes
        match vote {
            Vote::Yes => proposal.yes_votes = proposal.yes_votes.checked_add(vote_record.weight).unwrap(),
            Vote::No => proposal.no_votes = proposal.no_votes.checked_add(vote_record.weight).unwrap(),
            Vote::Abstain => proposal.abstain_votes = proposal.abstain_votes.checked_add(vote_record.weight).unwrap(),
        }
        proposal.total_votes = proposal.total_votes.checked_add(vote_record.weight).unwrap();
        proposal.updated_at = current_time;
        
        Ok(())
    }

    pub fn finalize_proposal(
        ctx: Context<FinalizeProposal>,
    ) -> Result<()> {
        let proposal = &mut ctx.accounts.proposal;
        let governance = &mut ctx.accounts.governance;
        
        // Check if voting period has ended
        let current_time = Clock::get()?.unix_timestamp;
        require!(
            current_time > proposal.voting_end,
            GovernanceError::VotingNotEnded
        );
        
        // Check if proposal is already finalized
        require!(
            proposal.status == ProposalStatus::Draft,
            GovernanceError::AlreadyFinalized
        );
        
        // Check quorum
        let total_supply = ctx.accounts.governance_token_mint.supply;
        let quorum_threshold = total_supply.checked_mul(proposal.quorum as u64).unwrap() / 100;
        require!(
            proposal.total_votes >= quorum_threshold,
            GovernanceError::QuorumNotMet
        );
        
        // Determine outcome
        let yes_percentage = proposal.yes_votes.checked_mul(100).unwrap() / proposal.total_votes;
        if yes_percentage >= proposal.threshold as u64 {
            proposal.status = ProposalStatus::Passed;
        } else {
            proposal.status = ProposalStatus::Rejected;
        }
        
        // Update governance
        governance.active_proposals = governance.active_proposals.checked_sub(1).unwrap();
        governance.updated_at = current_time;
        
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
    #[account(
        init,
        payer = voter,
        space = VoteRecord::LEN
    )]
    pub vote_record: Account<'info, VoteRecord>,
    #[account(mut)]
    pub proposal: Account<'info, Proposal>,
    #[account(mut)]
    pub voter: Signer<'info>,
    #[account(
        mut,
        constraint = voter_token_account.mint == governance_token_mint.key(),
        constraint = voter_token_account.owner == voter.key()
    )]
    pub voter_token_account: Account<'info, TokenAccount>,
    pub governance_token_mint: Account<'info, Mint>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct FinalizeProposal<'info> {
    #[account(mut)]
    pub proposal: Account<'info, Proposal>,
    #[account(mut)]
    pub governance: Account<'info, Governance>,
    pub governance_token_mint: Account<'info, Mint>,
}

#[account]
pub struct Governance {
    pub admin: Pubkey,
    pub token_mint: Pubkey,
    pub active_proposals: u64,
    pub total_proposals: u64,
    pub created_at: i64,
    pub updated_at: i64,
}

#[account]
pub struct Proposal {
    pub creator: Pubkey,
    pub governance: Pubkey,
    pub title: String,
    pub description: String,
    pub category: ProposalCategory,
    pub status: ProposalStatus,
    pub voting_start: i64,
    pub voting_end: i64,
    pub quorum: u8,
    pub threshold: u8,
    pub yes_votes: u64,
    pub no_votes: u64,
    pub abstain_votes: u64,
    pub total_votes: u64,
    pub created_at: i64,
    pub updated_at: i64,
}

#[account]
pub struct VoteRecord {
    pub voter: Pubkey,
    pub proposal: Pubkey,
    pub vote: Vote,
    pub weight: u64,
    pub created_at: i64,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum ProposalCategory {
    Protocol,
    Treasury,
    Parameter,
    Other,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum ProposalStatus {
    Draft,
    Passed,
    Rejected,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum Vote {
    Yes,
    No,
    Abstain,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct ProposalParams {
    pub title: String,
    pub description: String,
    pub category: ProposalCategory,
    pub voting_start: i64,
    pub voting_end: i64,
    pub quorum: u8,
    pub threshold: u8,
}

impl Governance {
    pub const LEN: usize = 8 + // discriminator
        32 + // admin
        32 + // token_mint
        8 + // active_proposals
        8 + // total_proposals
        8 + // created_at
        8; // updated_at
}

impl Proposal {
    pub const LEN: usize = 8 + // discriminator
        32 + // creator
        32 + // governance
        4 + 200 + // title (max 200 chars)
        4 + 1000 + // description (max 1000 chars)
        1 + // category
        1 + // status
        8 + // voting_start
        8 + // voting_end
        1 + // quorum
        1 + // threshold
        8 + // yes_votes
        8 + // no_votes
        8 + // abstain_votes
        8 + // total_votes
        8 + // created_at
        8; // updated_at
}

impl VoteRecord {
    pub const LEN: usize = 8 + // discriminator
        32 + // voter
        32 + // proposal
        1 + // vote
        8 + // weight
        8; // created_at
}

#[error_code]
pub enum GovernanceError {
    #[msg("Not in voting period")]
    NotInVotingPeriod,
    #[msg("Voting period has not ended")]
    VotingNotEnded,
    #[msg("Proposal already finalized")]
    AlreadyFinalized,
    #[msg("Quorum not met")]
    QuorumNotMet,
} 