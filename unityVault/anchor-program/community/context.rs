use anchor_lang::prelude::*;
use crate::community::state::*;

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
    #[account(
        init,
        payer = member,
        space = Membership::LEN
    )]
    pub membership: Account<'info, Membership>,
    #[account(mut)]
    pub community: Account<'info, Community>,
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
