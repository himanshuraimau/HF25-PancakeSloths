use solana_program::{
    program_pack::{IsInitialized, Pack, Sealed},
    pubkey::Pubkey,
};
use std::convert::TryInto;
use borsh::{BorshSerialize, BorshDeserialize};

#[derive(Debug, Clone, Copy, PartialEq, Eq, BorshSerialize, BorshDeserialize)]
pub enum UserRole {
    Admin,
    Moderator,
    User,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, BorshSerialize, BorshDeserialize)]
pub enum UserStatus {
    Active,
    Suspended,
    Banned,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, BorshSerialize, BorshDeserialize)]
pub enum KycStatus {
    Pending,
    Verified,
    Rejected,
}

#[derive(Debug, Clone, BorshSerialize, BorshDeserialize)]
pub struct KycData {
    pub document_type: String,
    pub document_number: String,
    pub verified_at: i64,
}

#[derive(Debug, Clone, BorshSerialize, BorshDeserialize)]
pub struct UserProfile {
    pub is_initialized: bool,
    pub authority: Pubkey,
    pub full_name: String,
    pub email: String,
    pub role: UserRole,
    pub status: UserStatus,
    pub two_factor_enabled: bool,
    pub two_factor_secret: String,
    pub two_factor_backup_codes: Vec<String>,
    pub kyc_verified: bool,
    pub kyc_status: KycStatus,
    pub kyc_data: KycData,
    pub accredited_status: bool,
    pub created_at: i64,
    pub updated_at: i64,
}

impl UserProfile {
    pub const LEN: usize = 1 + // is_initialized
        32 + // authority
        4 + 100 + // full_name (max 100 chars)
        4 + 100 + // email (max 100 chars)
        1 + // role
        1 + // status
        1 + // two_factor_enabled
        4 + 100 + // two_factor_secret (max 100 chars)
        4 + 10 * 50 + // two_factor_backup_codes (max 10 codes, 50 chars each)
        1 + // kyc_verified
        1 + // kyc_status
        4 + 100 + // kyc_data.document_type (max 100 chars)
        4 + 100 + // kyc_data.document_number (max 100 chars)
        8 + // kyc_data.verified_at
        1 + // accredited_status
        8 + // created_at
        8; // updated_at
}

impl Sealed for UserProfile {}

impl IsInitialized for UserProfile {
    fn is_initialized(&self) -> bool {
        self.is_initialized
    }
}

impl Pack for UserProfile {
    const LEN: usize = Self::LEN;

    fn pack_into_slice(&self, dst: &mut [u8]) {
        let mut offset = 0;
        
        // Pack is_initialized
        dst[offset] = self.is_initialized as u8;
        offset += 1;
        
        // Pack authority
        dst[offset..offset + 32].copy_from_slice(&self.authority.to_bytes());
        offset += 32;
        
        // Pack full_name
        let full_name_bytes = self.full_name.as_bytes();
        dst[offset..offset + 4].copy_from_slice(&(full_name_bytes.len() as u32).to_le_bytes());
        offset += 4;
        dst[offset..offset + full_name_bytes.len()].copy_from_slice(full_name_bytes);
        offset += full_name_bytes.len();
        
        // Pack email
        let email_bytes = self.email.as_bytes();
        dst[offset..offset + 4].copy_from_slice(&(email_bytes.len() as u32).to_le_bytes());
        offset += 4;
        dst[offset..offset + email_bytes.len()].copy_from_slice(email_bytes);
        offset += email_bytes.len();
        
        // Pack role
        dst[offset] = self.role as u8;
        offset += 1;
        
        // Pack status
        dst[offset] = self.status as u8;
        offset += 1;
        
        // Pack two_factor_enabled
        dst[offset] = self.two_factor_enabled as u8;
        offset += 1;
        
        // Pack two_factor_secret
        let secret_bytes = self.two_factor_secret.as_bytes();
        dst[offset..offset + 4].copy_from_slice(&(secret_bytes.len() as u32).to_le_bytes());
        offset += 4;
        dst[offset..offset + secret_bytes.len()].copy_from_slice(secret_bytes);
        offset += secret_bytes.len();
        
        // Pack two_factor_backup_codes
        dst[offset..offset + 4].copy_from_slice(&(self.two_factor_backup_codes.len() as u32).to_le_bytes());
        offset += 4;
        for code in &self.two_factor_backup_codes {
            let code_bytes = code.as_bytes();
            dst[offset..offset + 4].copy_from_slice(&(code_bytes.len() as u32).to_le_bytes());
            offset += 4;
            dst[offset..offset + code_bytes.len()].copy_from_slice(code_bytes);
            offset += code_bytes.len();
        }
        
        // Pack kyc_verified
        dst[offset] = self.kyc_verified as u8;
        offset += 1;
        
        // Pack kyc_status
        dst[offset] = self.kyc_status as u8;
        offset += 1;
        
        // Pack kyc_data
        let doc_type_bytes = self.kyc_data.document_type.as_bytes();
        dst[offset..offset + 4].copy_from_slice(&(doc_type_bytes.len() as u32).to_le_bytes());
        offset += 4;
        dst[offset..offset + doc_type_bytes.len()].copy_from_slice(doc_type_bytes);
        offset += doc_type_bytes.len();
        
        let doc_number_bytes = self.kyc_data.document_number.as_bytes();
        dst[offset..offset + 4].copy_from_slice(&(doc_number_bytes.len() as u32).to_le_bytes());
        offset += 4;
        dst[offset..offset + doc_number_bytes.len()].copy_from_slice(doc_number_bytes);
        offset += doc_number_bytes.len();
        
        dst[offset..offset + 8].copy_from_slice(&self.kyc_data.verified_at.to_le_bytes());
        offset += 8;
        
        // Pack accredited_status
        dst[offset] = self.accredited_status as u8;
        offset += 1;
        
        // Pack timestamps
        dst[offset..offset + 8].copy_from_slice(&self.created_at.to_le_bytes());
        offset += 8;
        dst[offset..offset + 8].copy_from_slice(&self.updated_at.to_le_bytes());
    }

    fn unpack_from_slice(src: &[u8]) -> Result<Self, solana_program::program_error::ProgramError> {
        let mut offset = 0;
        
        // Unpack is_initialized
        let is_initialized = src[offset] != 0;
        offset += 1;
        
        // Unpack authority
        let authority_bytes: [u8; 32] = src[offset..offset + 32].try_into()
            .map_err(|_| solana_program::program_error::ProgramError::InvalidAccountData)?;
        let authority = Pubkey::from(authority_bytes);
        offset += 32;
        
        // Unpack full_name
        let full_name_len = u32::from_le_bytes(src[offset..offset + 4].try_into().unwrap()) as usize;
        offset += 4;
        let full_name = String::from_utf8(src[offset..offset + full_name_len].to_vec())
            .map_err(|_| solana_program::program_error::ProgramError::InvalidAccountData)?;
        offset += full_name_len;
        
        // Unpack email
        let email_len = u32::from_le_bytes(src[offset..offset + 4].try_into().unwrap()) as usize;
        offset += 4;
        let email = String::from_utf8(src[offset..offset + email_len].to_vec())
            .map_err(|_| solana_program::program_error::ProgramError::InvalidAccountData)?;
        offset += email_len;
        
        // Unpack role
        let role = match src[offset] {
            0 => UserRole::Admin,
            1 => UserRole::Moderator,
            2 => UserRole::User,
            _ => return Err(solana_program::program_error::ProgramError::InvalidAccountData),
        };
        offset += 1;
        
        // Unpack status
        let status = match src[offset] {
            0 => UserStatus::Active,
            1 => UserStatus::Suspended,
            2 => UserStatus::Banned,
            _ => return Err(solana_program::program_error::ProgramError::InvalidAccountData),
        };
        offset += 1;
        
        // Unpack two_factor_enabled
        let two_factor_enabled = src[offset] != 0;
        offset += 1;
        
        // Unpack two_factor_secret
        let secret_len = u32::from_le_bytes(src[offset..offset + 4].try_into().unwrap()) as usize;
        offset += 4;
        let two_factor_secret = String::from_utf8(src[offset..offset + secret_len].to_vec())
            .map_err(|_| solana_program::program_error::ProgramError::InvalidAccountData)?;
        offset += secret_len;
        
        // Unpack two_factor_backup_codes
        let codes_len = u32::from_le_bytes(src[offset..offset + 4].try_into().unwrap()) as usize;
        offset += 4;
        let mut two_factor_backup_codes = Vec::with_capacity(codes_len);
        for _ in 0..codes_len {
            let code_len = u32::from_le_bytes(src[offset..offset + 4].try_into().unwrap()) as usize;
            offset += 4;
            let code = String::from_utf8(src[offset..offset + code_len].to_vec())
                .map_err(|_| solana_program::program_error::ProgramError::InvalidAccountData)?;
            offset += code_len;
            two_factor_backup_codes.push(code);
        }
        
        // Unpack kyc_verified
        let kyc_verified = src[offset] != 0;
        offset += 1;
        
        // Unpack kyc_status
        let kyc_status = match src[offset] {
            0 => KycStatus::Pending,
            1 => KycStatus::Verified,
            2 => KycStatus::Rejected,
            _ => return Err(solana_program::program_error::ProgramError::InvalidAccountData),
        };
        offset += 1;
        
        // Unpack kyc_data
        let doc_type_len = u32::from_le_bytes(src[offset..offset + 4].try_into().unwrap()) as usize;
        offset += 4;
        let document_type = String::from_utf8(src[offset..offset + doc_type_len].to_vec())
            .map_err(|_| solana_program::program_error::ProgramError::InvalidAccountData)?;
        offset += doc_type_len;
        
        let doc_number_len = u32::from_le_bytes(src[offset..offset + 4].try_into().unwrap()) as usize;
        offset += 4;
        let document_number = String::from_utf8(src[offset..offset + doc_number_len].to_vec())
            .map_err(|_| solana_program::program_error::ProgramError::InvalidAccountData)?;
        offset += doc_number_len;
        
        let verified_at = i64::from_le_bytes(src[offset..offset + 8].try_into().unwrap());
        offset += 8;
        
        // Unpack accredited_status
        let accredited_status = src[offset] != 0;
        offset += 1;
        
        // Unpack timestamps
        let created_at = i64::from_le_bytes(src[offset..offset + 8].try_into().unwrap());
        offset += 8;
        let updated_at = i64::from_le_bytes(src[offset..offset + 8].try_into().unwrap());
        
        Ok(UserProfile {
            is_initialized,
            authority,
            full_name,
            email,
            role,
            status,
            two_factor_enabled,
            two_factor_secret,
            two_factor_backup_codes,
            kyc_verified,
            kyc_status,
            kyc_data: KycData {
                document_type,
                document_number,
                verified_at,
            },
            accredited_status,
            created_at,
            updated_at,
        })
    }
} 