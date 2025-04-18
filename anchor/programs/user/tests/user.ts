import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { UserManagement } from "../target/types/user_management";
import { assert } from "chai";

describe("user_management", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.UserManagement as Program<UserManagement>;
  
  let userProfileKeypair: anchor.web3.Keypair;

  before(async () => {
    userProfileKeypair = anchor.web3.Keypair.generate();
  });

  it("Creates a user profile", async () => {
    const params = {
      fullName: "John Doe",
      email: "john@example.com",
      role: { user: {} },
    };

    await program.methods
      .createUserProfile(params)
      .accounts({
        userProfile: userProfileKeypair.publicKey,
        owner: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([userProfileKeypair])
      .rpc();

    const userProfile = await program.account.userProfile.fetch(userProfileKeypair.publicKey);
    
    assert.equal(userProfile.fullName, "John Doe");
    assert.equal(userProfile.email, "john@example.com");
    assert.equal(userProfile.role, { user: {} });
    assert.equal(userProfile.status, { active: {} });
    assert.equal(userProfile.kycStatus, { pending: {} });
    assert.equal(userProfile.accreditedStatus, false);
    assert.equal(userProfile.twoFactorEnabled, false);
  });

  it("Updates user profile", async () => {
    const params = {
      fullName: "John Smith",
      role: { investor: {} },
      status: { active: {} },
    };

    await program.methods
      .updateUserProfile(params)
      .accounts({
        userProfile: userProfileKeypair.publicKey,
        owner: provider.wallet.publicKey,
      })
      .rpc();

    const userProfile = await program.account.userProfile.fetch(userProfileKeypair.publicKey);
    assert.equal(userProfile.fullName, "John Smith");
    assert.equal(userProfile.role, { investor: {} });
  });

  it("Enables two-factor authentication", async () => {
    const secret = "JBSWY3DPEHPK3PXP";
    const backupCodes = ["123456", "654321", "987654"];

    await program.methods
      .enableTwoFactor(secret, backupCodes)
      .accounts({
        userProfile: userProfileKeypair.publicKey,
        owner: provider.wallet.publicKey,
      })
      .rpc();

    const userProfile = await program.account.userProfile.fetch(userProfileKeypair.publicKey);
    assert.equal(userProfile.twoFactorEnabled, true);
    assert.equal(userProfile.twoFactorSecret, secret);
    assert.deepEqual(userProfile.twoFactorBackupCodes, backupCodes);
  });

  it("Verifies KYC", async () => {
    const kycData = {
      documentType: "PASSPORT",
      documentNumber: "ABC123456",
      country: "US",
      verifiedBy: "KYC Authority",
      verificationDate: Math.floor(Date.now() / 1000),
    };

    // Create a KYC authority keypair
    const kycAuthority = anchor.web3.Keypair.generate();

    await program.methods
      .verifyKyc(kycData)
      .accounts({
        userProfile: userProfileKeypair.publicKey,
        kycAuthority: kycAuthority.publicKey,
        verifier: kycAuthority.publicKey,
      })
      .signers([kycAuthority])
      .rpc();

    const userProfile = await program.account.userProfile.fetch(userProfileKeypair.publicKey);
    assert.equal(userProfile.kycStatus, { verified: {} });
    assert.deepEqual(userProfile.kycData, kycData);
  });
}); 