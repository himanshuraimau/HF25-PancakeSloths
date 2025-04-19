/**
 * Trust and transparency related types
 */

export interface TrustScore {
  userId: string
  score: number
  lastUpdated: string
  components: {
    category: TrustScoreCategory
    score: number
    weight: number
  }[]
  history: {
    timestamp: string
    score: number
  }[]
}

export enum TrustScoreCategory {
  IDENTITY_VERIFICATION = "identity_verification",
  TRANSACTION_HISTORY = "transaction_history",
  COMMUNITY_PARTICIPATION = "community_participation",
  GOVERNANCE_PARTICIPATION = "governance_participation",
  PLATFORM_ACTIVITY = "platform_activity",
  EXTERNAL_REPUTATION = "external_reputation",
}

export interface AuditReport {
  id: string
  title: string
  description: string
  auditorId: string
  auditorName: string
  auditDate: string
  publishDate: string
  status: AuditStatus
  severity: AuditSeverity
  findings: AuditFinding[]
  recommendations: string[]
  fileUrl: string
  projectId?: string
  contractAddress?: string
  version: string
  tags: string[]
}

export enum AuditStatus {
  PENDING = "pending",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  FAILED = "failed",
}

export enum AuditSeverity {
  CRITICAL = "critical",
  HIGH = "high",
  MEDIUM = "medium",
  LOW = "low",
  INFORMATIONAL = "informational",
}

export interface AuditFinding {
  id: string
  auditId: string
  title: string
  description: string
  severity: AuditSeverity
  category: AuditFindingCategory
  location?: string
  recommendation: string
  status: AuditFindingStatus
  resolvedAt?: string
  resolvedBy?: string // User ID
  resolution?: string
}

export enum AuditFindingCategory {
  SECURITY = "security",
  CODE_QUALITY = "code_quality",
  CENTRALIZATION = "centralization",
  ARCHITECTURE = "architecture",
  DOCUMENTATION = "documentation",
  GAS_OPTIMIZATION = "gas_optimization",
  OTHER = "other",
}

export enum AuditFindingStatus {
  OPEN = "open",
  RESOLVED = "resolved",
  ACKNOWLEDGED = "acknowledged",
  DISPUTED = "disputed",
}

export interface TransparencyReport {
  id: string
  title: string
  description: string
  reportDate: string
  publishDate: string
  period: {
    startDate: string
    endDate: string
  }
  metrics: {
    category: TransparencyMetricCategory
    name: string
    value: number | string
    previousValue?: number | string
    change?: number
    unit?: string
  }[]
  fileUrl: string
  authorId: string
  isPublic: boolean
}

export enum TransparencyMetricCategory {
  FINANCIAL = "financial",
  OPERATIONAL = "operational",
  SECURITY = "security",
  COMMUNITY = "community",
  ENVIRONMENTAL = "environmental",
  GOVERNANCE = "governance",
  OTHER = "other",
}

export interface VerificationBadge {
  id: string
  userId: string
  type: VerificationType
  issuedAt: string
  expiresAt?: string
  issuer: string
  status: VerificationStatus
  metadata: Record<string, any>
}

export enum VerificationType {
  IDENTITY = "identity",
  ACCREDITED_INVESTOR = "accredited_investor",
  DEVELOPER = "developer",
  AUDITOR = "auditor",
  PARTNER = "partner",
  OTHER = "other",
}

export enum VerificationStatus {
  ACTIVE = "active",
  EXPIRED = "expired",
  REVOKED = "revoked",
  PENDING = "pending",
}
