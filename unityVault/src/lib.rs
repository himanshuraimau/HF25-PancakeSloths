use solana_program::{
    account_info::AccountInfo,
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    pubkey::Pubkey,
};
use borsh::{BorshDeserialize, BorshSerialize};

pub mod user;
pub mod governance;
pub mod community;
pub mod lending;
pub mod tokenization;


entrypoint!(process_instruction);

pub fn process_instruction<'a>(
    program_id: &Pubkey,
    accounts: &'a [AccountInfo<'a>],
    instruction_data: &[u8],
) -> ProgramResult {
    msg!("Processing instruction");
    
    // Deserialize instruction data
    let instruction = Instruction::try_from_slice(instruction_data)
        .map_err(|_| solana_program::program_error::ProgramError::InvalidInstructionData)?;
    
    match instruction {
        Instruction::User(user_instruction) => match user_instruction {
            UserInstruction::CreateUserProfile(params) => {
                user::instructions::create_user_profile(program_id, accounts, params)
            }
            UserInstruction::UpdateUserProfile(params) => {
                user::instructions::update_user_profile(program_id, accounts, params)
            }
            UserInstruction::EnableTwoFactor { secret, backup_codes } => {
                user::instructions::enable_two_factor(program_id, accounts, secret, backup_codes)
            }
            UserInstruction::VerifyKyc(kyc_data) => {
                user::instructions::verify_kyc(program_id, accounts, kyc_data)
            }
        },
        Instruction::Governance(governance_instruction) => match governance_instruction {
            GovernanceInstruction::CreateProposal(params) => {
                governance::instructions::create_proposal(program_id, accounts, params)
            }
            GovernanceInstruction::UpdateProposal(params) => {
                governance::instructions::update_proposal(program_id, accounts, params)
            }
            GovernanceInstruction::VoteProposal(vote_type) => {
                governance::instructions::vote_proposal(program_id, accounts, vote_type)
            }
        },
        Instruction::Community(community_instruction) => match community_instruction {
            CommunityInstruction::CreateCommunity(params) => {
                community::instructions::create_community(program_id, accounts, params)
            }
            CommunityInstruction::UpdateCommunity(params) => {
                community::instructions::update_community(program_id, accounts, params)
            }
            CommunityInstruction::SuspendCommunity => {
                community::instructions::suspend_community(program_id, accounts)
            }
        },
        Instruction::Lending(lending_instruction) => match lending_instruction {
            LendingInstruction::InitLendingPool(params) => {
                lending::instructions::init_lending_pool(program_id, accounts, params)
            }
            LendingInstruction::CreateLoan(params) => {
                lending::instructions::create_loan(program_id, accounts, params)
            }
            LendingInstruction::RepayLoan => {
                lending::instructions::repay_loan(program_id, accounts)
            }
        },
        Instruction::Tokenization(tokenization_instruction) => match tokenization_instruction {
            TokenizationInstruction::CreateToken(params) => {
                tokenization::instructions::create_token(program_id, accounts, params)
            }
            TokenizationInstruction::TransferTokens(amount) => {
                tokenization::instructions::transfer_tokens(program_id, accounts, amount)
            }
            TokenizationInstruction::BurnTokens(amount) => {
                tokenization::instructions::burn_tokens(program_id, accounts, amount)
            }
        },
    }
}

#[derive(BorshSerialize, BorshDeserialize)]
pub enum Instruction {
    User(UserInstruction),
    Governance(GovernanceInstruction),
    Community(CommunityInstruction),
    Lending(LendingInstruction),
    Tokenization(TokenizationInstruction),
}

#[derive(BorshSerialize, BorshDeserialize)]
pub enum UserInstruction {
    CreateUserProfile(user::UserProfileParams),
    UpdateUserProfile(user::UserProfileParams),
    EnableTwoFactor {
        secret: String,
        backup_codes: Vec<String>,
    },
    VerifyKyc(user::KycData),
}

#[derive(BorshSerialize, BorshDeserialize)]
pub enum GovernanceInstruction {
    CreateProposal(crate::governance::state::ProposalParams),
    UpdateProposal(crate::governance::state::ProposalParams),
    VoteProposal(crate::governance::state::VoteType),
}

#[derive(BorshSerialize, BorshDeserialize)]
pub enum CommunityInstruction {
    CreateCommunity(crate::community::state::CommunityParams),
    UpdateCommunity(crate::community::state::CommunityParams),
    SuspendCommunity,
}

#[derive(BorshSerialize, BorshDeserialize)]
pub enum LendingInstruction {
    InitLendingPool(crate::lending::state::LendingPoolParams),
    CreateLoan(crate::lending::state::LoanParams),
    RepayLoan,
}

#[derive(BorshSerialize, BorshDeserialize)]
pub enum TokenizationInstruction {
    CreateToken(crate::tokenization::state::TokenParams),
    TransferTokens(u64),
    BurnTokens(u64),
}