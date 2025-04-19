use solana_program::{
    account_info::AccountInfo,
    program_error::ProgramError,
    program_pack::{IsInitialized, Pack, Sealed},
    pubkey::Pubkey,
};
use borsh::{BorshSerialize, BorshDeserialize};

#[derive(BorshSerialize, BorshDeserialize, Debug, Clone, Copy, PartialEq, Eq)]
pub enum ProposalStatus {
    Draft,
    Active,
    Passed,
    Rejected,
    Executed,
}

#[derive(BorshSerialize, BorshDeserialize, Debug, Clone, Copy, PartialEq, Eq)]
pub enum VoteType {
    Yes,
    No,
    Abstain,
}

#[derive(BorshSerialize, BorshDeserialize, Debug, Clone)]
pub struct ProposalParams {
    pub title: String,
    pub description: String,
    pub voting_duration: i64,
    pub min_votes: u32,
    pub min_approval_percentage: u8,
}

#[derive(Debug, Clone, BorshSerialize, BorshDeserialize)]
pub struct Proposal {
    pub is_initialized: bool,
    pub authority: Pubkey,
    pub title: String,
    pub description: String,
    pub status: ProposalStatus,
    pub voting_duration: i64,
    pub min_votes: u32,
    pub min_approval_percentage: u8,
    pub yes_votes: u32,
    pub no_votes: u32,
    pub abstain_votes: u32,
    pub created_at: i64,
    pub updated_at: i64,
    pub executed_at: i64,
}

impl Proposal {
    pub const LEN: usize = 1 + // is_initialized
        32 + // authority
        4 + 100 + // title (max 100 chars)
        4 + 1000 + // description (max 1000 chars)
        1 + // status
        8 + // voting_duration
        4 + // min_votes
        1 + // min_approval_percentage
        4 + // yes_votes
        4 + // no_votes
        4 + // abstain_votes
        8 + // created_at
        8 + // updated_at
        8; // executed_at
}

impl Sealed for Proposal {}

impl IsInitialized for Proposal {
    fn is_initialized(&self) -> bool {
        self.is_initialized
    }
}

impl Pack for Proposal {
    const LEN: usize = Self::LEN;

    fn pack_into_slice(&self, dst: &mut [u8]) {
        let mut offset = 0;
        
        // Pack is_initialized
        dst[offset] = self.is_initialized as u8;
        offset += 1;
        
        // Pack authority
        dst[offset..offset + 32].copy_from_slice(&self.authority.to_bytes());
        offset += 32;
        
        // Pack title
        let title_bytes = self.title.as_bytes();
        dst[offset..offset + 4].copy_from_slice(&(title_bytes.len() as u32).to_le_bytes());
        offset += 4;
        dst[offset..offset + title_bytes.len()].copy_from_slice(title_bytes);
        offset += title_bytes.len();
        
        // Pack description
        let desc_bytes = self.description.as_bytes();
        dst[offset..offset + 4].copy_from_slice(&(desc_bytes.len() as u32).to_le_bytes());
        offset += 4;
        dst[offset..offset + desc_bytes.len()].copy_from_slice(desc_bytes);
        offset += desc_bytes.len();
        
        // Pack status
        dst[offset] = self.status as u8;
        offset += 1;
        
        // Pack voting_duration
        dst[offset..offset + 8].copy_from_slice(&self.voting_duration.to_le_bytes());
        offset += 8;
        
        // Pack min_votes
        dst[offset..offset + 4].copy_from_slice(&self.min_votes.to_le_bytes());
        offset += 4;
        
        // Pack min_approval_percentage
        dst[offset] = self.min_approval_percentage;
        offset += 1;
        
        // Pack votes
        dst[offset..offset + 4].copy_from_slice(&self.yes_votes.to_le_bytes());
        offset += 4;
        dst[offset..offset + 4].copy_from_slice(&self.no_votes.to_le_bytes());
        offset += 4;
        dst[offset..offset + 4].copy_from_slice(&self.abstain_votes.to_le_bytes());
        offset += 4;
        
        // Pack timestamps
        dst[offset..offset + 8].copy_from_slice(&self.created_at.to_le_bytes());
        offset += 8;
        dst[offset..offset + 8].copy_from_slice(&self.updated_at.to_le_bytes());
        offset += 8;
        dst[offset..offset + 8].copy_from_slice(&self.executed_at.to_le_bytes());
    }

    fn unpack_from_slice(src: &[u8]) -> Result<Self, ProgramError> {
        let mut offset = 0;
        
        // Unpack is_initialized
        let is_initialized = src[offset] != 0;
        offset += 1;
        
        // Unpack authority
        let authority_bytes: [u8; 32] = src[offset..offset + 32].try_into()
            .map_err(|_| ProgramError::InvalidAccountData)?;
        let authority = Pubkey::from(authority_bytes);
        offset += 32;
        
        // Unpack title
        let title_len = u32::from_le_bytes(src[offset..offset + 4].try_into().unwrap()) as usize;
        offset += 4;
        let title = String::from_utf8(src[offset..offset + title_len].to_vec())
            .map_err(|_| ProgramError::InvalidAccountData)?;
        offset += title_len;
        
        // Unpack description
        let desc_len = u32::from_le_bytes(src[offset..offset + 4].try_into().unwrap()) as usize;
        offset += 4;
        let description = String::from_utf8(src[offset..offset + desc_len].to_vec())
            .map_err(|_| ProgramError::InvalidAccountData)?;
        offset += desc_len;
        
        // Unpack status
        let status = match src[offset] {
            0 => ProposalStatus::Draft,
            1 => ProposalStatus::Active,
            2 => ProposalStatus::Passed,
            3 => ProposalStatus::Rejected,
            4 => ProposalStatus::Executed,
            _ => return Err(ProgramError::InvalidAccountData),
        };
        offset += 1;
        
        // Unpack voting_duration
        let voting_duration = i64::from_le_bytes(src[offset..offset + 8].try_into().unwrap());
        offset += 8;
        
        // Unpack min_votes
        let min_votes = u32::from_le_bytes(src[offset..offset + 4].try_into().unwrap());
        offset += 4;
        
        // Unpack min_approval_percentage
        let min_approval_percentage = src[offset];
        offset += 1;
        
        // Unpack votes
        let yes_votes = u32::from_le_bytes(src[offset..offset + 4].try_into().unwrap());
        offset += 4;
        let no_votes = u32::from_le_bytes(src[offset..offset + 4].try_into().unwrap());
        offset += 4;
        let abstain_votes = u32::from_le_bytes(src[offset..offset + 4].try_into().unwrap());
        offset += 4;
        
        // Unpack timestamps
        let created_at = i64::from_le_bytes(src[offset..offset + 8].try_into().unwrap());
        offset += 8;
        let updated_at = i64::from_le_bytes(src[offset..offset + 8].try_into().unwrap());
        offset += 8;
        let executed_at = i64::from_le_bytes(src[offset..offset + 8].try_into().unwrap());
        
        Ok(Proposal {
            is_initialized,
            authority,
            title,
            description,
            status,
            voting_duration,
            min_votes,
            min_approval_percentage,
            yes_votes,
            no_votes,
            abstain_votes,
            created_at,
            updated_at,
            executed_at,
        })
    }
}

impl Proposal {
    pub fn unpack_unchecked(data: &[u8]) -> Result<Self, ProgramError> {
        Self::unpack_from_slice(data)
    }
} 