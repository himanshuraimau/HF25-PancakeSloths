# Program Setup and Deployment Plan

## 1. Program ID Generation

### Step 1: Generate Program Keypairs
```bash
# Generate keypairs for each program
solana-keygen new --no-bip39-passphrase -o community-keypair.json
solana-keygen new --no-bip39-passphrase -o lending-keypair.json
solana-keygen new --no-bip39-passphrase -o governance-keypair.json
solana-keygen new --no-bip39-passphrase -o user-keypair.json
solana-keygen new --no-bip39-passphrase -o tokenization-keypair.json
```

### Step 2: Get Public Keys
```bash
# Get public keys for each program
solana-keygen pubkey community-keypair.json
solana-keygen pubkey lending-keypair.json
solana-keygen pubkey governance-keypair.json
solana-keygen pubkey user-keypair.json
solana-keygen pubkey tokenization-keypair.json
```

## 2. Program Configuration

### Step 1: Update Program IDs
Update the `declare_id!` macro in each program's `lib.rs`:

1. Community Program:
```rust
declare_id!("GiEVmbRtjqkLHkUGTqx4KBr7bZ43kMep8Mzs1TvRbcCJ");
```

2. Lending Program:
```rust
declare_id!("5J7J6ReABPxr6ZDoWuokyqwT8M6ehNDQ8fm5GrF9QryK");
```

3. Governance Program:
```rust
declare_id!("BMgw77fmd4FubdeFcZKixH5gnYY76Z11w12hwtqiQ5qU");
```

4. User Management Program:
```rust
declare_id!("598Swc49CxCyKgdqA3LCLSYQu8r6sninckgSeZdisjiP");
```

5. Tokenization Program:
```rust
declare_id!("7JHfrrDpwArkzZ2dXCpSZoDgcHwBLoMdrcWbRBs3gK4w");
```

### Step 2: Update Anchor.toml
Add program configurations to `Anchor.toml`:
```toml
[programs.localnet]
community = "GiEVmbRtjqkLHkUGTqx4KBr7bZ43kMep8Mzs1TvRbcCJ"
lending = "5J7J6ReABPxr6ZDoWuokyqwT8M6ehNDQ8fm5GrF9QryK"
governance = "BMgw77fmd4FubdeFcZKixH5gnYY76Z11w12hwtqiQ5qU"
user = "598Swc49CxCyKgdqA3LCLSYQu8r6sninckgSeZdisjiP"
tokenization = "7JHfrrDpwArkzZ2dXCpSZoDgcHwBLoMdrcWbRBs3gK4w"

[programs.devnet]
community = "GiEVmbRtjqkLHkUGTqx4KBr7bZ43kMep8Mzs1TvRbcCJ"
lending = "5J7J6ReABPxr6ZDoWuokyqwT8M6ehNDQ8fm5GrF9QryK"
governance = "BMgw77fmd4FubdeFcZKixH5gnYY76Z11w12hwtqiQ5qU"
user = "598Swc49CxCyKgdqA3LCLSYQu8r6sninckgSeZdisjiP"
tokenization = "7JHfrrDpwArkzZ2dXCpSZoDgcHwBLoMdrcWbRBs3gK4w"

[programs.mainnet]
community = "GiEVmbRtjqkLHkUGTqx4KBr7bZ43kMep8Mzs1TvRbcCJ"
lending = "5J7J6ReABPxr6ZDoWuokyqwT8M6ehNDQ8fm5GrF9QryK"
governance = "BMgw77fmd4FubdeFcZKixH5gnYY76Z11w12hwtqiQ5qU"
user = "598Swc49CxCyKgdqA3LCLSYQu8r6sninckgSeZdisjiP"
tokenization = "7JHfrrDpwArkzZ2dXCpSZoDgcHwBLoMdrcWbRBs3gK4w"
```

## 3. Build and Deploy

### Step 1: Build Programs
```bash
# Build all programs
anchor build

# Verify build
anchor verify
```

### Step 2: Deploy Programs
```bash
# Deploy to localnet
anchor deploy --provider.cluster localnet

# Deploy to devnet
anchor deploy --provider.cluster devnet

# Deploy to mainnet
anchor deploy --provider.cluster mainnet
```

## 4. Test Setup

### Step 1: Configure Test Environment
```bash
# Set up local validator
solana-test-validator

# Configure Anchor for testing
anchor localnet
```

### Step 2: Run Tests
```bash
# Run all tests
anchor test

# Run specific program tests
anchor test -- --test community
anchor test -- --test lending
anchor test -- --test governance
anchor test -- --test user
anchor test -- --test tokenization
```

## 5. Program Interaction Setup

### Step 1: Update Client Configuration
Update client configuration files with program IDs:
```typescript
// config.ts
export const PROGRAM_IDS = {
  community: "GiEVmbRtjqkLHkUGTqx4KBr7bZ43kMep8Mzs1TvRbcCJ",
  lending: "5J7J6ReABPxr6ZDoWuokyqwT8M6ehNDQ8fm5GrF9QryK",
  governance: "BMgw77fmd4FubdeFcZKixH5gnYY76Z11w12hwtqiQ5qU",
  user: "598Swc49CxCyKgdqA3LCLSYQu8r6sninckgSeZdisjiP",
  tokenization: "7JHfrrDpwArkzZ2dXCpSZoDgcHwBLoMdrcWbRBs3gK4w",
};
```

### Step 2: Update Program Interactions
Update program interaction files to use correct program IDs:
```typescript
// program-interactions.ts
import { PROGRAM_IDS } from './config';

export const getPrograms = (connection: Connection, wallet: Wallet) => ({
  community: new Program(CommunityIDL, PROGRAM_IDS.community, { connection, wallet }),
  lending: new Program(LendingIDL, PROGRAM_IDS.lending, { connection, wallet }),
  governance: new Program(GovernanceIDL, PROGRAM_IDS.governance, { connection, wallet }),
  user: new Program(UserIDL, PROGRAM_IDS.user, { connection, wallet }),
  tokenization: new Program(TokenizationIDL, PROGRAM_IDS.tokenization, { connection, wallet }),
});
```

## 6. Verification and Maintenance

### Step 1: Verify Deployments
```bash
# Verify program deployments
solana program show GiEVmbRtjqkLHkUGTqx4KBr7bZ43kMep8Mzs1TvRbcCJ
solana program show 5J7J6ReABPxr6ZDoWuokyqwT8M6ehNDQ8fm5GrF9QryK
solana program show BMgw77fmd4FubdeFcZKixH5gnYY76Z11w12hwtqiQ5qU
solana program show 598Swc49CxCyKgdqA3LCLSYQu8r6sninckgSeZdisjiP
solana program show 7JHfrrDpwArkzZ2dXCpSZoDgcHwBLoMdrcWbRBs3gK4w

# Check program accounts
solana program show --accounts GiEVmbRtjqkLHkUGTqx4KBr7bZ43kMep8Mzs1TvRbcCJ
solana program show --accounts 5J7J6ReABPxr6ZDoWuokyqwT8M6ehNDQ8fm5GrF9QryK
solana program show --accounts BMgw77fmd4FubdeFcZKixH5gnYY76Z11w12hwtqiQ5qU
solana program show --accounts 598Swc49CxCyKgdqA3LCLSYQu8r6sninckgSeZdisjiP
solana program show --accounts 7JHfrrDpwArkzZ2dXCpSZoDgcHwBLoMdrcWbRBs3gK4w
```

### Step 2: Monitor Programs
```bash
# Monitor program logs
solana logs GiEVmbRtjqkLHkUGTqx4KBr7bZ43kMep8Mzs1TvRbcCJ
solana logs 5J7J6ReABPxr6ZDoWuokyqwT8M6ehNDQ8fm5GrF9QryK
solana logs BMgw77fmd4FubdeFcZKixH5gnYY76Z11w12hwtqiQ5qU
solana logs 598Swc49CxCyKgdqA3LCLSYQu8r6sninckgSeZdisjiP
solana logs 7JHfrrDpwArkzZ2dXCpSZoDgcHwBLoMdrcWbRBs3gK4w

# Check program status
solana program show --programs
```

## 7. Security Considerations

1. Store program keypairs securely
2. Use different keypairs for different environments
3. Implement proper access controls
4. Monitor program usage and activity
5. Regular security audits

## 8. Backup and Recovery

1. Backup program keypairs
2. Document deployment process
3. Maintain recovery procedures
4. Keep deployment records
5. Version control all configurations

## Notes

- All program IDs have been updated with actual values
- Keep program keypairs secure and backed up
- Test thoroughly in devnet before mainnet deployment
- Monitor program performance and usage
- Regular updates and maintenance required 