import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { Tokenization } from "../target/types/tokenization";
import { TOKEN_PROGRAM_ID, createMint, createAssociatedTokenAccount, mintTo } from "@solana/spl-token";
import { assert } from "chai";

describe("tokenization", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Tokenization as Program<Tokenization>;
  
  let projectKeypair: anchor.web3.Keypair;
  let tokenMint: anchor.web3.PublicKey;
  let investorTokenAccount: anchor.web3.PublicKey;

  before(async () => {
    // Create project keypair
    projectKeypair = anchor.web3.Keypair.generate();
    
    // Create token mint
    tokenMint = await createMint(
      provider.connection,
      provider.wallet.payer,
      provider.wallet.publicKey,
      null,
      9
    );
    
    // Create investor token account
    investorTokenAccount = await createAssociatedTokenAccount(
      provider.connection,
      provider.wallet.payer,
      tokenMint,
      provider.wallet.publicKey
    );
  });

  it("Initializes tokenization project", async () => {
    const params = {
      name: "Test Property",
      description: "A beautiful property in downtown",
      assetType: { realEstate: {} },
      targetRaise: new anchor.BN(1000000000), // 1000 SOL
      minimumInvestment: new anchor.BN(10000000), // 0.01 SOL
      tokenPrice: new anchor.BN(1000000), // 0.001 SOL
      totalTokens: new anchor.BN(1000000),
      legalStructure: "LLC",
      jurisdiction: "Delaware",
      riskLevel: { low: {} },
      fees: {
        platformFee: new anchor.BN(10000), // 0.00001 SOL
        managementFee: new anchor.BN(5000), // 0.000005 SOL
        performanceFee: new anchor.BN(20000), // 0.00002 SOL
        entryFee: new anchor.BN(1000), // 0.000001 SOL
        exitFee: new anchor.BN(1000), // 0.000001 SOL
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

    const project = await program.account.tokenizationProject.fetch(projectKeypair.publicKey);
    
    assert.equal(project.name, "Test Property");
    assert.equal(project.status, { draft: {} });
    assert.equal(project.owner.toString(), provider.wallet.publicKey.toString());
  });

  it("Updates project status", async () => {
    await program.methods
      .updateTokenizationStatus({ active: {} })
      .accounts({
        project: projectKeypair.publicKey,
        owner: provider.wallet.publicKey,
      })
      .rpc();

    const project = await program.account.tokenizationProject.fetch(projectKeypair.publicKey);
    assert.equal(project.status, { active: {} });
  });

  it("Allows investment in project", async () => {
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

    const project = await program.account.tokenizationProject.fetch(projectKeypair.publicKey);
    assert.equal(project.soldTokens.toString(), "10"); // 0.01 SOL / 0.001 SOL per token
  });
}); 