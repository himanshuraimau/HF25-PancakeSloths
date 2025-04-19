use solana_client::rpc_client::RpcClient;
use solana_sdk::{
    commitment_config::CommitmentConfig,
    instruction::{Instruction, AccountMeta},
    pubkey::Pubkey,
    signature::{Keypair, Signer},
    transaction::Transaction,
    system_instruction,
    system_program,
};
use std::str::FromStr;
use borsh::{BorshSerialize, BorshDeserialize};
use unity_vault::user::state::{UserRole, KycData};
use unity_vault::user::instructions::UserProfileParams;
use unity_vault::{Instruction as ProgramInstruction, UserInstruction};

#[tokio::main]
async fn main() {
    // Program ID (replace with your actual program ID)
    let program_id = Pubkey::from_str("B6CbKbkJWnHo8TyRJhbvETgKvHmn842nT3TJDZCAoYXn").unwrap();

    // Connect to the Solana devnet
    let rpc_url = String::from("http://127.0.0.1:8899");
    let client = RpcClient::new_with_commitment(rpc_url, CommitmentConfig::confirmed());

    // Generate keypairs
    let payer = Keypair::new();
    let user_profile = Keypair::new();

    // Request airdrop
    let airdrop_amount = 1_000_000_000; // 1 SOL
    let signature = client
        .request_airdrop(&payer.pubkey(), airdrop_amount)
        .expect("Failed to request airdrop");

    // Wait for airdrop confirmation
    loop {
        let confirmed = client.confirm_transaction(&signature).unwrap();
        if confirmed {
            break;
        }
    }

    // Create user profile instruction
    let create_profile_params = UserProfileParams {
        full_name: "Test User".to_string(),
        email: "test@example.com".to_string(),
        role: UserRole::User,
    };

    // Calculate minimum rent-exempt balance for the account
    let account_size = 1126; // Size of UserProfile account (1,126 bytes)
    let rent = client.get_minimum_balance_for_rent_exemption(account_size).unwrap();

    // Create the account first
    let create_account_ix = system_instruction::create_account(
        &payer.pubkey(),
        &user_profile.pubkey(),
        rent,
        account_size as u64,
        &program_id,
    );

    // Create the user profile instruction
    let create_profile_ix = Instruction::new_with_borsh(
        program_id,
        &ProgramInstruction::User(UserInstruction::CreateUserProfile(create_profile_params)),
        vec![
            AccountMeta::new(user_profile.pubkey(), false),
            AccountMeta::new(payer.pubkey(), true),
            AccountMeta::new_readonly(system_program::id(), false),
        ],
    );

    // Add both instructions to the transaction
    let mut transaction = Transaction::new_with_payer(
        &[create_account_ix, create_profile_ix],
        Some(&payer.pubkey()),
    );

    // Sign and send the transaction
    transaction.sign(&[&payer, &user_profile], client.get_latest_blockhash().unwrap());
    
    match client.send_and_confirm_transaction(&transaction) {
        Ok(signature) => println!("User Profile Created! Signature: {}", signature),
        Err(err) => eprintln!("Error creating user profile: {}", err),
    }

    // Update user profile
    let update_profile_params = UserProfileParams {
        full_name: "Updated User".to_string(),
        email: "updated@example.com".to_string(),
        role: UserRole::Moderator,
    };

    let update_profile_ix = Instruction::new_with_borsh(
        program_id,
        &ProgramInstruction::User(UserInstruction::UpdateUserProfile(update_profile_params)),
        vec![
            AccountMeta::new(user_profile.pubkey(), false),
            AccountMeta::new(payer.pubkey(), true),
        ],
    );

    let mut update_transaction = Transaction::new_with_payer(
        &[update_profile_ix],
        Some(&payer.pubkey()),
    );

    update_transaction.sign(&[&payer], client.get_latest_blockhash().unwrap());

    match client.send_and_confirm_transaction(&update_transaction) {
        Ok(signature) => println!("User Profile Updated! Signature: {}", signature),
        Err(err) => eprintln!("Error updating user profile: {}", err),
    }

    // Enable two-factor authentication
    let two_factor_ix = Instruction::new_with_borsh(
        program_id,
        &ProgramInstruction::User(UserInstruction::EnableTwoFactor {
            secret: "test_secret".to_string(),
            backup_codes: vec!["code1".to_string(), "code2".to_string()],
        }),
        vec![
            AccountMeta::new(user_profile.pubkey(), false),
            AccountMeta::new(payer.pubkey(), true),
        ],
    );

    let mut two_factor_transaction = Transaction::new_with_payer(
        &[two_factor_ix],
        Some(&payer.pubkey()),
    );

    two_factor_transaction.sign(&[&payer], client.get_latest_blockhash().unwrap());

    match client.send_and_confirm_transaction(&two_factor_transaction) {
        Ok(signature) => println!("Two-Factor Enabled! Signature: {}", signature),
        Err(err) => eprintln!("Error enabling two-factor: {}", err),
    }

    // Verify KYC
    let kyc_data = KycData {
        document_type: "Passport".to_string(),
        document_number: "123456789".to_string(),
        verified_at: 1234567890,
    };

    let verify_kyc_ix = Instruction::new_with_borsh(
        program_id,
        &ProgramInstruction::User(UserInstruction::VerifyKyc(kyc_data)),
        vec![
            AccountMeta::new(user_profile.pubkey(), false),
            AccountMeta::new(payer.pubkey(), true),
        ],
    );

    let mut verify_kyc_transaction = Transaction::new_with_payer(
        &[verify_kyc_ix],
        Some(&payer.pubkey()),
    );

    verify_kyc_transaction.sign(&[&payer], client.get_latest_blockhash().unwrap());

    match client.send_and_confirm_transaction(&verify_kyc_transaction) {
        Ok(signature) => println!("KYC Verified! Signature: {}", signature),
        Err(err) => eprintln!("Error verifying KYC: {}", err),
    }
}