/**
 * Mock data for governance
 */

import type { Proposal, Vote, GovernanceToken, Delegation, GovernanceAction } from "@/types"

export const mockProposals: Proposal[] = [
  {
    id: "proposal-1",
    title: "Increase Collateral Factor for SKY Token",
    description:
      "This proposal aims to increase the collateral factor for the SKY token from 70% to 75%, allowing users to borrow more against their SKY holdings while maintaining system safety.",
    creatorId: "user-789",
    status: ProposalStatus.ACTIVE,
    createdAt: "2024-04-10T12:00:00Z",
    updatedAt: "2024-04-10T12:00:00Z",
    startDate: "2024-04-10T12:00:00Z",
    endDate: "2024-04-17T12:00:00Z",
    executionDelay: 86400, // 24 hours in seconds
    minimumQuorum: 1500000,
    minimumVotingPower: 1000,
    options: [],
    discussionUrl: "https://forum.unityvault.com/proposals/increase-sky-collateral-factor",
    ipfsHash: "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco",
    category: ProposalCategory.PARAMETER_CHANGE,
    tags: ["lending", "collateral", "risk-parameters"],
    snapshot: "12345678",
  },
  {
    id: "proposal-2",
    title: "Add Support for MUSIC Token",
    description:
      "This proposal suggests adding the MUSIC token as a supported asset in the UnityVault ecosystem, allowing users to tokenize, trade, and use music royalty tokens as collateral.",
    creatorId: "user-456",
    status: ProposalStatus.ACTIVE,
    createdAt: "2024-04-11T15:30:00Z",
    updatedAt: "2024-04-11T15:30:00Z",
    startDate: "2024-04-11T15:30:00Z",
    endDate: "2024-04-18T15:30:00Z",
    executionDelay: 86400, // 24 hours in seconds
    minimumQuorum: 1500000,
    minimumVotingPower: 1000,
    options: [],
    discussionUrl: "https://forum.unityvault.com/proposals/add-music-token-support",
    ipfsHash: "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG",
    category: ProposalCategory.ASSET_LISTING,
    tags: ["new-asset", "music", "royalties"],
    snapshot: "12345679",
  },
  {
    id: "proposal-3",
    title: "Reduce Platform Fees for Environmental Assets",
    description:
      "This proposal suggests reducing platform fees for environmental assets like carbon credits and renewable energy certificates to incentivize more green investments on the platform.",
    creatorId: "user-123",
    status: ProposalStatus.ACTIVE,
    createdAt: "2024-04-09T09:15:00Z",
    updatedAt: "2024-04-09T09:15:00Z",
    startDate: "2024-04-09T09:15:00Z",
    endDate: "2024-04-16T09:15:00Z",
    executionDelay: 86400, // 24 hours in seconds
    minimumQuorum: 1500000,
    minimumVotingPower: 1000,
    options: [],
    discussionUrl: "https://forum.unityvault.com/proposals/reduce-fees-environmental-assets",
    ipfsHash: "QmZ4tDuvesekSs4qM5ZBKpXiZGun7S2CYtEZRB3DYXkjGx",
    category: ProposalCategory.TREASURY,
    tags: ["fees", "environmental", "incentives"],
    snapshot: "12345680",
  },
]

// Add options to each proposal
mockProposals.forEach((proposal) => {
  proposal.options = [
    {
      id: `${proposal.id}-option-1`,
      proposalId: proposal.id,
      title: "Yes",
      description: "Approve this proposal",
      voteCount: 0,
      votingPower: 0,
      percentage: 0,
    },
    {
      id: `${proposal.id}-option-2`,
      proposalId: proposal.id,
      title: "No",
      description: "Reject this proposal",
      voteCount: 0,
      votingPower: 0,
      percentage: 0,
    },
    {
      id: `${proposal.id}-option-3`,
      proposalId: proposal.id,
      title: "Abstain",
      description: "Abstain from voting",
      voteCount: 0,
      votingPower: 0,
      percentage: 0,
    },
  ]
})

// Set voting data for each proposal
mockProposals[0].options[0].voteCount = 342
mockProposals[0].options[0].votingPower = 1250000
mockProposals[0].options[1].voteCount = 28
mockProposals[0].options[1].votingPower = 320000
mockProposals[0].options[2].voteCount = 15
mockProposals[0].options[2].votingPower = 75000

mockProposals[1].options[0].voteCount = 289
mockProposals[1].options[0].votingPower = 980000
mockProposals[1].options[1].voteCount = 42
mockProposals[1].options[1].votingPower = 450000
mockProposals[1].options[2].voteCount = 25
mockProposals[1].options[2].votingPower = 120000

mockProposals[2].options[0].voteCount = 412
mockProposals[2].options[0].votingPower = 1650000
mockProposals[2].options[1].voteCount = 15
mockProposals[2].options[1].votingPower = 180000
mockProposals[2].options[2].voteCount = 18
mockProposals[2].options[2].votingPower = 90000

// Calculate percentages
mockProposals.forEach((proposal) => {
  const totalVotingPower = proposal.options.reduce((sum, option) => sum + option.votingPower, 0)
  proposal.options.forEach((option) => {
    option.percentage = totalVotingPower > 0 ? Math.round((option.votingPower / totalVotingPower) * 100) : 0
  })
})

export const mockPastProposals: Proposal[] = [
  {
    id: "proposal-101",
    title: "Implement Multi-Chain Support",
    description:
      "This proposal aims to expand UnityVault to support multiple blockchains, starting with Ethereum, Polygon, and Solana.",
    creatorId: "user-456",
    status: ProposalStatus.PASSED,
    createdAt: "2024-03-10T12:00:00Z",
    updatedAt: "2024-03-28T14:30:00Z",
    startDate: "2024-03-10T12:00:00Z",
    endDate: "2024-03-17T12:00:00Z",
    executionDate: "2024-03-28T14:30:00Z",
    executionDelay: 86400,
    minimumQuorum: 1500000,
    minimumVotingPower: 1000,
    options: [
      {
        id: "proposal-101-option-1",
        proposalId: "proposal-101",
        title: "Yes",
        description: "Approve this proposal",
        voteCount: 520,
        votingPower: 2100000,
        percentage: 84,
      },
      {
        id: "proposal-101-option-2",
        proposalId: "proposal-101",
        title: "No",
        description: "Reject this proposal",
        voteCount: 45,
        votingPower: 350000,
        percentage: 14,
      },
      {
        id: "proposal-101-option-3",
        proposalId: "proposal-101",
        title: "Abstain",
        description: "Abstain from voting",
        voteCount: 10,
        votingPower: 50000,
        percentage: 2,
      },
    ],
    discussionUrl: "https://forum.unityvault.com/proposals/implement-multi-chain-support",
    ipfsHash: "QmT8B9yrDf2gK5YRA5pEjbL9Gsf2Hzcpx47QJK1qBWxKnU",
    category: ProposalCategory.PROTOCOL_UPGRADE,
    tags: ["multi-chain", "infrastructure", "expansion"],
    snapshot: "12345670",
  },
  {
    id: "proposal-102",
    title: "Add CARB Token to Lending Markets",
    description:
      "This proposal suggests adding the CARB token as a supported asset in the lending markets, allowing users to supply and borrow against carbon credit tokens.",
    creatorId: "user-789",
    status: ProposalStatus.PASSED,
    createdAt: "2024-02-25T15:30:00Z",
    updatedAt: "2024-03-15T10:45:00Z",
    startDate: "2024-02-25T15:30:00Z",
    endDate: "2024-03-04T15:30:00Z",
    executionDate: "2024-03-15T10:45:00Z",
    executionDelay: 86400,
    minimumQuorum: 1500000,
    minimumVotingPower: 1000,
    options: [
      {
        id: "proposal-102-option-1",
        proposalId: "proposal-102",
        title: "Yes",
        description: "Approve this proposal",
        voteCount: 480,
        votingPower: 1850000,
        percentage: 77,
      },
      {
        id: "proposal-102-option-2",
        proposalId: "proposal-102",
        title: "No",
        description: "Reject this proposal",
        voteCount: 65,
        votingPower: 420000,
        percentage: 18,
      },
      {
        id: "proposal-102-option-3",
        proposalId: "proposal-102",
        title: "Abstain",
        description: "Abstain from voting",
        voteCount: 25,
        votingPower: 130000,
        percentage: 5,
      },
    ],
    discussionUrl: "https://forum.unityvault.com/proposals/add-carb-token-lending-markets",
    ipfsHash: "QmR8B9yrDf2gK5YRA5pEjbL9Gsf2Hzcpx47QJK1qBWxKnV",
    category: ProposalCategory.ASSET_LISTING,
    tags: ["lending", "carbon-credits", "environmental"],
    snapshot: "12345671",
  },
  {
    id: "proposal-103",
    title: "Increase Interest Rate for DGART Token",
    description:
      "This proposal suggests increasing the interest rate parameters for the DGART token to better reflect its risk profile and market demand.",
    creatorId: "user-123",
    status: ProposalStatus.FAILED,
    createdAt: "2024-02-10T09:15:00Z",
    updatedAt: "2024-02-17T09:15:00Z",
    startDate: "2024-02-10T09:15:00Z",
    endDate: "2024-02-17T09:15:00Z",
    executionDelay: 86400,
    minimumQuorum: 1500000,
    minimumVotingPower: 1000,
    options: [
      {
        id: "proposal-103-option-1",
        proposalId: "proposal-103",
        title: "Yes",
        description: "Approve this proposal",
        voteCount: 210,
        votingPower: 950000,
        percentage: 34,
      },
      {
        id: "proposal-103-option-2",
        proposalId: "proposal-103",
        title: "No",
        description: "Reject this proposal",
        voteCount: 350,
        votingPower: 1650000,
        percentage: 59,
      },
      {
        id: "proposal-103-option-3",
        proposalId: "proposal-103",
        title: "Abstain",
        description: "Abstain from voting",
        voteCount: 40,
        votingPower: 200000,
        percentage: 7,
      },
    ],
    discussionUrl: "https://forum.unityvault.com/proposals/increase-dgart-interest-rate",
    ipfsHash: "QmS8B9yrDf2gK5YRA5pEjbL9Gsf2Hzcpx47QJK1qBWxKnW",
    category: ProposalCategory.PARAMETER_CHANGE,
    tags: ["interest-rates", "lending", "art-tokens"],
    snapshot: "12345672",
  },
]

export const mockVotes: Vote[] = [
  {
    id: "vote-1",
    proposalId: "proposal-1",
    userId: "user-123",
    optionId: "proposal-1-option-1", // Yes
    votingPower: 1250,
    timestamp: "2024-04-12T14:30:00Z",
    transactionHash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
    reason:
      "I believe increasing the collateral factor for SKY is safe given its stability and will improve capital efficiency.",
  },
  {
    id: "vote-2",
    proposalId: "proposal-3",
    userId: "user-123",
    optionId: "proposal-3-option-1", // Yes
    votingPower: 1250,
    timestamp: "2024-04-10T10:15:00Z",
    transactionHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    reason:
      "Reducing fees for environmental assets aligns with our sustainability goals and will attract more green projects.",
  },
]

export const mockGovernanceToken: GovernanceToken = {
  id: "token-gov",
  name: "UnityVault Governance Token",
  symbol: "UVG",
  contractAddress: "0x9876543210abcdef9876543210abcdef98765432",
  chainId: "ethereum-1",
  decimals: 18,
  totalSupply: 10000000,
  circulatingSupply: 7500000,
  price: 2.45,
  marketCap: 18375000,
  holders: 3450,
  votingWeight: 1,
}

export const mockDelegations: Delegation[] = [
  {
    id: "delegation-1",
    delegatorId: "user-123",
    delegateId: "user-456",
    amount: 250,
    startDate: "2024-02-15T10:30:00Z",
    status: DelegationStatus.ACTIVE,
    transactionHash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
  },
  {
    id: "delegation-2",
    delegatorId: "user-123",
    delegateId: "user-789",
    amount: 180,
    startDate: "2024-03-05T14:45:00Z",
    status: DelegationStatus.ACTIVE,
    transactionHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
  },
]

export const mockGovernanceActions: GovernanceAction[] = [
  {
    id: "action-1",
    proposalId: "proposal-101",
    type: GovernanceActionType.PARAMETER_CHANGE,
    target: "0x1234567890abcdef1234567890abcdef12345678",
    value: 0,
    signature: "setMultiChainSupport(bool,bool,bool)",
    callData:
      "0x0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000001",
    description: "Enable support for Ethereum, Polygon, and Solana chains",
    executed: true,
    executedAt: "2024-03-28T14:30:00Z",
    executionTransactionHash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
  },
  {
    id: "action-2",
    proposalId: "proposal-102",
    type: GovernanceActionType.CONTRACT_CALL,
    target: "0xabcdef1234567890abcdef1234567890abcdef12",
    value: 0,
    signature: "addSupportedAsset(address,uint256,uint256)",
    callData:
      "0x000000000000000000000000abcdef1234567890abcdef1234567890abcdef120000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000a",
    description: "Add CARB token to lending markets with 60% collateral factor and 10% reserve factor",
    executed: true,
    executedAt: "2024-03-15T10:45:00Z",
    executionTransactionHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
  },
]
