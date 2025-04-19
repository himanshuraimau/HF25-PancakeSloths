/**
 * Tokenization service for handling asset tokenization operations
 */

import { apiService } from "./api"
import type {
  TokenizationProject,
  TokenizationDocument,
  TokenizationStep,
  TokenDistribution,
  TokenVesting,
  TokenizationApplication,
  TokenizedAssetType,
  ApiResponse,
  PaginationParams,
} from "@/types"

class TokenizationService {
  /**
   * Get a list of tokenization projects
   */
  async getProjects(
    params?: PaginationParams & { status?: string; type?: string },
  ): Promise<ApiResponse<TokenizationProject[]>> {
    return apiService.get<TokenizationProject[]>("/tokenization/projects", params)
  }

  /**
   * Get a single tokenization project by ID
   */
  async getProject(projectId: string): Promise<ApiResponse<TokenizationProject>> {
    return apiService.get<TokenizationProject>(`/tokenization/projects/${projectId}`)
  }

  /**
   * Create a new tokenization project
   */
  async createProject(projectData: Partial<TokenizationProject>): Promise<ApiResponse<TokenizationProject>> {
    return apiService.post<TokenizationProject>("/tokenization/projects", projectData)
  }

  /**
   * Update an existing tokenization project
   */
  async updateProject(
    projectId: string,
    projectData: Partial<TokenizationProject>,
  ): Promise<ApiResponse<TokenizationProject>> {
    return apiService.put<TokenizationProject>(`/tokenization/projects/${projectId}`, projectData)
  }

  /**
   * Delete a tokenization project
   */
  async deleteProject(projectId: string): Promise<ApiResponse<{ message: string }>> {
    return apiService.delete<{ message: string }>(`/tokenization/projects/${projectId}`)
  }

  /**
   * Upload a document for a tokenization project
   */
  async uploadDocument(
    projectId: string,
    documentType: string,
    file: File,
    metadata?: Partial<TokenizationDocument>,
  ): Promise<ApiResponse<TokenizationDocument>> {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("documentType", documentType)

    if (metadata) {
      formData.append("metadata", JSON.stringify(metadata))
    }

    return apiService.post<TokenizationDocument>(`/tokenization/projects/${projectId}/documents`, formData, {
      headers: {
        // Don't set Content-Type here, it will be set automatically with the correct boundary
      },
    })
  }

  /**
   * Get documents for a tokenization project
   */
  async getDocuments(projectId: string): Promise<ApiResponse<TokenizationDocument[]>> {
    return apiService.get<TokenizationDocument[]>(`/tokenization/projects/${projectId}/documents`)
  }

  /**
   * Get tokenization steps for a project
   */
  async getSteps(projectId: string): Promise<ApiResponse<TokenizationStep[]>> {
    return apiService.get<TokenizationStep[]>(`/tokenization/projects/${projectId}/steps`)
  }

  /**
   * Update a tokenization step
   */
  async updateStep(
    projectId: string,
    stepId: string,
    stepData: Partial<TokenizationStep>,
  ): Promise<ApiResponse<TokenizationStep>> {
    return apiService.put<TokenizationStep>(`/tokenization/projects/${projectId}/steps/${stepId}`, stepData)
  }

  /**
   * Get token distribution for a project
   */
  async getTokenDistribution(projectId: string): Promise<ApiResponse<TokenDistribution>> {
    return apiService.get<TokenDistribution>(`/tokenization/projects/${projectId}/distribution`)
  }

  /**
   * Update token distribution for a project
   */
  async updateTokenDistribution(
    projectId: string,
    distributionData: Partial<TokenDistribution>,
  ): Promise<ApiResponse<TokenDistribution>> {
    return apiService.put<TokenDistribution>(`/tokenization/projects/${projectId}/distribution`, distributionData)
  }

  /**
   * Get token vesting schedules for a project
   */
  async getVestingSchedules(projectId: string): Promise<ApiResponse<TokenVesting[]>> {
    return apiService.get<TokenVesting[]>(`/tokenization/projects/${projectId}/vesting`)
  }

  /**
   * Create a token vesting schedule
   */
  async createVestingSchedule(
    projectId: string,
    vestingData: Partial<TokenVesting>,
  ): Promise<ApiResponse<TokenVesting>> {
    return apiService.post<TokenVesting>(`/tokenization/projects/${projectId}/vesting`, vestingData)
  }

  /**
   * Apply to participate in a tokenization project
   */
  async applyForProject(
    projectId: string,
    applicationData: Partial<TokenizationApplication>,
  ): Promise<ApiResponse<TokenizationApplication>> {
    return apiService.post<TokenizationApplication>(`/tokenization/projects/${projectId}/applications`, applicationData)
  }

  /**
   * Get asset types for tokenization
   */
  async getAssetTypes(): Promise<ApiResponse<{ id: string; name: string; description: string }[]>> {
    return apiService.get<{ id: string; name: string; description: string }[]>("/tokenization/asset-types")
  }

  /**
   * Estimate tokenization fees
   */
  async estimateFees(
    assetType: TokenizedAssetType,
    assetValue: number,
  ): Promise<ApiResponse<{ platformFee: number; otherFees: Record<string, number> }>> {
    return apiService.post<{ platformFee: number; otherFees: Record<string, number> }>("/tokenization/estimate-fees", {
      assetType,
      assetValue,
    })
  }
}

// Create and export a singleton instance
export const tokenizationService = new TokenizationService()
