use solana_program::{
    program_error::ProgramError,
    program_pack::{IsInitialized, Pack, Sealed},
    pubkey::Pubkey,
};
use borsh::{BorshSerialize, BorshDeserialize};

#[derive(Debug, Clone, Copy, PartialEq, Eq, BorshSerialize, BorshDeserialize)]
pub enum CommunityRole {
    Admin,
    Moderator,
    Member,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, BorshSerialize, BorshDeserialize)]
pub enum CommunityStatus {
    Active,
    Suspended,
    Archived,
}

#[derive(Debug, Clone, BorshSerialize, BorshDeserialize)]
pub struct CommunityParams {
    pub name: String,
    pub description: String,
    pub rules: String,
    pub is_private: bool,
}

#[derive(Debug, Clone, BorshSerialize, BorshDeserialize)]
pub struct Community {
    pub is_initialized: bool,
    pub authority: Pubkey,
    pub name: String,
    pub description: String,
    pub rules: String,
    pub is_private: bool,
    pub status: CommunityStatus,
    pub member_count: u32,
    pub created_at: i64,
    pub updated_at: i64,
}

impl Community {
    pub const LEN: usize = 1 + // is_initialized
        32 + // authority
        4 + 100 + // name (max 100 chars)
        4 + 500 + // description (max 500 chars)
        4 + 1000 + // rules (max 1000 chars)
        1 + // is_private
        1 + // status
        4 + // member_count
        8 + // created_at
        8; // updated_at
}

impl Sealed for Community {}

impl IsInitialized for Community {
    fn is_initialized(&self) -> bool {
        self.is_initialized
    }
}

impl Pack for Community {
    const LEN: usize = Self::LEN;

    fn pack_into_slice(&self, dst: &mut [u8]) {
        let mut offset = 0;
        
        // Pack is_initialized
        dst[offset] = self.is_initialized as u8;
        offset += 1;
        
        // Pack authority
        dst[offset..offset + 32].copy_from_slice(&self.authority.to_bytes());
        offset += 32;
        
        // Pack name
        let name_bytes = self.name.as_bytes();
        dst[offset..offset + 4].copy_from_slice(&(name_bytes.len() as u32).to_le_bytes());
        offset += 4;
        dst[offset..offset + name_bytes.len()].copy_from_slice(name_bytes);
        offset += name_bytes.len();
        
        // Pack description
        let desc_bytes = self.description.as_bytes();
        dst[offset..offset + 4].copy_from_slice(&(desc_bytes.len() as u32).to_le_bytes());
        offset += 4;
        dst[offset..offset + desc_bytes.len()].copy_from_slice(desc_bytes);
        offset += desc_bytes.len();
        
        // Pack rules
        let rules_bytes = self.rules.as_bytes();
        dst[offset..offset + 4].copy_from_slice(&(rules_bytes.len() as u32).to_le_bytes());
        offset += 4;
        dst[offset..offset + rules_bytes.len()].copy_from_slice(rules_bytes);
        offset += rules_bytes.len();
        
        // Pack is_private
        dst[offset] = self.is_private as u8;
        offset += 1;
        
        // Pack status
        dst[offset] = self.status as u8;
        offset += 1;
        
        // Pack member_count
        dst[offset..offset + 4].copy_from_slice(&self.member_count.to_le_bytes());
        offset += 4;
        
        // Pack timestamps
        dst[offset..offset + 8].copy_from_slice(&self.created_at.to_le_bytes());
        offset += 8;
        dst[offset..offset + 8].copy_from_slice(&self.updated_at.to_le_bytes());
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
        
        // Unpack name
        let name_len = u32::from_le_bytes(src[offset..offset + 4].try_into().unwrap()) as usize;
        offset += 4;
        let name = String::from_utf8(src[offset..offset + name_len].to_vec())
            .map_err(|_| ProgramError::InvalidAccountData)?;
        offset += name_len;
        
        // Unpack description
        let desc_len = u32::from_le_bytes(src[offset..offset + 4].try_into().unwrap()) as usize;
        offset += 4;
        let description = String::from_utf8(src[offset..offset + desc_len].to_vec())
            .map_err(|_| ProgramError::InvalidAccountData)?;
        offset += desc_len;
        
        // Unpack rules
        let rules_len = u32::from_le_bytes(src[offset..offset + 4].try_into().unwrap()) as usize;
        offset += 4;
        let rules = String::from_utf8(src[offset..offset + rules_len].to_vec())
            .map_err(|_| ProgramError::InvalidAccountData)?;
        offset += rules_len;
        
        // Unpack is_private
        let is_private = src[offset] != 0;
        offset += 1;
        
        // Unpack status
        let status = match src[offset] {
            0 => CommunityStatus::Active,
            1 => CommunityStatus::Suspended,
            2 => CommunityStatus::Archived,
            _ => return Err(ProgramError::InvalidAccountData),
        };
        offset += 1;
        
        // Unpack member_count
        let member_count = u32::from_le_bytes(src[offset..offset + 4].try_into().unwrap());
        offset += 4;
        
        // Unpack timestamps
        let created_at = i64::from_le_bytes(src[offset..offset + 8].try_into().unwrap());
        offset += 8;
        let updated_at = i64::from_le_bytes(src[offset..offset + 8].try_into().unwrap());
        
        Ok(Community {
            is_initialized,
            authority,
            name,
            description,
            rules,
            is_private,
            status,
            member_count,
            created_at,
            updated_at,
        })
    }
} 