use anchor_lang::prelude::*;

pub mod user;
pub mod tokenization;
pub mod lending;
pub mod governance;
pub mod community;

declare_id!("598Swc49CxCyKgdqA3LCLSYQu8r6sninckgSeZdisjiP");

#[program]
pub mod anchor {
    use super::*;

    // Re-export all types from modules
    pub use user::*;
    pub use tokenization::*;
    pub use lending::*;
    pub use governance::*;
    pub use community::*;

    // User module instructions
    pub fn create_user_profile(
        ctx: Context<CreateUserProfile>,
        params: UserProfileParams,
    ) -> Result<()> {
        user::create_user_profile(ctx, params)
    }

    pub fn update_user_profile(
        ctx: Context<UpdateUserProfile>,
        params: UserProfileParams,
    ) -> Result<()> {
        user::update_user_profile(ctx, params)
    }

    pub fn enable_two_factor(
        ctx: Context<EnableTwoFactor>,
        secret: String,
        backup_codes: Vec<String>,
    ) -> Result<()> {
        user::enable_two_factor(ctx, secret, backup_codes)
    }

    pub fn verify_kyc(
        ctx: Context<VerifyKyc>,
        kyc_data: KycData,
    ) -> Result<()> {
        user::verify_kyc(ctx, kyc_data)
    }

    // Tokenization module instructions
    pub fn create_token(
        ctx: Context<CreateToken>,
        params: TokenParams,
    ) -> Result<()> {
        tokenization::create_token(ctx, params)
    }

    pub fn transfer_tokens(
        ctx: Context<TransferTokens>,
        amount: u64,
    ) -> Result<()> {
        tokenization::transfer_tokens(ctx, amount)
    }

    pub fn burn_tokens(
        ctx: Context<BurnTokens>,
        amount: u64,
    ) -> Result<()> {
        tokenization::burn_tokens(ctx, amount)
    }

    // Lending module instructions
    pub fn create_loan(
        ctx: Context<CreateLoan>,
        params: LoanParams,
    ) -> Result<()> {
        lending::create_loan(ctx, params)
    }

    pub fn repay_loan(
        ctx: Context<RepayLoan>,
        amount: u64,
    ) -> Result<()> {
        lending::repay_loan(ctx, amount)
    }

    pub fn liquidate_loan(
        ctx: Context<LiquidateLoan>,
    ) -> Result<()> {
        lending::liquidate_loan(ctx)
    }

    // Governance module instructions
    pub fn create_proposal(
        ctx: Context<CreateProposal>,
        params: ProposalParams,
    ) -> Result<()> {
        governance::create_proposal(ctx, params)
    }

    pub fn cast_vote(
        ctx: Context<CastVote>,
        vote: VoteType,
    ) -> Result<()> {
        governance::cast_vote(ctx, vote)
    }

    pub fn execute_proposal(
        ctx: Context<ExecuteProposal>,
    ) -> Result<()> {
        governance::execute_proposal(ctx)
    }

    // Community module instructions
    pub fn create_community(
        ctx: Context<CreateCommunity>,
        params: CommunityParams,
    ) -> Result<()> {
        community::create_community(ctx, params)
    }

    pub fn join_community(
        ctx: Context<JoinCommunity>,
    ) -> Result<()> {
        community::join_community(ctx)
    }

    pub fn create_post(
        ctx: Context<CreatePost>,
        params: PostParams,
    ) -> Result<()> {
        community::create_post(ctx, params)
    }

    pub fn create_comment(
        ctx: Context<CreateComment>,
        content: String,
    ) -> Result<()> {
        community::create_comment(ctx, content)
    }

    pub fn like_post(
        ctx: Context<LikePost>,
    ) -> Result<()> {
        community::like_post(ctx)
    }
}

#[derive(Accounts)]
pub struct Initialize {}
