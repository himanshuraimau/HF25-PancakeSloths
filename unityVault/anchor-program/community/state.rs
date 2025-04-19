use anchor_lang::prelude::*;

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
    pub member: Pubkey,
    pub community: Pubkey,
    pub role: MemberRole,
    pub status: MembershipStatus,
    pub joined_at: i64,
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

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum CommunityCategory {
    General,
    Technology,
    Art,
    Gaming,
    Other,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum CommunityStatus {
    Active,
    Archived,
    Banned,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum MemberRole {
    Admin,
    Moderator,
    Member,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum MembershipStatus {
    Active,
    Banned,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum PostCategory {
    Discussion,
    Question,
    Announcement,
    Event,
    Other,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum PostStatus {
    Active,
    Archived,
    Hidden,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum CommentStatus {
    Active,
    Hidden,
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
        32 + // member
        32 + // community
        1 + // role
        1 + // status
        8; // joined_at
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
