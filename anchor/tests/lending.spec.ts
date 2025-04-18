import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { Lending } from '../target/types/lending'
import { assert } from 'chai'
import { TOKEN_PROGRAM_ID, createMint, createAssociatedTokenAccount, mintTo } from '@solana/spl-token'

describe('lending', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)

  const program = anchor.workspace.Lending as Program<Lending>
  
  let loanPoolKeypair: anchor.web3.Keypair
  let loanKeypair: anchor.web3.Keypair
  let collateralMint: anchor.web3.PublicKey
  let borrowerCollateralAccount: anchor.web3.PublicKey
  let loanPoolCollateralAccount: anchor.web3.PublicKey

  before(async () => {
    // Create keypairs for accounts
    loanPoolKeypair = anchor.web3.Keypair.generate()
    loanKeypair = anchor.web3.Keypair.generate()

    // Create collateral token mint
    collateralMint = await createMint(
      provider.connection,
      provider.wallet.payer,
      provider.wallet.publicKey,
      null,
      6
    )

    // Create token accounts
    borrowerCollateralAccount = await createAssociatedTokenAccount(
      provider.connection,
      provider.wallet.payer,
      collateralMint,
      provider.wallet.publicKey
    )

    loanPoolCollateralAccount = await createAssociatedTokenAccount(
      provider.connection,
      provider.wallet.payer,
      collateralMint,
      loanPoolKeypair.publicKey,
      true
    )

    // Mint some collateral tokens to borrower
    await mintTo(
      provider.connection,
      provider.wallet.payer,
      collateralMint,
      borrowerCollateralAccount,
      provider.wallet.publicKey,
      1000000000 // 1000 tokens with 6 decimals
    )
  })

  it('Creates a loan pool', async () => {
    const params = {
      name: 'Real Estate Loan Pool',
      description: 'Pool for real estate backed loans',
      assetType: { realEstate: {} },
      interestRate: new anchor.BN(10), // 10%
      maxLoanAmount: new anchor.BN(1000000000), // 1000 tokens
      minLoanAmount: new anchor.BN(100000000), // 100 tokens
      loanTerm: new anchor.BN(365), // 365 days
      collateralRatio: new anchor.BN(150), // 150%
    }

    await program.methods
      .createLoanPool(params)
      .accounts({
        loanPool: loanPoolKeypair.publicKey,
        creator: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([loanPoolKeypair])
      .rpc()

    const loanPool = await program.account.loanPool.fetch(loanPoolKeypair.publicKey)
    
    assert.equal(loanPool.name, 'Real Estate Loan Pool')
    assert.equal(loanPool.assetType, { realEstate: {} })
    assert.equal(loanPool.status, { active: {} })
    assert.equal(loanPool.interestRate.toString(), '10')
    assert.equal(loanPool.totalAvailable.toString(), '1000000000')
  })

  it('Requests a loan', async () => {
    const params = {
      amount: new anchor.BN(500000000), // 500 tokens
    }

    await program.methods
      .requestLoan(params)
      .accounts({
        loan: loanKeypair.publicKey,
        loanPool: loanPoolKeypair.publicKey,
        borrower: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([loanKeypair])
      .rpc()

    const loan = await program.account.loan.fetch(loanKeypair.publicKey)
    const loanPool = await program.account.loanPool.fetch(loanPoolKeypair.publicKey)
    
    assert.equal(loan.amount.toString(), '500000000')
    assert.equal(loan.status, { pending: {} })
    assert.equal(loanPool.totalAvailable.toString(), '500000000') // Reduced by loan amount
  })

  it('Approves a loan', async () => {
    await program.methods
      .approveLoan()
      .accounts({
        loan: loanKeypair.publicKey,
        loanPool: loanPoolKeypair.publicKey,
        borrower: provider.wallet.publicKey,
        borrowerCollateralAccount,
        loanPoolCollateralAccount,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .rpc()

    const loan = await program.account.loan.fetch(loanKeypair.publicKey)
    const loanPool = await program.account.loanPool.fetch(loanPoolKeypair.publicKey)
    
    assert.equal(loan.status, { active: {} })
    assert.isNotNull(loan.approvedAt)
    assert.equal(loanPool.totalLoans.toString(), '1')
    assert.equal(loanPool.totalBorrowed.toString(), '500000000')
  })

  it('Makes a loan payment', async () => {
    const paymentAmount = new anchor.BN(100000000) // 100 tokens

    await program.methods
      .makePayment(paymentAmount)
      .accounts({
        loan: loanKeypair.publicKey,
        borrower: provider.wallet.publicKey,
        loanPoolCollateralAccount,
        borrowerCollateralAccount,
        loanPoolAuthority: loanPoolKeypair.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .rpc()

    const loan = await program.account.loan.fetch(loanKeypair.publicKey)
    
    assert.equal(loan.remainingAmount.toString(), '400000000') // 500 - 100
  })

  it('Fails to request loan with invalid amount', async () => {
    const params = {
      amount: new anchor.BN(2000000000), // 2000 tokens (exceeds max)
    }

    try {
      await program.methods
        .requestLoan(params)
        .accounts({
          loan: anchor.web3.Keypair.generate().publicKey,
          loanPool: loanPoolKeypair.publicKey,
          borrower: provider.wallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc()
      assert.fail('Should have failed with invalid loan amount')
    } catch (err) {
      assert.include(err.message, 'Invalid loan amount')
    }
  })

  it('Fails to approve loan with insufficient collateral', async () => {
    // Create a new loan request
    const newLoanKeypair = anchor.web3.Keypair.generate()
    const params = {
      amount: new anchor.BN(1000000000), // 1000 tokens
    }

    await program.methods
      .requestLoan(params)
      .accounts({
        loan: newLoanKeypair.publicKey,
        loanPool: loanPoolKeypair.publicKey,
        borrower: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([newLoanKeypair])
      .rpc()

    try {
      await program.methods
        .approveLoan()
        .accounts({
          loan: newLoanKeypair.publicKey,
          loanPool: loanPoolKeypair.publicKey,
          borrower: provider.wallet.publicKey,
          borrowerCollateralAccount,
          loanPoolCollateralAccount,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .rpc()
      assert.fail('Should have failed with insufficient collateral')
    } catch (err) {
      assert.include(err.message, 'Insufficient funds')
    }
  })
}) 