use anchor_lang::prelude::*;
use crate::community::state::*;
use crate::community::context::*;

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
    community.member_count = 1;
    community.post_count = 0;
    community.rules = params.rules;
    community.tags = params.tags;
    community.created_at = Clock::get()?.unix_timestamp;
    community.updated_at = Clock::get()?.unix_timestamp;
    
    Ok(())
}

pub fn join_community(
    ctx: Context<JoinCommunity>,
) -> Result<()> {
    let membership = &mut ctx.accounts.membership;
    let community = &mut ctx.accounts.community;
    
    // Initialize membership
    membership.member = ctx.accounts.member.key();
    membership.community = community.key();
    membership.role = MemberRole::Member;
    membership.status = MembershipStatus::Active;
    membership.joined_at = Clock::get()?.unix_timestamp;
    
    // Update community
    community.member_count = community.member_count.checked_add(1).unwrap();
    community.updated_at = Clock::get()?.unix_timestamp;
    
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
    
    // Update community
    community.post_count = community.post_count.checked_add(1).unwrap();
    community.updated_at = Clock::get()?.unix_timestamp;
    
    Ok(())
}

pub fn create_comment(
    ctx: Context<CreateComment>,
    content: String,
) -> Result<()> {
    let comment = &mut ctx.accounts.comment;
    let post = &mut ctx.accounts.post;
    
    // Initialize comment
    comment.author = ctx.accounts.author.key();
    comment.post = post.key();
    comment.content = content;
    comment.status = CommentStatus::Active;
    comment.created_at = Clock::get()?.unix_timestamp;
    comment.updated_at = Clock::get()?.unix_timestamp;
    
    // Update post
    post.comment_count = post.comment_count.checked_add(1).unwrap();
    post.updated_at = Clock::get()?.unix_timestamp;
    
    Ok(())
}

pub fn like_post(
    ctx: Context<LikePost>,
) -> Result<()> {
    let like = &mut ctx.accounts.like;
    let post = &mut ctx.accounts.post;
    
    // Initialize like
    like.user = ctx.accounts.user.key();
    like.post = post.key();
    like.created_at = Clock::get()?.unix_timestamp;
    
    // Update post
    post.like_count = post.like_count.checked_add(1).unwrap();
    post.updated_at = Clock::get()?.unix_timestamp;
    
    Ok(())
}
