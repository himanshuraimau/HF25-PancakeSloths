use anchor_lang::prelude::*;

#[account]
pub struct Governance {
    pub authority: Pubkey,
    pub voting_token_mint: Pubkey,
    pub min_voting_power: u64,
    pub proposal_count: u64,
    pub created_at: i64,
    pub updated_at: i64,
}

#[account]
pub struct Proposal {
    pub governance: Pubkey,
    pub proposer: Pubkey,
    pub title: String,
    pub description: String,
    pub category: ProposalCategory,
    pub status: ProposalStatus,
    pub start_time: i64,
    pub end_time: i64,
    pub yes_votes: u64,
    pub no_votes: u64,
    pub abstain_votes: u64,
    pub created_at: i64,
    pub updated_at: i64,
}

#[account]
pub struct Vote {
    pub proposal: Pubkey,
    pub voter: Pubkey,
    pub voting_power: u64,
    pub choice: VoteType,
    pub created_at: i64,
    pub updated_at: i64,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum ProposalCategory {
    Protocol,
    Treasury,
    Parameter,
    Emergency,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum ProposalStatus {
    Draft,
    Active,
    Passed,
    Rejected,
    Executed,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum VoteType {
    Yes,
    No,
    Abstain,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct GovernanceParams {
    pub min_voting_power: u64,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct ProposalParams {
    pub title: String,
    pub description: String,
    pub category: ProposalCategory,
    pub duration: i64,
}

impl Governance {
    pub const LEN: usize = 8 + // discriminator
        32 + // authority
        32 + // voting_token_mint
        8 + // min_voting_power
        8 + // proposal_count
        8 + // created_at
        8; // updated_at
}

impl Proposal {
    pub const LEN: usize = 8 + // discriminator
        32 + // governance
        32 + // proposer
        4 + 100 + // title (max 100 chars)
        4 + 500 + // description (max 500 chars)
        1 + // category
        1 + // status
        8 + // start_time
        8 + // end_time
        8 + // yes_votes
        8 + // no_votes
        8 + // abstain_votes
        8 + // created_at
        8; // updated_at
}

impl Vote {
    pub const LEN: usize = 8 + // discriminator
        32 + // proposal
        32 + // voter
        8 + // voting_power
        1 + // choice
        8 + // created_at
        8; // updated_at
} 