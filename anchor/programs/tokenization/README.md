# Property Tokenization Program

This program implements a Solana-based tokenization system for real estate and other assets using Anchor framework.

## Overview

The program allows for:
1. Creating tokenized projects for various asset types
2. Managing project status and lifecycle
3. Handling investments and token distribution
4. Tracking project metrics and fees

## Program Structure

### Core Components

1. **TokenizationProject**: The main account that stores all project details
2. **TokenizationParams**: Parameters required to initialize a new project
3. **TokenizedAssetType**: Enum defining supported asset types
4. **TokenizationStatus**: Enum tracking project lifecycle stages
5. **RiskLevel**: Enum defining risk categories
6. **TokenizationFees**: Structure for various fee types

### Key Instructions

1. **initialize_tokenization_project**: Creates a new tokenization project
2. **update_tokenization_status**: Updates project status (e.g., draft → active)
3. **invest_in_project**: Handles investments and token distribution

## Usage

### Creating a New Project

```typescript
const params = {
  name: "Downtown Office Building",
  description: "Premium office space in central business district",
  assetType: { realEstate: {} },
  targetRaise: new anchor.BN(1000000000), // 1000 SOL
  minimumInvestment: new anchor.BN(10000000), // 0.01 SOL
  tokenPrice: new anchor.BN(1000000), // 0.001 SOL per token
  totalTokens: new anchor.BN(1000000),
  legalStructure: "LLC",
  jurisdiction: "Delaware",
  riskLevel: { low: {} },
  fees: {
    platformFee: new anchor.BN(10000),
    managementFee: new anchor.BN(5000),
    performanceFee: new anchor.BN(20000),
    entryFee: new anchor.BN(1000),
    exitFee: new anchor.BN(1000),
  },
};

await program.methods
  .initializeTokenizationProject(params)
  .accounts({
    project: projectKeypair.publicKey,
    owner: provider.wallet.publicKey,
    systemProgram: anchor.web3.SystemProgram.programId,
  })
  .signers([projectKeypair])
  .rpc();
```

### Updating Project Status

```typescript
await program.methods
  .updateTokenizationStatus({ active: {} })
  .accounts({
    project: projectKeypair.publicKey,
    owner: provider.wallet.publicKey,
  })
  .rpc();
```

### Making an Investment

```typescript
const investmentAmount = new anchor.BN(10000000); // 0.01 SOL

await program.methods
  .investInProject(investmentAmount)
  .accounts({
    project: projectKeypair.publicKey,
    investor: provider.wallet.publicKey,
    tokenMint: tokenMint,
    investorTokenAccount: investorTokenAccount,
    tokenProgram: TOKEN_PROGRAM_ID,
  })
  .rpc();
```

## Security Considerations

1. All state changes require proper authorization
2. Investment amounts are validated against minimum requirements
3. Token minting is controlled by the project authority
4. Arithmetic operations use checked math to prevent overflows

## Testing

Run the test suite with:

```bash
anchor test
```

The test suite covers:
- Project initialization
- Status updates
- Investment processing
- Error handling

## Error Handling

The program includes several error types:
- `Unauthorized`: When non-owners attempt privileged operations
- `InvestmentBelowMinimum`: When investment amount is too low
- `Overflow`: When arithmetic operations exceed limits

## Future Enhancements

1. Add support for vesting schedules
2. Implement dividend distributions
3. Add governance features
4. Support for multiple token types
5. Integration with KYC/AML services 