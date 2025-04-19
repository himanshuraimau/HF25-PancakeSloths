use solana_program::{
    program_error::ProgramError,
    program_pack::{IsInitialized, Pack, Sealed},
    pubkey::Pubkey,
};
use borsh::{BorshSerialize, BorshDeserialize};

#[derive(BorshSerialize, BorshDeserialize, Debug, Clone, Copy, PartialEq, Eq)]
pub enum TokenStatus {
    Active,
    Paused,
    Frozen,
}

#[derive(BorshSerialize, BorshDeserialize, Debug, Clone)]
pub struct TokenParams {
    pub name: String,
    pub symbol: String,
    pub decimals: u8,
    pub total_supply: u64,
}

#[derive(Debug, BorshSerialize, BorshDeserialize, Clone)]
pub struct TokenInfo {
    pub is_initialized: bool,
    pub creator: Pubkey,
    pub mint: Pubkey,
    pub name: String,
    pub symbol: String,
    pub decimals: u8,
    pub total_supply: u64,
    pub status: TokenStatus,
    pub created_at: i64,
    pub updated_at: i64,
}

impl TokenInfo {
    pub const LEN: usize = 1 + // is_initialized
        32 + // creator
        32 + // mint
        4 + 100 + // name (max 100 chars)
        4 + 10 + // symbol (max 10 chars)
        1 + // decimals
        8 + // total_supply
        1 + // status
        8 + // created_at
        8; // updated_at
}

impl Sealed for TokenInfo {}

impl IsInitialized for TokenInfo {
    fn is_initialized(&self) -> bool {
        self.is_initialized
    }
}

impl Pack for TokenInfo {
    const LEN: usize = Self::LEN;

    fn pack_into_slice(&self, dst: &mut [u8]) {
        let mut offset = 0;
        
        dst[offset] = self.is_initialized as u8;
        offset += 1;
        
        dst[offset..offset + 32].copy_from_slice(&self.creator.to_bytes());
        offset += 32;
        
        dst[offset..offset + 32].copy_from_slice(&self.mint.to_bytes());
        offset += 32;
        
        // Pack name
        let name_bytes = self.name.as_bytes();
        dst[offset..offset + 4].copy_from_slice(&(name_bytes.len() as u32).to_le_bytes());
        offset += 4;
        dst[offset..offset + name_bytes.len()].copy_from_slice(name_bytes);
        offset += 100;
        
        // Pack symbol
        let symbol_bytes = self.symbol.as_bytes();
        dst[offset..offset + 4].copy_from_slice(&(symbol_bytes.len() as u32).to_le_bytes());
        offset += 4;
        dst[offset..offset + symbol_bytes.len()].copy_from_slice(symbol_bytes);
        offset += 10;
        
        dst[offset] = self.decimals;
        offset += 1;
        
        dst[offset..offset + 8].copy_from_slice(&self.total_supply.to_le_bytes());
        offset += 8;
        
        dst[offset] = self.status as u8;
        offset += 1;
        
        dst[offset..offset + 8].copy_from_slice(&self.created_at.to_le_bytes());
        offset += 8;
        
        dst[offset..offset + 8].copy_from_slice(&self.updated_at.to_le_bytes());
    }

    fn unpack_from_slice(src: &[u8]) -> Result<Self, ProgramError> {
        let mut offset = 0;
        
        let is_initialized = src[offset] != 0;
        offset += 1;
        
        let creator_bytes: [u8; 32] = src[offset..offset + 32].try_into()
            .map_err(|_| ProgramError::InvalidAccountData)?;
        let creator = Pubkey::from(creator_bytes);
        offset += 32;
        
        let mint_bytes: [u8; 32] = src[offset..offset + 32].try_into()
            .map_err(|_| ProgramError::InvalidAccountData)?;
        let mint = Pubkey::from(mint_bytes);
        offset += 32;
        
        // Unpack name
        let name_len = u32::from_le_bytes(src[offset..offset + 4].try_into().unwrap()) as usize;
        offset += 4;
        let name = String::from_utf8(src[offset..offset + name_len].to_vec())
            .map_err(|_| ProgramError::InvalidAccountData)?;
        offset += 100;
        
        // Unpack symbol
        let symbol_len = u32::from_le_bytes(src[offset..offset + 4].try_into().unwrap()) as usize;
        offset += 4;
        let symbol = String::from_utf8(src[offset..offset + symbol_len].to_vec())
            .map_err(|_| ProgramError::InvalidAccountData)?;
        offset += 10;
        
        let decimals = src[offset];
        offset += 1;
        
        let total_supply = u64::from_le_bytes(src[offset..offset + 8].try_into().unwrap());
        offset += 8;
        
        let status = match src[offset] {
            0 => TokenStatus::Active,
            1 => TokenStatus::Paused,
            2 => TokenStatus::Frozen,
            _ => return Err(ProgramError::InvalidAccountData),
        };
        offset += 1;
        
        let created_at = i64::from_le_bytes(src[offset..offset + 8].try_into().unwrap());
        offset += 8;
        
        let updated_at = i64::from_le_bytes(src[offset..offset + 8].try_into().unwrap());
        
        Ok(TokenInfo {
            is_initialized,
            creator,
            mint,
            name,
            symbol,
            decimals,
            total_supply,
            status,
            created_at,
            updated_at,
        })
    }
} 