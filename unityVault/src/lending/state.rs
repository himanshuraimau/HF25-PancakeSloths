use solana_program::{
    program_error::ProgramError,
    program_pack::{IsInitialized, Pack, Sealed},
    pubkey::Pubkey,
};
use borsh::{BorshSerialize, BorshDeserialize};

#[derive(BorshSerialize, BorshDeserialize, Debug, Clone, Copy, PartialEq, Eq)]
pub enum LoanStatus {
    Active,
    Repaid,
    Defaulted,
}

#[derive(BorshSerialize, BorshDeserialize, Debug, Clone)]
pub struct LendingPoolParams {
    pub interest_rate: u64,
    pub max_loan_amount: u64,
    pub min_loan_amount: u64,
}

#[derive(BorshSerialize, BorshDeserialize, Debug, Clone)]
pub struct LoanParams {
    pub amount: u64,
    pub duration: i64,
}

#[derive(Debug, BorshSerialize, BorshDeserialize, Clone)]
pub struct LendingPool {
    pub is_initialized: bool,
    pub authority: Pubkey,
    pub token_mint: Pubkey,
    pub token_vault: Pubkey,
    pub interest_rate: u64,
    pub max_loan_amount: u64,
    pub min_loan_amount: u64,
    pub total_borrowed: u64,
    pub total_deposited: u64,
    pub created_at: i64,
    pub updated_at: i64,
}

#[derive(Debug, BorshSerialize, BorshDeserialize, Clone)]
pub struct Loan {
    pub is_initialized: bool,
    pub borrower: Pubkey,
    pub lending_pool: Pubkey,
    pub amount: u64,
    pub interest_rate: u64,
    pub start_time: i64,
    pub due_time: i64,
    pub status: LoanStatus,
    pub created_at: i64,
    pub updated_at: i64,
}

impl LendingPool {
    pub const LEN: usize = 1 + // is_initialized
        32 + // authority
        32 + // token_mint
        32 + // token_vault
        8 + // interest_rate
        8 + // max_loan_amount
        8 + // min_loan_amount
        8 + // total_borrowed
        8 + // total_deposited
        8 + // created_at
        8; // updated_at
}

impl Loan {
    pub const LEN: usize = 1 + // is_initialized
        32 + // borrower
        32 + // lending_pool
        8 + // amount
        8 + // interest_rate
        8 + // start_time
        8 + // due_time
        1 + // status
        8 + // created_at
        8; // updated_at
}

impl Sealed for LendingPool {}
impl Sealed for Loan {}

impl IsInitialized for LendingPool {
    fn is_initialized(&self) -> bool {
        self.is_initialized
    }
}

impl IsInitialized for Loan {
    fn is_initialized(&self) -> bool {
        self.is_initialized
    }
}

impl Pack for LendingPool {
    const LEN: usize = Self::LEN;

    fn pack_into_slice(&self, dst: &mut [u8]) {
        let mut offset = 0;
        
        dst[offset] = self.is_initialized as u8;
        offset += 1;
        
        dst[offset..offset + 32].copy_from_slice(&self.authority.to_bytes());
        offset += 32;
        
        dst[offset..offset + 32].copy_from_slice(&self.token_mint.to_bytes());
        offset += 32;
        
        dst[offset..offset + 32].copy_from_slice(&self.token_vault.to_bytes());
        offset += 32;
        
        dst[offset..offset + 8].copy_from_slice(&self.interest_rate.to_le_bytes());
        offset += 8;
        
        dst[offset..offset + 8].copy_from_slice(&self.max_loan_amount.to_le_bytes());
        offset += 8;
        
        dst[offset..offset + 8].copy_from_slice(&self.min_loan_amount.to_le_bytes());
        offset += 8;
        
        dst[offset..offset + 8].copy_from_slice(&self.total_borrowed.to_le_bytes());
        offset += 8;
        
        dst[offset..offset + 8].copy_from_slice(&self.total_deposited.to_le_bytes());
        offset += 8;
        
        dst[offset..offset + 8].copy_from_slice(&self.created_at.to_le_bytes());
        offset += 8;
        
        dst[offset..offset + 8].copy_from_slice(&self.updated_at.to_le_bytes());
    }

    fn unpack_from_slice(src: &[u8]) -> Result<Self, ProgramError> {
        let mut offset = 0;
        
        let is_initialized = src[offset] != 0;
        offset += 1;
        
        let authority_bytes: [u8; 32] = src[offset..offset + 32].try_into()
            .map_err(|_| ProgramError::InvalidAccountData)?;
        let authority = Pubkey::from(authority_bytes);
        offset += 32;
        
        let token_mint_bytes: [u8; 32] = src[offset..offset + 32].try_into()
            .map_err(|_| ProgramError::InvalidAccountData)?;
        let token_mint = Pubkey::from(token_mint_bytes);
        offset += 32;
        
        let token_vault_bytes: [u8; 32] = src[offset..offset + 32].try_into()
            .map_err(|_| ProgramError::InvalidAccountData)?;
        let token_vault = Pubkey::from(token_vault_bytes);
        offset += 32;
        
        let interest_rate = u64::from_le_bytes(src[offset..offset + 8].try_into().unwrap());
        offset += 8;
        
        let max_loan_amount = u64::from_le_bytes(src[offset..offset + 8].try_into().unwrap());
        offset += 8;
        
        let min_loan_amount = u64::from_le_bytes(src[offset..offset + 8].try_into().unwrap());
        offset += 8;
        
        let total_borrowed = u64::from_le_bytes(src[offset..offset + 8].try_into().unwrap());
        offset += 8;
        
        let total_deposited = u64::from_le_bytes(src[offset..offset + 8].try_into().unwrap());
        offset += 8;
        
        let created_at = i64::from_le_bytes(src[offset..offset + 8].try_into().unwrap());
        offset += 8;
        
        let updated_at = i64::from_le_bytes(src[offset..offset + 8].try_into().unwrap());
        
        Ok(LendingPool {
            is_initialized,
            authority,
            token_mint,
            token_vault,
            interest_rate,
            max_loan_amount,
            min_loan_amount,
            total_borrowed,
            total_deposited,
            created_at,
            updated_at,
        })
    }
}

impl Pack for Loan {
    const LEN: usize = Self::LEN;

    fn pack_into_slice(&self, dst: &mut [u8]) {
        let mut offset = 0;
        
        dst[offset] = self.is_initialized as u8;
        offset += 1;
        
        dst[offset..offset + 32].copy_from_slice(&self.borrower.to_bytes());
        offset += 32;
        
        dst[offset..offset + 32].copy_from_slice(&self.lending_pool.to_bytes());
        offset += 32;
        
        dst[offset..offset + 8].copy_from_slice(&self.amount.to_le_bytes());
        offset += 8;
        
        dst[offset..offset + 8].copy_from_slice(&self.interest_rate.to_le_bytes());
        offset += 8;
        
        dst[offset..offset + 8].copy_from_slice(&self.start_time.to_le_bytes());
        offset += 8;
        
        dst[offset..offset + 8].copy_from_slice(&self.due_time.to_le_bytes());
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
        
        let borrower_bytes: [u8; 32] = src[offset..offset + 32].try_into()
            .map_err(|_| ProgramError::InvalidAccountData)?;
        let borrower = Pubkey::from(borrower_bytes);
        offset += 32;
        
        let lending_pool_bytes: [u8; 32] = src[offset..offset + 32].try_into()
            .map_err(|_| ProgramError::InvalidAccountData)?;
        let lending_pool = Pubkey::from(lending_pool_bytes);
        offset += 32;
        
        let amount = u64::from_le_bytes(src[offset..offset + 8].try_into().unwrap());
        offset += 8;
        
        let interest_rate = u64::from_le_bytes(src[offset..offset + 8].try_into().unwrap());
        offset += 8;
        
        let start_time = i64::from_le_bytes(src[offset..offset + 8].try_into().unwrap());
        offset += 8;
        
        let due_time = i64::from_le_bytes(src[offset..offset + 8].try_into().unwrap());
        offset += 8;
        
        let status = match src[offset] {
            0 => LoanStatus::Active,
            1 => LoanStatus::Repaid,
            2 => LoanStatus::Defaulted,
            _ => return Err(ProgramError::InvalidAccountData),
        };
        offset += 1;
        
        let created_at = i64::from_le_bytes(src[offset..offset + 8].try_into().unwrap());
        offset += 8;
        
        let updated_at = i64::from_le_bytes(src[offset..offset + 8].try_into().unwrap());
        
        Ok(Loan {
            is_initialized,
            borrower,
            lending_pool,
            amount,
            interest_rate,
            start_time,
            due_time,
            status,
            created_at,
            updated_at,
        })
    }
} 