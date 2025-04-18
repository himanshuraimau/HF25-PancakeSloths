import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { Community } from "../target/types/community";
import { assert } from "chai";

describe("community", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Community as Program<Community>;
  
  let communityKeypair: anchor.web3.Keypair;
  let membershipKeypair: anchor.web3.Keypair;
  let postKeypair: anchor.web3.Keypair;
  let commentKeypair: anchor.web3.Keypair;
  let likeKeypair: anchor.web3.Keypair;

  before(async () => {
    // Create keypairs for all accounts
    communityKeypair = anchor.web3.Keypair.generate();
    membershipKeypair = anchor.web3.Keypair.generate();
    postKeypair = anchor.web3.Keypair.generate();
    commentKeypair = anchor.web3.Keypair.generate();
    likeKeypair = anchor.web3.Keypair.generate();
  });

  it("Creates a community", async () => {
    const params = {
      name: "Investment Community",
      description: "A community for real estate investors",
      category: { investment: {} },
      rules: ["Be respectful", "No spam"],
      tags: ["real-estate", "investment"],
    };

    await program.methods
      .createCommunity(params)
      .accounts({
        community: communityKeypair.publicKey,
        creator: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([communityKeypair])
      .rpc();

    const community = await program.account.community.fetch(communityKeypair.publicKey);
    
    assert.equal(community.name, "Investment Community");
    assert.equal(community.category, { investment: {} });
    assert.equal(community.status, { active: {} });
    assert.equal(community.memberCount.toString(), "0");
    assert.equal(community.postCount.toString(), "0");
  });

  it("Joins a community", async () => {
    await program.methods
      .joinCommunity()
      .accounts({
        community: communityKeypair.publicKey,
        membership: membershipKeypair.publicKey,
        member: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([membershipKeypair])
      .rpc();

    const membership = await program.account.membership.fetch(membershipKeypair.publicKey);
    const community = await program.account.community.fetch(communityKeypair.publicKey);
    
    assert.equal(membership.community.toString(), communityKeypair.publicKey.toString());
    assert.equal(membership.role, { member: {} });
    assert.equal(community.memberCount.toString(), "1");
  });

  it("Creates a post", async () => {
    const params = {
      title: "Market Analysis Q1 2024",
      content: "Detailed analysis of the real estate market trends...",
      category: { discussion: {} },
    };

    await program.methods
      .createPost(params)
      .accounts({
        post: postKeypair.publicKey,
        community: communityKeypair.publicKey,
        author: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([postKeypair])
      .rpc();

    const post = await program.account.post.fetch(postKeypair.publicKey);
    const community = await program.account.community.fetch(communityKeypair.publicKey);
    
    assert.equal(post.title, "Market Analysis Q1 2024");
    assert.equal(post.category, { discussion: {} });
    assert.equal(post.status, { active: {} });
    assert.equal(post.likeCount.toString(), "0");
    assert.equal(post.commentCount.toString(), "0");
    assert.equal(community.postCount.toString(), "1");
  });

  it("Creates a comment", async () => {
    const params = {
      content: "Great analysis! I agree with your points.",
    };

    await program.methods
      .createComment(params)
      .accounts({
        comment: commentKeypair.publicKey,
        post: postKeypair.publicKey,
        author: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([commentKeypair])
      .rpc();

    const comment = await program.account.comment.fetch(commentKeypair.publicKey);
    const post = await program.account.post.fetch(postKeypair.publicKey);
    
    assert.equal(comment.content, "Great analysis! I agree with your points.");
    assert.equal(comment.status, { active: {} });
    assert.equal(post.commentCount.toString(), "1");
  });

  it("Likes a post", async () => {
    await program.methods
      .likePost()
      .accounts({
        like: likeKeypair.publicKey,
        post: postKeypair.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([likeKeypair])
      .rpc();

    const like = await program.account.like.fetch(likeKeypair.publicKey);
    const post = await program.account.post.fetch(postKeypair.publicKey);
    
    assert.equal(like.post.toString(), postKeypair.publicKey.toString());
    assert.equal(post.likeCount.toString(), "1");
  });
}); 