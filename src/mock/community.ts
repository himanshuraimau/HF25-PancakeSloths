/**
 * Mock data for community
 */

import type { CommunityProject, ProjectContribution, CommunityForum, ForumTopic, ForumPost } from "@/types"

export const mockCommunityProjects: CommunityProject[] = [
  {
    id: "project-1",
    title: "Clean Water Initiative",
    description:
      "Providing clean water access to communities in East Africa through well construction and water purification systems.",
    creatorId: "user-456",
    status: CommunityProjectStatus.ACTIVE,
    category: CommunityProjectCategory.INFRASTRUCTURE,
    fundingGoal: 50000,
    currentFunding: 32500,
    startDate: "2024-03-15T00:00:00Z",
    endDate: "2024-05-15T00:00:00Z",
    createdAt: "2024-03-10T12:00:00Z",
    updatedAt: "2024-04-15T08:30:00Z",
    location: "East Africa",
    images: ["/placeholder.svg?height=200&width=400"],
    videoUrl: "https://www.youtube.com/watch?v=example",
    website: "https://cleanwaterinitiative.org",
    socialLinks: [
      {
        platform: SocialPlatform.TWITTER,
        url: "https://twitter.com/cleanwaterinitiative",
      },
      {
        platform: SocialPlatform.INSTAGRAM,
        url: "https://instagram.com/cleanwaterinitiative",
      },
    ],
    tags: ["water", "africa", "infrastructure", "humanitarian"],
    team: [
      {
        userId: "user-456",
        role: "Project Lead",
      },
      {
        userId: "user-789",
        role: "Field Coordinator",
      },
    ],
    milestones: [],
    updates: [],
    backers: 245,
  },
  {
    id: "project-2",
    title: "Rural Education Program",
    description:
      "Building schools and providing educational resources for children in remote villages across Southeast Asia.",
    creatorId: "user-789",
    status: CommunityProjectStatus.ACTIVE,
    category: CommunityProjectCategory.EDUCATION,
    fundingGoal: 35000,
    currentFunding: 28750,
    startDate: "2024-02-01T00:00:00Z",
    endDate: "2024-04-30T00:00:00Z",
    createdAt: "2024-01-25T15:30:00Z",
    updatedAt: "2024-04-14T14:45:00Z",
    location: "Southeast Asia",
    images: ["/placeholder.svg?height=200&width=400"],
    website: "https://ruraleducationprogram.org",
    socialLinks: [
      {
        platform: SocialPlatform.FACEBOOK,
        url: "https://facebook.com/ruraleducationprogram",
      },
    ],
    tags: ["education", "children", "asia", "schools"],
    team: [
      {
        userId: "user-789",
        role: "Project Lead",
      },
      {
        userId: "user-123",
        role: "Education Specialist",
      },
    ],
    milestones: [],
    updates: [],
    backers: 312,
  },
  {
    id: "project-3",
    title: "Renewable Energy Access",
    description:
      "Installing solar panels in off-grid communities to provide sustainable electricity for homes and community centers.",
    creatorId: "user-123",
    status: CommunityProjectStatus.ACTIVE,
    category: CommunityProjectCategory.TECHNOLOGY,
    fundingGoal: 75000,
    currentFunding: 42000,
    startDate: "2024-03-01T00:00:00Z",
    endDate: "2024-06-01T00:00:00Z",
    createdAt: "2024-02-20T09:15:00Z",
    updatedAt: "2024-04-15T10:20:00Z",
    location: "South America",
    images: ["/placeholder.svg?height=200&width=400"],
    videoUrl: "https://www.youtube.com/watch?v=example2",
    website: "https://renewableenergyaccess.org",
    socialLinks: [
      {
        platform: SocialPlatform.TWITTER,
        url: "https://twitter.com/renewableenergyaccess",
      },
      {
        platform: SocialPlatform.LINKEDIN,
        url: "https://linkedin.com/company/renewableenergyaccess",
      },
    ],
    tags: ["renewable", "solar", "electricity", "sustainability"],
    team: [
      {
        userId: "user-123",
        role: "Project Lead",
      },
      {
        userId: "user-456",
        role: "Technical Director",
      },
    ],
    milestones: [],
    updates: [],
    backers: 189,
  },
  {
    id: "project-4",
    title: "Medical Supplies Distribution",
    description:
      "Delivering essential medical supplies and equipment to underserved clinics and hospitals in rural areas.",
    creatorId: "user-456",
    status: CommunityProjectStatus.ACTIVE,
    category: CommunityProjectCategory.HEALTHCARE,
    fundingGoal: 45000,
    currentFunding: 38250,
    startDate: "2024-02-15T00:00:00Z",
    endDate: "2024-04-15T00:00:00Z",
    createdAt: "2024-02-10T11:45:00Z",
    updatedAt: "2024-04-10T16:30:00Z",
    location: "South Asia",
    images: ["/placeholder.svg?height=200&width=400"],
    website: "https://medicalsuppliesdistribution.org",
    socialLinks: [
      {
        platform: SocialPlatform.INSTAGRAM,
        url: "https://instagram.com/medicalsuppliesdistribution",
      },
    ],
    tags: ["healthcare", "medical", "supplies", "rural"],
    team: [
      {
        userId: "user-456",
        role: "Project Lead",
      },
      {
        userId: "user-789",
        role: "Medical Coordinator",
      },
    ],
    milestones: [],
    updates: [],
    backers: 276,
  },
]

// Add milestones to each project
mockCommunityProjects[0].milestones = [
  {
    id: "milestone-1-1",
    projectId: "project-1",
    title: "Site Selection and Assessment",
    description: "Select and assess 10 potential well sites across target communities",
    targetDate: "2024-03-30T00:00:00Z",
    status: MilestoneStatus.COMPLETED,
    fundingRequired: 5000,
    deliverables: ["Site assessment report", "Community engagement documentation", "Geological surveys"],
    completedAt: "2024-03-28T14:30:00Z",
  },
  {
    id: "milestone-1-2",
    projectId: "project-1",
    title: "Well Construction - Phase 1",
    description: "Begin construction of the first 3 wells in priority communities",
    targetDate: "2024-04-30T00:00:00Z",
    status: MilestoneStatus.IN_PROGRESS,
    fundingRequired: 15000,
    deliverables: ["Construction progress reports", "Photo documentation", "Water quality testing results"],
  },
  {
    id: "milestone-1-3",
    projectId: "project-1",
    title: "Water Purification Systems Installation",
    description: "Install water purification systems at completed well sites",
    targetDate: "2024-05-15T00:00:00Z",
    status: MilestoneStatus.PENDING,
    fundingRequired: 20000,
    deliverables: [
      "Installation reports",
      "Training documentation for local maintenance",
      "Water quality certification",
    ],
  },
]

mockCommunityProjects[1].milestones = [
  {
    id: "milestone-2-1",
    projectId: "project-2",
    title: "Educational Needs Assessment",
    description: "Conduct needs assessment in 5 target villages to determine educational priorities",
    targetDate: "2024-02-15T00:00:00Z",
    status: MilestoneStatus.COMPLETED,
    fundingRequired: 3000,
    deliverables: ["Needs assessment report", "Community feedback documentation", "Prioritized action plan"],
    completedAt: "2024-02-12T10:15:00Z",
  },
  {
    id: "milestone-2-2",
    projectId: "project-2",
    title: "School Construction - Village 1",
    description: "Complete construction of the first school building in Village 1",
    targetDate: "2024-03-15T00:00:00Z",
    status: MilestoneStatus.COMPLETED,
    fundingRequired: 12000,
    deliverables: ["Construction completion report", "Photo documentation", "Safety certification"],
    completedAt: "2024-03-20T16:45:00Z",
  },
  {
    id: "milestone-2-3",
    projectId: "project-2",
    title: "Educational Materials Distribution",
    description: "Procure and distribute educational materials to all completed schools",
    targetDate: "2024-04-15T00:00:00Z",
    status: MilestoneStatus.IN_PROGRESS,
    fundingRequired: 8000,
    deliverables: ["Inventory of materials", "Distribution documentation", "Teacher training records"],
  },
]

// Add updates to each project
mockCommunityProjects[0].updates = [
  {
    id: "update-1-1",
    projectId: "project-1",
    title: "Site Assessment Complete",
    content:
      "We've successfully completed the assessment of all 10 potential well sites. Based on our findings, we've selected the 5 most promising locations that will provide clean water access to over 2,000 people.",
    createdAt: "2024-03-28T15:30:00Z",
    createdBy: "user-456",
    images: ["/placeholder.svg?height=400&width=600"],
    milestoneId: "milestone-1-1",
  },
  {
    id: "update-1-2",
    projectId: "project-1",
    title: "Construction Begins",
    content:
      "We're excited to announce that construction has begun on the first well! The local community has been incredibly supportive, with many volunteers helping with the initial groundwork.",
    createdAt: "2024-04-05T10:15:00Z",
    createdBy: "user-789",
    images: ["/placeholder.svg?height=400&width=600"],
    milestoneId: "milestone-1-2",
  },
]

mockCommunityProjects[1].updates = [
  {
    id: "update-2-1",
    projectId: "project-2",
    title: "Needs Assessment Insights",
    content:
      "Our needs assessment revealed that the biggest educational challenges in the target villages are lack of proper facilities, shortage of qualified teachers, and limited access to learning materials. We've developed a comprehensive plan to address these issues.",
    createdAt: "2024-02-14T09:30:00Z",
    createdBy: "user-789",
    milestoneId: "milestone-2-1",
  },
  {
    id: "update-2-2",
    projectId: "project-2",
    title: "First School Complete!",
    content:
      "We're thrilled to announce that the first school building is now complete! The structure includes 3 classrooms, an administrative office, and proper sanitation facilities. Classes are scheduled to begin next week with 60 students already enrolled.",
    createdAt: "2024-03-22T14:45:00Z",
    createdBy: "user-789",
    images: ["/placeholder.svg?height=400&width=600"],
    videoUrl: "https://www.youtube.com/watch?v=example3",
    milestoneId: "milestone-2-2",
  },
]

export const mockCompletedProjects: CommunityProject[] = [
  {
    id: "project-101",
    title: "School Reconstruction",
    description: "Rebuilding schools damaged by hurricanes in the Caribbean region.",
    creatorId: "user-789",
    status: CommunityProjectStatus.COMPLETED,
    category: CommunityProjectCategory.EDUCATION,
    fundingGoal: 40000,
    currentFunding: 42000,
    startDate: "2023-10-01T00:00:00Z",
    endDate: "2024-02-01T00:00:00Z",
    createdAt: "2023-09-25T12:00:00Z",
    updatedAt: "2024-03-15T10:30:00Z",
    location: "Caribbean",
    images: ["/placeholder.svg?height=100&width=100"],
    tags: ["education", "disaster-recovery", "schools"],
    team: [
      {
        userId: "user-789",
        role: "Project Lead",
      },
    ],
    milestones: [],
    updates: [],
    backers: 315,
  },
  {
    id: "project-102",
    title: "Vaccination Campaign",
    description: "Providing essential vaccines to children in underserved communities in West Africa.",
    creatorId: "user-456",
    status: CommunityProjectStatus.COMPLETED,
    category: CommunityProjectCategory.HEALTHCARE,
    fundingGoal: 35000,
    currentFunding: 38500,
    startDate: "2023-11-01T00:00:00Z",
    endDate: "2024-01-31T00:00:00Z",
    createdAt: "2023-10-20T15:30:00Z",
    updatedAt: "2024-02-15T09:45:00Z",
    location: "West Africa",
    images: ["/placeholder.svg?height=100&width=100"],
    tags: ["healthcare", "vaccines", "children"],
    team: [
      {
        userId: "user-456",
        role: "Project Lead",
      },
    ],
    milestones: [],
    updates: [],
    backers: 276,
  },
]

export const mockContributions: ProjectContribution[] = [
  {
    id: "contribution-1",
    projectId: "project-1",
    userId: "user-123",
    amount: 500,
    timestamp: "2024-04-10T14:30:00Z",
    transactionHash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
    status: ContributionStatus.COMPLETED,
    isAnonymous: false,
    message: "Clean water is a basic human right. Happy to support this important initiative!",
  },
  {
    id: "contribution-2",
    projectId: "project-3",
    userId: "user-123",
    amount: 750,
    timestamp: "2024-04-05T10:15:00Z",
    transactionHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    status: ContributionStatus.COMPLETED,
    isAnonymous: false,
    message: "Renewable energy is the future. Great project!",
  },
]

export const mockCommunityForum: CommunityForum = {
  id: "forum-1",
  name: "UnityVault Community Forum",
  description: "A place for the UnityVault community to discuss projects, governance, and platform features.",
  categories: [],
  moderators: ["user-456", "user-789"],
  createdAt: "2023-06-15T12:00:00Z",
  updatedAt: "2024-04-15T08:30:00Z",
  isActive: true,
  rules: [
    "Be respectful and constructive in all discussions",
    "No spam or self-promotion",
    "Stay on topic within each category",
    "No personal attacks or harassment",
  ],
}

// Add categories to the forum
mockCommunityForum.categories = [
  {
    id: "category-1",
    forumId: "forum-1",
    name: "General Discussion",
    description: "General discussion about UnityVault and tokenized assets",
    topics: 45,
    posts: 312,
    lastPostAt: "2024-04-15T10:30:00Z",
    lastPostBy: "user-123",
    order: 1,
    isActive: true,
  },
  {
    id: "category-2",
    forumId: "forum-1",
    name: "Project Showcase",
    description: "Showcase your community projects and get feedback",
    topics: 32,
    posts: 245,
    lastPostAt: "2024-04-14T15:45:00Z",
    lastPostBy: "user-456",
    order: 2,
    isActive: true,
  },
  {
    id: "category-3",
    forumId: "forum-1",
    name: "Governance Proposals",
    description: "Discuss current and upcoming governance proposals",
    topics: 28,
    posts: 196,
    lastPostAt: "2024-04-15T09:15:00Z",
    lastPostBy: "user-789",
    order: 3,
    isActive: true,
  },
  {
    id: "category-4",
    forumId: "forum-1",
    name: "Technical Support",
    description: "Get help with technical issues and questions",
    topics: 56,
    posts: 378,
    lastPostAt: "2024-04-15T11:20:00Z",
    lastPostBy: "user-123",
    order: 4,
    isActive: true,
  },
]

export const mockForumTopics: Record<string, ForumTopic[]> = {
  "category-1": [
    {
      id: "topic-1-1",
      categoryId: "category-1",
      title: "Welcome to the UnityVault Community Forum",
      content:
        "Welcome to the official UnityVault community forum! This is a place for us to discuss all aspects of the platform, share ideas, and build a strong community around tokenized assets.",
      authorId: "user-456",
      createdAt: "2023-06-15T14:30:00Z",
      updatedAt: "2023-06-15T14:30:00Z",
      views: 1250,
      replies: 45,
      isPinned: true,
      isLocked: false,
      lastReplyAt: "2024-04-10T09:15:00Z",
      lastReplyBy: "user-123",
      tags: ["welcome", "announcement"],
    },
    {
      id: "topic-1-2",
      categoryId: "category-1",
      title: "How to get started with tokenized assets?",
      content:
        "I'm new to the concept of tokenized assets. Can someone explain how to get started and what the benefits are compared to traditional investments?",
      authorId: "user-123",
      createdAt: "2024-04-05T10:15:00Z",
      updatedAt: "2024-04-05T10:15:00Z",
      views: 320,
      replies: 12,
      isPinned: false,
      isLocked: false,
      lastReplyAt: "2024-04-15T10:30:00Z",
      lastReplyBy: "user-789",
      tags: ["beginner", "tokenization", "guide"],
    },
  ],
  "category-3": [
    {
      id: "topic-3-1",
      categoryId: "category-3",
      title: "Discussion: Increase Collateral Factor for SKY Token",
      content:
        "I'd like to discuss the current proposal to increase the collateral factor for SKY token from 70% to 75%. What are your thoughts on the potential risks and benefits?",
      authorId: "user-789",
      createdAt: "2024-04-08T15:30:00Z",
      updatedAt: "2024-04-08T15:30:00Z",
      views: 450,
      replies: 28,
      isPinned: true,
      isLocked: false,
      lastReplyAt: "2024-04-15T09:15:00Z",
      lastReplyBy: "user-123",
      tags: ["governance", "proposal", "lending"],
    },
  ],
}

export const mockForumPosts: Record<string, ForumPost[]> = {
  "topic-1-1": [
    {
      id: "post-1-1-1",
      topicId: "topic-1-1",
      content: "Welcome to the official UnityVault community forum! This is a place for us to discuss all aspects of the platform, share ideas, and build a strong community around tokenized assets.",
      authorId: "user-456",
      createdAt: "2023-06-15T14:30:00Z",
      updatedAt: "2023-06-15T14:30:00Z",
      isEdited: false,
      likes: 45,
      dislikes: 0
    },
    {
      id: "post-1-1-2",
      topicId: "topic-1-1",
      content: "Thanks for creating this forum! Looking forward to engaging with the community and learning more about tokenized assets.",
      authorId: "user-123",\
      createdAt: "2023-06-15T15
