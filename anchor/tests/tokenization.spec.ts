import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { Tokenization } from '../target/types/tokenization'
import { assert } from 'chai'
import { TOKEN_PROGRAM_ID, createMint, createAssociatedTokenAccount, mintTo } from '@solana/spl-token'

describe('tokenization', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)

  const program = anchor.workspace.Tokenization as Program<Tokenization>
  
  let projectKeypair: anchor.web3.Keypair
  let tokenMint: anchor.web3.PublicKey
  let investorTokenAccount: anchor.web3.PublicKey

  before(async () => {
    // Create keypairs for accounts
    projectKeypair = anchor.web3.Keypair.generate()

    // Create token mint
    tokenMint = await createMint(
      provider.connection,
      provider.wallet.payer,
      provider.wallet.publicKey,
      null,
      6
    )

    // Create investor token account
    investorTokenAccount = await createAssociatedTokenAccount(
      provider.connection,
      provider.wallet.payer,
      tokenMint,
      provider.wallet.publicKey
    )
  })

  it('Initializes a tokenization project', async () => {
    const params = {
      name: 'Real Estate Tokenization',
      description: 'Tokenization of a commercial property in New York',
      assetType: { realEstate: {} },
      targetRaise: new anchor.BN(1000000000), // 1000 tokens
      minimumInvestment: new anchor.BN(10000000), // 10 tokens
      tokenPrice: new anchor.BN(1000000), // 1 token
      totalTokens: new anchor.BN(1000000000), // 1000 tokens
      legalStructure: 'LLC',
      jurisdiction: 'US',
      riskLevel: { medium: {} },
      fees: {
        platformFee: new anchor.BN(10000), // 1%
        managementFee: new anchor.BN(20000), // 2%
        performanceFee: new anchor.BN(30000), // 3%
        entryFee: new anchor.BN(5000), // 0.5%
        exitFee: new anchor.BN(5000), // 0.5%
      },
    }

    await program.methods
      .initializeTokenizationProject(params)
      .accounts({
        project: projectKeypair.publicKey,
        owner: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([projectKeypair])
      .rpc()

    const project = await program.account.tokenizationProject.fetch(projectKeypair.publicKey)
    
    assert.equal(project.name, 'Real Estate Tokenization')
    assert.equal(project.assetType, { realEstate: {} })
    assert.equal(project.status, { draft: {} })
    assert.equal(project.targetRaise.toString(), '1000000000')
    assert.equal(project.minimumInvestment.toString(), '10000000')
    assert.equal(project.tokenPrice.toString(), '1000000')
    assert.equal(project.totalTokens.toString(), '1000000000')
    assert.equal(project.soldTokens.toString(), '0')
  })

  it('Updates project status', async () => {
    await program.methods
      .updateTokenizationStatus({ active: {} })
      .accounts({
        project: projectKeypair.publicKey,
        owner: provider.wallet.publicKey,
      })
      .rpc()

    const project = await program.account.tokenizationProject.fetch(projectKeypair.publicKey)
    assert.equal(project.status, { active: {} })
  })

  it('Invests in project', async () => {
    const investmentAmount = new anchor.BN(20000000) // 20 tokens worth

    await program.methods
      .investInProject(investmentAmount)
      .accounts({
        project: projectKeypair.publicKey,
        investor: provider.wallet.publicKey,
        tokenMint,
        investorTokenAccount,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .rpc()

    const project = await program.account.tokenizationProject.fetch(projectKeypair.publicKey)
    
    // Calculate expected tokens (20 tokens worth / 1 token price = 20 tokens)
    assert.equal(project.soldTokens.toString(), '20')
  })

  it('Fails to invest below minimum amount', async () => {
    const investmentAmount = new anchor.BN(5000000) // 5 tokens worth (below minimum)

    try {
      await program.methods
        .investInProject(investmentAmount)
        .accounts({
          project: projectKeypair.publicKey,
          investor: provider.wallet.publicKey,
          tokenMint,
          investorTokenAccount,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .rpc()
      assert.fail('Should have failed with investment below minimum')
    } catch (err) {
      assert.include(err.message, 'Investment amount below minimum')
    }
  })

  it('Fails to update status without authorization', async () => {
    const unauthorizedKeypair = anchor.web3.Keypair.generate()

    try {
      await program.methods
        .updateTokenizationStatus({ approved: {} })
        .accounts({
          project: projectKeypair.publicKey,
          owner: unauthorizedKeypair.publicKey,
        })
        .signers([unauthorizedKeypair])
        .rpc()
      assert.fail('Should have failed with unauthorized access')
    } catch (err) {
      assert.include(err.message, 'Unauthorized access')
    }
  })

  it('Fails to invest in draft project', async () => {
    // Create a new project in draft status
    const newProjectKeypair = anchor.web3.Keypair.generate()
    const params = {
      name: 'New Project',
      description: 'Test project',
      assetType: { realEstate: {} },
      targetRaise: new anchor.BN(1000000000),
      minimumInvestment: new anchor.BN(10000000),
      tokenPrice: new anchor.BN(1000000),
      totalTokens: new anchor.BN(1000000000),
      legalStructure: 'LLC',
      jurisdiction: 'US',
      riskLevel: { medium: {} },
      fees: {
        platformFee: new anchor.BN(10000),
        managementFee: new anchor.BN(20000),
        performanceFee: new anchor.BN(30000),
        entryFee: new anchor.BN(5000),
        exitFee: new anchor.BN(5000),
      },
    }

    await program.methods
      .initializeTokenizationProject(params)
      .accounts({
        project: newProjectKeypair.publicKey,
        owner: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([newProjectKeypair])
      .rpc()

    try {
      await program.methods
        .investInProject(new anchor.BN(20000000))
        .accounts({
          project: newProjectKeypair.publicKey,
          investor: provider.wallet.publicKey,
          tokenMint,
          investorTokenAccount,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .rpc()
      assert.fail('Should have failed with project in draft status')
    } catch (err) {
      assert.include(err.message, 'Project is not active')
    }
  })
}) 