/**
 * Community and social features related types
 */

export interface CommunityProject {
  id: string
  title: string
  description: string
  creatorId: string
  status: CommunityProjectStatus
  category: CommunityProjectCategory
  fundingGoal: number
  currentFunding: number
  startDate: string
  endDate: string
  createdAt: string
  updatedAt: string
  location?: string
  images: string[]
  videoUrl?: string
  website?: string
  socialLinks: {
    platform: SocialPlatform
    url: string
  }[]
  tags: string[]
  team: {
    userId: string
    role: string
  }[]
  milestones: ProjectMilestone[]
  updates: ProjectUpdate[]
  backers: number
}

export enum CommunityProjectStatus {
  DRAFT = "draft",
  ACTIVE = "active",
  FUNDED = "funded",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export enum CommunityProjectCategory {
  EDUCATION = "education",
  ENVIRONMENT = "environment",
  HEALTHCARE = "healthcare",
  TECHNOLOGY = "technology",
  ARTS = "arts",
  SOCIAL = "social",
  INFRASTRUCTURE = "infrastructure",
  OTHER = "other",
}

export enum SocialPlatform {
  TWITTER = "twitter",
  FACEBOOK = "facebook",
  INSTAGRAM = "instagram",
  LINKEDIN = "linkedin",
  GITHUB = "github",
  DISCORD = "discord",
  TELEGRAM = "telegram",
  YOUTUBE = "youtube",
  MEDIUM = "medium",
  OTHER = "other",
}

export interface ProjectMilestone {
  id: string
  projectId: string
  title: string
  description: string
  targetDate: string
  status: MilestoneStatus
  fundingRequired: number
  deliverables: string[]
  completedAt?: string
}

export enum MilestoneStatus {
  PENDING = "pending",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  DELAYED = "delayed",
}

export interface ProjectUpdate {
  id: string
  projectId: string
  title: string
  content: string
  createdAt: string
  createdBy: string
  images?: string[]
  videoUrl?: string
  milestoneId?: string
}

export interface ProjectContribution {
  id: string
  projectId: string
  userId: string
  amount: number
  timestamp: string
  transactionHash?: string
  status: ContributionStatus
  isAnonymous: boolean
  message?: string
  rewardTier?: string
}

export enum ContributionStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  FAILED = "failed",
  REFUNDED = "refunded",
}

export interface CommunityForum {
  id: string
  name: string
  description: string
  categories: ForumCategory[]
  moderators: string[] // User IDs
  createdAt: string
  updatedAt: string
  isActive: boolean
  rules: string[]
}

export interface ForumCategory {
  id: string
  forumId: string
  name: string
  description: string
  topics: number
  posts: number
  lastPostAt?: string
  lastPostBy?: string // User ID
  order: number
  isActive: boolean
}

export interface ForumTopic {
  id: string
  categoryId: string
  title: string
  content: string
  authorId: string
  createdAt: string
  updatedAt: string
  views: number
  replies: number
  isPinned: boolean
  isLocked: boolean
  lastReplyAt?: string
  lastReplyBy?: string // User ID
  tags: string[]
}

export interface ForumPost {
  id: string
  topicId: string
  content: string
  authorId: string
  createdAt: string
  updatedAt: string
  isEdited: boolean
  likes: number
  dislikes: number
  parentId?: string // For replies to other posts
}
