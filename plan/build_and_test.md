# Building and Testing Programs

## 1. Environment Setup

### Step 1: Install Dependencies
```bash
# Install Anchor CLI if not already installed
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
avm install latest
avm use latest

# Install Solana CLI if not already installed
sh -c "$(curl -sSfL https://release.solana.com/v1.17.0/install)"

# Install Node.js dependencies
npm install
```

### Step 2: Configure Local Environment
```bash
# Start local validator
solana-test-validator

# Configure Anchor for local development
anchor localnet

# Set Solana config to local
solana config set --url localhost
```

## 2. Building Programs

### Step 1: Build All Programs
```bash
# Build all programs
anchor build

# Verify the build
anchor verify
```

### Step 2: Build Individual Programs
```bash
# Build Community Program
anchor build -p community

# Build Lending Program
anchor build -p lending

# Build Governance Program
anchor build -p governance

# Build User Program
anchor build -p user

# Build Tokenization Program
anchor build -p tokenization
```

## 3. Testing Programs

### Step 1: Run All Tests
```bash
# Run all tests
anchor test
```

### Step 2: Test Individual Programs

#### Community Program Tests
```bash
# Run all community tests
anchor test -- --test community

# Run specific community test
anchor test -- --test community -- --test "test_create_community"
```

#### Lending Program Tests
```bash
# Run all lending tests
anchor test -- --test lending

# Run specific lending test
anchor test -- --test lending -- --test "test_create_loan_pool"
```

#### Governance Program Tests
```bash
# Run all governance tests
anchor test -- --test governance

# Run specific governance test
anchor test -- --test governance -- --test "test_create_proposal"
```

#### User Program Tests
```bash
# Run all user tests
anchor test -- --test user

# Run specific user test
anchor test -- --test user -- --test "test_create_user_profile"
```

#### Tokenization Program Tests
```bash
# Run all tokenization tests
anchor test -- --test tokenization

# Run specific tokenization test
anchor test -- --test tokenization -- --test "test_initialize_tokenization_project"
```

## 4. Testing on Different Networks

### Local Network
```bash
# Start local validator
solana-test-validator

# Run tests on local network
anchor test -- --network localhost
```

### Devnet
```bash
# Switch to devnet
solana config set --url devnet

# Run tests on devnet
anchor test -- --network devnet
```

### Mainnet
```bash
# Switch to mainnet
solana config set --url mainnet-beta

# Run tests on mainnet
anchor test -- --network mainnet-beta
```

## 5. Debugging Tests

### Enable Debug Logging
```bash
# Run tests with debug logging
RUST_LOG=debug anchor test
```

### View Program Logs
```bash
# View logs for specific program
solana logs <PROGRAM_ID>

# View all program logs
solana logs
```

## 6. Common Issues and Solutions

### Build Issues
1. If build fails with "Program ID mismatch":
   ```bash
   # Clean build artifacts
   anchor clean
   
   # Rebuild
   anchor build
   ```

2. If build fails with "Account not found":
   ```bash
   # Reset local validator
   solana-test-validator --reset
   ```

### Test Issues
1. If tests fail with "Account not found":
   ```bash
   # Reset local validator
   solana-test-validator --reset
   
   # Run tests again
   anchor test
   ```

2. If tests fail with "Insufficient funds":
   ```bash
   # Airdrop SOL to test wallet
   solana airdrop 2
   ```

## 7. Best Practices

1. Always run tests on local network first
2. Test each program individually before running all tests
3. Use specific test cases for debugging
4. Keep test data consistent
5. Document test results
6. Clean up test accounts after testing

## 8. Test Coverage

To check test coverage:
```bash
# Install coverage tool
cargo install cargo-tarpaulin

# Run coverage for specific program
cargo tarpaulin -p community
cargo tarpaulin -p lending
cargo tarpaulin -p governance
cargo tarpaulin -p user
cargo tarpaulin -p tokenization
```

## Notes

- Always run tests in a clean environment
- Keep test data separate from production data
- Document any test failures
- Update tests when program logic changes
- Maintain test coverage above 80% 