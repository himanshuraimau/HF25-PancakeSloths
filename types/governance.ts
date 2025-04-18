/**
 * Governance and voting related types
 */

export interface Proposal {
  id: string
  title: string
  description: string
  creatorId: string
  status: ProposalStatus
  createdAt: string
  updatedAt: string
  startDate: string
  endDate: string
  executionDate?: string
  executionDelay: number
  minimumQuorum: number
  minimumVotingPower: number
  options: ProposalOption[]
  discussionUrl?: string
  ipfsHash?: string
  transactionHash?: string
  category: ProposalCategory
  tags: string[]
  snapshot: string
}

export enum ProposalStatus {
  DRAFT = "draft",
  ACTIVE = "active",
  PASSED = "passed",
  FAILED = "failed",
  EXECUTED = "executed",
  CANCELLED = "cancelled",
}

export enum ProposalCategory {
  PARAMETER_CHANGE = "parameter_change",
  ASSET_LISTING = "asset_listing",
  TREASURY = "treasury",
  PROTOCOL_UPGRADE = "protocol_upgrade",
  COMMUNITY = "community",
  OTHER = "other",
}

export interface ProposalOption {
  id: string
  proposalId: string
  title: string
  description?: string
  voteCount: number
  votingPower: number
  percentage: number
}

export interface Vote {
  id: string
  proposalId: string
  userId: string
  optionId: string
  votingPower: number
  timestamp: string
  transactionHash?: string
  reason?: string
}

export interface GovernanceToken {
  id: string
  name: string
  symbol: string
  contractAddress: string
  chainId: string
  decimals: number
  totalSupply: number
  circulatingSupply: number
  price: number
  marketCap: number
  holders: number
  votingWeight: number
}

export interface Delegation {
  id: string
  delegatorId: string
  delegateId: string
  amount: number
  startDate: string
  endDate?: string
  status: DelegationStatus
  transactionHash?: string
}

export enum DelegationStatus {
  ACTIVE = "active",
  REVOKED = "revoked",
  EXPIRED = "expired",
}

export interface GovernanceStats {
  totalProposals: number
  activeProposals: number
  passedProposals: number
  failedProposals: number
  totalVotes: number
  uniqueVoters: number
  averageVoterParticipation: number
  topVoters: {
    userId: string
    votingPower: number
    proposalsVoted: number
  }[]
  recentProposals: Proposal[]
}

export interface GovernanceAction {
  id: string
  proposalId: string
  type: GovernanceActionType
  target: string
  value: number
  signature: string
  callData: string
  description: string
  executed: boolean
  executedAt?: string
  executionTransactionHash?: string
}

export enum GovernanceActionType {
  TRANSFER = "transfer",
  CONTRACT_CALL = "contract_call",
  PARAMETER_CHANGE = "parameter_change",
  UPGRADE = "upgrade",
  OTHER = "other",
}
