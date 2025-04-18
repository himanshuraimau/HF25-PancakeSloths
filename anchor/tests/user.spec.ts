import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { UserManagement } from '../target/types/user_management'
import { assert } from 'chai'

describe('user_management', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)

  const program = anchor.workspace.UserManagement as Program<UserManagement>
  
  let userProfileKeypair: anchor.web3.Keypair
  let kycAuthorityKeypair: anchor.web3.Keypair

  before(async () => {
    // Create keypairs for accounts
    userProfileKeypair = anchor.web3.Keypair.generate()
    kycAuthorityKeypair = anchor.web3.Keypair.generate()
  })

  it('Creates a user profile', async () => {
    const params = {
      fullName: 'John Doe',
      email: 'john.doe@example.com',
      role: { investor: {} },
    }

    await program.methods
      .createUserProfile(params)
      .accounts({
        userProfile: userProfileKeypair.publicKey,
        owner: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([userProfileKeypair])
      .rpc()

    const userProfile = await program.account.userProfile.fetch(userProfileKeypair.publicKey)
    
    assert.equal(userProfile.fullName, 'John Doe')
    assert.equal(userProfile.email, 'john.doe@example.com')
    assert.equal(userProfile.role, { investor: {} })
    assert.equal(userProfile.status, { active: {} })
    assert.equal(userProfile.kycStatus, { pending: {} })
    assert.isFalse(userProfile.accreditedStatus)
    assert.isFalse(userProfile.twoFactorEnabled)
  })

  it('Updates user profile', async () => {
    const params = {
      fullName: 'John Smith',
      role: { admin: {} },
      status: { inactive: {} },
    }

    await program.methods
      .updateUserProfile(params)
      .accounts({
        userProfile: userProfileKeypair.publicKey,
        owner: provider.wallet.publicKey,
      })
      .rpc()

    const userProfile = await program.account.userProfile.fetch(userProfileKeypair.publicKey)
    
    assert.equal(userProfile.fullName, 'John Smith')
    assert.equal(userProfile.role, { admin: {} })
    assert.equal(userProfile.status, { inactive: {} })
  })

  it('Enables two-factor authentication', async () => {
    const secret = '2FA_SECRET_KEY'
    const backupCodes = ['CODE1', 'CODE2', 'CODE3']

    await program.methods
      .enableTwoFactor(secret, backupCodes)
      .accounts({
        userProfile: userProfileKeypair.publicKey,
        owner: provider.wallet.publicKey,
      })
      .rpc()

    const userProfile = await program.account.userProfile.fetch(userProfileKeypair.publicKey)
    
    assert.isTrue(userProfile.twoFactorEnabled)
    assert.equal(userProfile.twoFactorSecret, secret)
    assert.deepEqual(userProfile.twoFactorBackupCodes, backupCodes)
  })

  it('Verifies KYC', async () => {
    const kycData = {
      documentType: 'PASSPORT',
      documentNumber: 'P12345678',
      country: 'US',
      verifiedBy: 'KYC_VERIFIER',
      verificationDate: new anchor.BN(Math.floor(Date.now() / 1000)),
    }

    await program.methods
      .verifyKyc(kycData)
      .accounts({
        userProfile: userProfileKeypair.publicKey,
        kycAuthority: kycAuthorityKeypair.publicKey,
        verifier: provider.wallet.publicKey,
      })
      .rpc()

    const userProfile = await program.account.userProfile.fetch(userProfileKeypair.publicKey)
    
    assert.equal(userProfile.kycStatus, { verified: {} })
    assert.isNotNull(userProfile.kycData)
    assert.isNotNull(userProfile.kycVerifiedAt)
  })

  it('Fails to update profile without authorization', async () => {
    const params = {
      fullName: 'Unauthorized Update',
      role: { user: {} },
      status: { active: {} },
    }

    try {
      await program.methods
        .updateUserProfile(params)
        .accounts({
          userProfile: userProfileKeypair.publicKey,
          owner: kycAuthorityKeypair.publicKey,
        })
        .signers([kycAuthorityKeypair])
        .rpc()
      assert.fail('Should have failed with unauthorized access')
    } catch (err) {
      assert.include(err.message, 'Unauthorized access')
    }
  })

  it('Fails to enable 2FA without authorization', async () => {
    try {
      await program.methods
        .enableTwoFactor('NEW_SECRET', ['NEW_CODE'])
        .accounts({
          userProfile: userProfileKeypair.publicKey,
          owner: kycAuthorityKeypair.publicKey,
        })
        .signers([kycAuthorityKeypair])
        .rpc()
      assert.fail('Should have failed with unauthorized access')
    } catch (err) {
      assert.include(err.message, 'Unauthorized access')
    }
  })

  it('Fails to verify KYC with wrong authority', async () => {
    const kycData = {
      documentType: 'PASSPORT',
      documentNumber: 'P12345678',
      country: 'US',
      verifiedBy: 'KYC_VERIFIER',
      verificationDate: new anchor.BN(Math.floor(Date.now() / 1000)),
    }

    try {
      await program.methods
        .verifyKyc(kycData)
        .accounts({
          userProfile: userProfileKeypair.publicKey,
          kycAuthority: userProfileKeypair.publicKey,
          verifier: provider.wallet.publicKey,
        })
        .rpc()
      assert.fail('Should have failed with unauthorized access')
    } catch (err) {
      assert.include(err.message, 'Unauthorized access')
    }
  })
}) 