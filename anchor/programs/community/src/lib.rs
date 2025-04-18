use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount};

declare_id!("GiEVmbRtjqkLHkUGTqx4KBr7bZ43kMep8Mzs1TvRbcCJ");

#[program]
pub mod community {
    use super::*;

    pub fn create_community(
        ctx: Context<CreateCommunity>,
        params: CommunityParams,
    ) -> Result<()> {
        let community = &mut ctx.accounts.community;
        
        // Initialize community
        community.creator = ctx.accounts.creator.key();
        community.name = params.name;
        community.description = params.description;
        community.category = params.category;
        community.status = CommunityStatus::Active;
        community.member_count = 0;
        community.post_count = 0;
        community.created_at = Clock::get()?.unix_timestamp;
        community.updated_at = Clock::get()?.unix_timestamp;
        community.rules = params.rules;
        community.tags = params.tags;

        Ok(())
    }

    pub fn join_community(
        ctx: Context<JoinCommunity>,
    ) -> Result<()> {
        let community = &mut ctx.accounts.community;
        let membership = &mut ctx.accounts.membership;
        
        // Initialize membership
        membership.community = community.key();
        membership.member = ctx.accounts.member.key();
        membership.role = MemberRole::Member;
        membership.joined_at = Clock::get()?.unix_timestamp;
        membership.updated_at = Clock::get()?.unix_timestamp;
        
        // Update community stats
        community.member_count = community.member_count.checked_add(1)
            .ok_or(CommunityError::Overflow)?;
        
        Ok(())
    }

    pub fn create_post(
        ctx: Context<CreatePost>,
        params: PostParams,
    ) -> Result<()> {
        let post = &mut ctx.accounts.post;
        let community = &mut ctx.accounts.community;
        
        // Initialize post
        post.author = ctx.accounts.author.key();
        post.community = community.key();
        post.title = params.title;
        post.content = params.content;
        post.category = params.category;
        post.status = PostStatus::Active;
        post.like_count = 0;
        post.comment_count = 0;
        post.created_at = Clock::get()?.unix_timestamp;
        post.updated_at = Clock::get()?.unix_timestamp;
        
        // Update community stats
        community.post_count = community.post_count.checked_add(1)
            .ok_or(CommunityError::Overflow)?;
        
        Ok(())
    }

    pub fn create_comment(
        ctx: Context<CreateComment>,
        params: CommentParams,
    ) -> Result<()> {
        let comment = &mut ctx.accounts.comment;
        let post = &mut ctx.accounts.post;
        
        // Initialize comment
        comment.author = ctx.accounts.author.key();
        comment.post = post.key();
        comment.content = params.content;
        comment.status = CommentStatus::Active;
        comment.created_at = Clock::get()?.unix_timestamp;
        comment.updated_at = Clock::get()?.unix_timestamp;
        
        // Update post stats
        post.comment_count = post.comment_count.checked_add(1)
            .ok_or(CommunityError::Overflow)?;
        
        Ok(())
    }

    pub fn like_post(
        ctx: Context<LikePost>,
    ) -> Result<()> {
        let post = &mut ctx.accounts.post;
        let like = &mut ctx.accounts.like;
        
        // Initialize like
        like.user = ctx.accounts.user.key();
        like.post = post.key();
        like.created_at = Clock::get()?.unix_timestamp;
        
        // Update post stats
        post.like_count = post.like_count.checked_add(1)
            .ok_or(CommunityError::Overflow)?;
        
        Ok(())
    }
}

#[derive(Accounts)]
pub struct CreateCommunity<'info> {
    #[account(
        init,
        payer = creator,
        space = Community::LEN
    )]
    pub community: Account<'info, Community>,
    
    #[account(mut)]
    pub creator: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct JoinCommunity<'info> {
    #[account(mut)]
    pub community: Account<'info, Community>,
    
    #[account(
        init,
        payer = member,
        space = Membership::LEN
    )]
    pub membership: Account<'info, Membership>,
    
    #[account(mut)]
    pub member: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CreatePost<'info> {
    #[account(
        init,
        payer = author,
        space = Post::LEN
    )]
    pub post: Account<'info, Post>,
    
    #[account(mut)]
    pub community: Account<'info, Community>,
    
    #[account(mut)]
    pub author: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CreateComment<'info> {
    #[account(
        init,
        payer = author,
        space = Comment::LEN
    )]
    pub comment: Account<'info, Comment>,
    
    #[account(mut)]
    pub post: Account<'info, Post>,
    
    #[account(mut)]
    pub author: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct LikePost<'info> {
    #[account(
        init,
        payer = user,
        space = Like::LEN
    )]
    pub like: Account<'info, Like>,
    
    #[account(mut)]
    pub post: Account<'info, Post>,
    
    #[account(mut)]
    pub user: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[account]
pub struct Community {
    pub creator: Pubkey,
    pub name: String,
    pub description: String,
    pub category: CommunityCategory,
    pub status: CommunityStatus,
    pub member_count: u64,
    pub post_count: u64,
    pub rules: Vec<String>,
    pub tags: Vec<String>,
    pub created_at: i64,
    pub updated_at: i64,
}

#[account]
pub struct Membership {
    pub community: Pubkey,
    pub member: Pubkey,
    pub role: MemberRole,
    pub joined_at: i64,
    pub updated_at: i64,
}

#[account]
pub struct Post {
    pub author: Pubkey,
    pub community: Pubkey,
    pub title: String,
    pub content: String,
    pub category: PostCategory,
    pub status: PostStatus,
    pub like_count: u64,
    pub comment_count: u64,
    pub created_at: i64,
    pub updated_at: i64,
}

#[account]
pub struct Comment {
    pub author: Pubkey,
    pub post: Pubkey,
    pub content: String,
    pub status: CommentStatus,
    pub created_at: i64,
    pub updated_at: i64,
}

#[account]
pub struct Like {
    pub user: Pubkey,
    pub post: Pubkey,
    pub created_at: i64,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct CommunityParams {
    pub name: String,
    pub description: String,
    pub category: CommunityCategory,
    pub rules: Vec<String>,
    pub tags: Vec<String>,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct PostParams {
    pub title: String,
    pub content: String,
    pub category: PostCategory,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct CommentParams {
    pub content: String,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum CommunityCategory {
    General,
    Investment,
    Development,
    Support,
    Other,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum CommunityStatus {
    Active,
    Archived,
    Banned,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum MemberRole {
    Admin,
    Moderator,
    Member,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum PostCategory {
    Discussion,
    Question,
    Announcement,
    Resource,
    Other,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum PostStatus {
    Active,
    Archived,
    Hidden,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum CommentStatus {
    Active,
    Hidden,
}

#[error_code]
pub enum CommunityError {
    #[msg("Arithmetic overflow")]
    Overflow,
    #[msg("Unauthorized access")]
    Unauthorized,
    #[msg("Community is not active")]
    CommunityNotActive,
}

impl Community {
    pub const LEN: usize = 8 + // discriminator
        32 + // creator
        4 + 100 + // name (max 100 chars)
        4 + 500 + // description (max 500 chars)
        1 + // category
        1 + // status
        8 + // member_count
        8 + // post_count
        4 + 10 * 100 + // rules (max 10 rules, 100 chars each)
        4 + 10 * 50 + // tags (max 10 tags, 50 chars each)
        8 + // created_at
        8; // updated_at
}

impl Membership {
    pub const LEN: usize = 8 + // discriminator
        32 + // community
        32 + // member
        1 + // role
        8 + // joined_at
        8; // updated_at
}

impl Post {
    pub const LEN: usize = 8 + // discriminator
        32 + // author
        32 + // community
        4 + 200 + // title (max 200 chars)
        4 + 2000 + // content (max 2000 chars)
        1 + // category
        1 + // status
        8 + // like_count
        8 + // comment_count
        8 + // created_at
        8; // updated_at
}

impl Comment {
    pub const LEN: usize = 8 + // discriminator
        32 + // author
        32 + // post
        4 + 1000 + // content (max 1000 chars)
        1 + // status
        8 + // created_at
        8; // updated_at
}

impl Like {
    pub const LEN: usize = 8 + // discriminator
        32 + // user
        32 + // post
        8; // created_at
} 