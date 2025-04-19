"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Vote,
  FileText,
  CheckCircle2,
  Clock,
  Users,
  ThumbsUp,
  ThumbsDown,
  ArrowRight,
  AlertCircle,
  PieChart,
} from "lucide-react"
import { GovernanceChart } from "@/components/governance-chart"

export function GovernanceCenter() {
  const [activeTab, setActiveTab] = useState("proposals")
  const [selectedProposal, setSelectedProposal] = useState<number | null>(null)
  const [voteAmount, setVoteAmount] = useState(100)

  const proposals = [
    {
      id: 1,
      title: "Increase Collateral Factor for SKY Token",
      creator: "0x7F...A3D9",
      category: "Parameter Change",
      status: "Active",
      endTime: "2 days 14 hours",
      description:
        "This proposal aims to increase the collateral factor for the SKY token from 70% to 75%, allowing users to borrow more against their SKY holdings while maintaining system safety.",
      votes: { yes: 1250000, no: 320000, abstain: 75000 },
      quorum: 1500000,
      threshold: 66,
      createdAt: "April 10, 2024",
    },
    {
      id: 2,
      title: "Add Support for MUSIC Token",
      creator: "0x3A...B2C1",
      category: "Asset Listing",
      status: "Active",
      endTime: "1 day 8 hours",
      description:
        "This proposal suggests adding the MUSIC token as a supported asset in the UnityVault ecosystem, allowing users to tokenize, trade, and use music royalty tokens as collateral.",
      votes: { yes: 980000, no: 450000, abstain: 120000 },
      quorum: 1500000,
      threshold: 66,
      createdAt: "April 11, 2024",
    },
    {
      id: 3,
      title: "Reduce Platform Fees for Environmental Assets",
      creator: "0x5D...E7F2",
      category: "Fee Structure",
      status: "Active",
      endTime: "3 days 22 hours",
      description:
        "This proposal suggests reducing platform fees for environmental assets like carbon credits and renewable energy certificates to incentivize more green investments on the platform.",
      votes: { yes: 1650000, no: 180000, abstain: 90000 },
      quorum: 1500000,
      threshold: 66,
      createdAt: "April 9, 2024",
    },
  ]

  const pastProposals = [
    {
      id: 101,
      title: "Implement Multi-Chain Support",
      category: "Protocol Upgrade",
      status: "Passed",
      votes: { yes: 2100000, no: 350000, abstain: 50000 },
      implementationDate: "March 28, 2024",
    },
    {
      id: 102,
      title: "Add CARB Token to Lending Markets",
      category: "Asset Listing",
      status: "Passed",
      votes: { yes: 1850000, no: 420000, abstain: 130000 },
      implementationDate: "March 15, 2024",
    },
    {
      id: 103,
      title: "Increase Interest Rate for DGART Token",
      category: "Parameter Change",
      status: "Rejected",
      votes: { yes: 950000, no: 1650000, abstain: 200000 },
      implementationDate: "N/A",
    },
  ]

  const delegations = [
    {
      id: 1,
      delegate: "EcoDAO",
      address: "0x8B...C4D2",
      votingPower: 250000,
      delegatedSince: "February 15, 2024",
      categories: ["Environmental", "Community"],
    },
    {
      id: 2,
      delegate: "TechGuild",
      address: "0x2A...F7B3",
      votingPower: 180000,
      delegatedSince: "March 5, 2024",
      categories: ["Protocol Upgrade", "Asset Listing"],
    },
  ]

  const selectedProposalData = selectedProposal ? proposals.find((p) => p.id === selectedProposal) : null

  const calculateVotePercentage = (proposal: (typeof proposals)[0]) => {
    const totalVotes = proposal.votes.yes + proposal.votes.no + proposal.votes.abstain
    return {
      yes: Math.round((proposal.votes.yes / totalVotes) * 100),
      no: Math.round((proposal.votes.no / totalVotes) * 100),
      abstain: Math.round((proposal.votes.abstain / totalVotes) * 100),
      quorumPercentage: Math.round((totalVotes / proposal.quorum) * 100),
    }
  }

  return (
    <div className="container py-8">
      <div className="mb-8 text-center">
        <Badge className="mb-2 bg-primary/20 text-primary hover:bg-primary/30 dark:bg-primary/30 dark:text-primary-foreground dark:hover:bg-primary/40">
          Governance Center
        </Badge>
        <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
          Decentralized Governance
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Participate in shaping the future of the UnityVault ecosystem
        </p>
      </div>


      <div className="mb-12 grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h2 className="mb-4 font-display text-2xl font-bold text-gray-900 dark:text-white">Governance Overview</h2>
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              UnityVault governance allows token holders to propose and vote on changes to the protocol. Your voting
              power is determined by your token holdings and participation helps ensure the platform evolves in a way
              that benefits all stakeholders.
            </p>
            <div className="grid gap-4 sm:grid-cols-3">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="flex size-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                      <Vote className="size-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">3.2M</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Total Voting Power</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="flex size-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                      <FileText className="size-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">12</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Active Proposals</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="flex size-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900">
                      <Users className="size-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">78%</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Participation Rate</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Your Governance Stats</CardTitle>
              <CardDescription>Your participation and influence</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-blue-50 dark:bg-blue-800 p-4 text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-white">1,250</div>
                <div className="text-sm text-blue-600 dark:text-white">Voting Power</div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Proposals Voted</span>
                  <span className="font-medium text-gray-900 dark:text-white">8 / 10</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Proposals Created</span>
                  <span className="font-medium text-gray-900 dark:text-white">1</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Delegated Power</span>
                  <span className="font-medium text-gray-900 dark:text-white">250</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  Delegate
                </Button>
                <Button className="flex-1 bg-gradient-to-r from-[#00A3FF] to-[#4ADE80] text-white hover:opacity-90">
                  Create Proposal
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>


      <Tabs defaultValue="proposals" onValueChange={setActiveTab} className="space-y-8">
        <div className="flex justify-center">
          <TabsList className="grid w-[500px] grid-cols-3">
            <TabsTrigger
              value="proposals"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Active Proposals
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Proposal History
            </TabsTrigger>
            <TabsTrigger
              value="delegation"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Delegation
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="proposals" className="space-y-8">
          {selectedProposal ? (
            <div className="grid gap-8 md:grid-cols-3">
              <div className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between">
                      <div>
                        <Badge className="mb-2">{selectedProposalData?.category}</Badge>
                        <CardTitle>{selectedProposalData?.title}</CardTitle>
                        <CardDescription className="flex items-center gap-1">
                          Proposed by {selectedProposalData?.creator} on {selectedProposalData?.createdAt}
                        </CardDescription>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => setSelectedProposal(null)}>
                        Back to Proposals
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="mb-2 font-medium text-gray-900">Description</h3>
                      <p className="text-gray-600">{selectedProposalData?.description}</p>
                    </div>

                    <div className="rounded-lg border border-gray-200 p-4">
                      <h3 className="mb-4 font-medium text-gray-900">Voting Status</h3>
                      {selectedProposalData && (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <ThumbsUp className="size-5 text-green-600" />
                              <span className="font-medium text-gray-900">Yes</span>
                            </div>
                            <div className="font-medium text-gray-900">
                              {selectedProposalData.votes.yes.toLocaleString()} (
                              {calculateVotePercentage(selectedProposalData).yes}%)
                            </div>
                          </div>
                          <Progress
                            value={calculateVotePercentage(selectedProposalData).yes}
                            className="h-2 bg-gray-100"
                          >
                            <div className="h-full bg-green-500" />
                          </Progress>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <ThumbsDown className="size-5 text-red-600" />
                              <span className="font-medium text-gray-900">No</span>
                            </div>
                            <div className="font-medium text-gray-900">
                              {selectedProposalData.votes.no.toLocaleString()} (
                              {calculateVotePercentage(selectedProposalData).no}%)
                            </div>
                          </div>
                          <Progress
                            value={calculateVotePercentage(selectedProposalData).no}
                            className="h-2 bg-gray-100"
                          >
                            <div className="h-full bg-red-500" />
                          </Progress>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <AlertCircle className="size-5 text-gray-400" />
                              <span className="font-medium text-gray-900">Abstain</span>
                            </div>
                            <div className="font-medium text-gray-900">
                              {selectedProposalData.votes.abstain.toLocaleString()} (
                              {calculateVotePercentage(selectedProposalData).abstain}%)
                            </div>
                          </div>
                          <Progress
                            value={calculateVotePercentage(selectedProposalData).abstain}
                            className="h-2 bg-gray-100"
                          >
                            <div className="h-full bg-gray-400" />
                          </Progress>

                          <div className="mt-4 rounded-lg bg-blue-50 p-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <PieChart className="size-5 text-blue-600" />
                                <span className="font-medium text-gray-900">Quorum Progress</span>
                              </div>
                              <div className="font-medium text-gray-900">
                                {calculateVotePercentage(selectedProposalData).quorumPercentage}%
                              </div>
                            </div>
                            <Progress
                              value={calculateVotePercentage(selectedProposalData).quorumPercentage}
                              className="mt-2 h-2 bg-blue-100"
                            >
                              <div className="h-full bg-blue-500" />
                            </Progress>
                            <div className="mt-2 text-sm text-blue-700">
                              {selectedProposalData.votes.yes +
                                selectedProposalData.votes.no +
                                selectedProposalData.votes.abstain}{" "}
                              / {selectedProposalData.quorum.toLocaleString()} votes needed for quorum
                            </div>
                          </div>

                          <div className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
                            <div className="flex items-center gap-2">
                              <Clock className="size-5 text-gray-600" />
                              <span className="font-medium text-gray-900">Time Remaining</span>
                            </div>
                            <Badge variant="outline" className="bg-blue-50 text-blue-600">
                              {selectedProposalData.endTime}
                            </Badge>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="rounded-lg border border-gray-200 p-4">
                      <h3 className="mb-4 font-medium text-gray-900">Requirements for Passing</h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <div
                            className={`size-5 rounded-full ${calculateVotePercentage(selectedProposalData!).quorumPercentage >= 100 ? "bg-green-500" : "bg-gray-200"}`}
                          >
                            {calculateVotePercentage(selectedProposalData!).quorumPercentage >= 100 && (
                              <CheckCircle2 className="size-5 text-white" />
                            )}
                          </div>
                          <span className="text-gray-600">
                            Quorum: {selectedProposalData?.quorum.toLocaleString()} votes required
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div
                            className={`size-5 rounded-full ${calculateVotePercentage(selectedProposalData!).yes >= selectedProposalData!.threshold ? "bg-green-500" : "bg-gray-200"}`}
                          >
                            {calculateVotePercentage(selectedProposalData!).yes >= selectedProposalData!.threshold && (
                              <CheckCircle2 className="size-5 text-white" />
                            )}
                          </div>
                          <span className="text-gray-600">
                            Approval Threshold: {selectedProposalData?.threshold}% yes votes required
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Cast Your Vote</CardTitle>
                    <CardDescription>Your voting power: 1,250</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-2">
                        <Button className="bg-green-600 hover:bg-green-700">
                          <ThumbsUp className="mr-2 size-4" /> Yes
                        </Button>
                        <Button
                          variant="outline"
                          className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                        >
                          <ThumbsDown className="mr-2 size-4" /> No
                        </Button>
                        <Button variant="outline">
                          <AlertCircle className="mr-2 size-4" /> Abstain
                        </Button>
                      </div>

                      <div className="space-y-2">
                        <Label>Voting Power to Use</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            value={voteAmount}
                            onChange={(e) => setVoteAmount(Number(e.target.value))}
                            max={1250}
                          />
                          <Button variant="outline" size="sm" onClick={() => setVoteAmount(1250)}>
                            Max
                          </Button>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Min: 1</span>
                          <span>Available: 1,250</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="vote-reason">Reason (Optional)</Label>
                        <Textarea
                          id="vote-reason"
                          placeholder="Explain your vote (will be publicly visible)"
                          className="min-h-[100px]"
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-primary text-primary-foreground hover:opacity-90">
                      Submit Vote
                      <ArrowRight className="ml-2 size-4" />
                    </Button>
                  </CardFooter>
                </Card>

                <div className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Top Voters</CardTitle>
                      <CardDescription>Largest votes on this proposal</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <ThumbsUp className="size-4 text-green-600" />
                            <span className="text-sm text-gray-900">0x8D...F2E1</span>
                          </div>
                          <span className="font-medium text-gray-900">250,000</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <ThumbsUp className="size-4 text-green-600" />
                            <span className="text-sm text-gray-900">0x3A...B2C1</span>
                          </div>
                          <span className="font-medium text-gray-900">175,000</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <ThumbsDown className="size-4 text-red-600" />
                            <span className="text-sm text-gray-900">0x5D...E7F2</span>
                          </div>
                          <span className="font-medium text-gray-900">120,000</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <ThumbsUp className="size-4 text-green-600" />
                            <span className="text-sm text-gray-900">0x2F...A9B3</span>
                          </div>
                          <span className="font-medium text-gray-900">95,000</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {proposals.map((proposal) => {
                const votePercentages = calculateVotePercentage(proposal)
                return (
                  <Card key={proposal.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <Badge>{proposal.category}</Badge>
                        <Badge className="bg-blue-50 text-blue-600">{proposal.status}</Badge>
                      </div>
                      <CardTitle className="text-lg">{proposal.title}</CardTitle>
                      <CardDescription className="flex items-center gap-1">
                        Proposed by {proposal.creator}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 pb-3">
                      <p className="text-sm text-gray-600 line-clamp-2">{proposal.description}</p>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-1">
                            <ThumbsUp className="size-4 text-green-600" />
                            <span className="text-gray-900">Yes: {votePercentages.yes}%</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <ThumbsDown className="size-4 text-red-600" />
                            <span className="text-gray-900">No: {votePercentages.no}%</span>
                          </div>
                        </div>
                        <Progress value={votePercentages.yes} className="h-2 bg-gray-100">
                          <div className="h-full bg-green-500" />
                        </Progress>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1">
                          <PieChart className="size-4 text-blue-600" />
                          <span className="text-gray-500">Quorum: {votePercentages.quorumPercentage}%</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-500">
                          <Clock className="size-4" /> {proposal.endTime}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        className="w-full bg-gradient-to-r from-[#00A3FF] to-[#4ADE80] text-white hover:opacity-90"
                        onClick={() => setSelectedProposal(proposal.id)}
                      >
                        View Proposal
                      </Button>
                    </CardFooter>
                  </Card>
                )
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-8">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Past Proposals</CardTitle>
                  <CardDescription>History of governance decisions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {pastProposals.map((proposal) => (
                    <div key={proposal.id} className="rounded-lg border border-gray-200 p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">{proposal.title}</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Badge variant="outline">{proposal.category}</Badge>
                          </div>
                        </div>
                        <Badge
                          className={
                            proposal.status === "Passed" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                          }
                        >
                          {proposal.status}
                        </Badge>
                      </div>
                      <div className="mb-3 space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Votes</span>
                          <span className="font-medium text-gray-900">
                            {Math.round(
                              (proposal.votes.yes / (proposal.votes.yes + proposal.votes.no + proposal.votes.abstain)) *
                              100,
                            )}
                            % in favor
                          </span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                          <div
                            className={`h-full ${proposal.status === "Passed" ? "bg-green-500" : "bg-red-500"}`}
                            style={{
                              width: `${(proposal.votes.yes / (proposal.votes.yes + proposal.votes.no + proposal.votes.abstain)) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1 text-gray-500">
                          <span>Implementation Date:</span>
                          <span className="font-medium text-gray-900">{proposal.implementationDate}</span>
                        </div>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Governance Analytics</CardTitle>
                  <CardDescription>Historical voting patterns</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="h-[200px]">
                    <GovernanceChart />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Total Proposals</span>
                      <span className="font-medium text-gray-900">42</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Passed Proposals</span>
                      <span className="font-medium text-green-600">35 (83%)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Rejected Proposals</span>
                      <span className="font-medium text-red-600">7 (17%)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Average Participation</span>
                      <span className="font-medium text-gray-900">72%</span>
                    </div>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3">
                    <h4 className="mb-2 font-medium text-gray-900">Top Categories</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Parameter Change</span>
                        <span className="font-medium text-gray-900">38%</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Asset Listing</span>
                        <span className="font-medium text-gray-900">24%</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Protocol Upgrade</span>
                        <span className="font-medium text-gray-900">18%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="delegation" className="space-y-8">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Your Delegations</CardTitle>
                  <CardDescription>Manage your voting power delegations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {delegations.map((delegation) => (
                    <div key={delegation.id} className="rounded-lg border border-gray-200 p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">{delegation.delegate}</h3>
                          <div className="text-sm text-gray-500">{delegation.address}</div>
                        </div>
                        <Badge className="bg-blue-50 text-blue-600">Active</Badge>
                      </div>
                      <div className="mb-3 space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Delegated Voting Power</span>
                          <span className="font-medium text-gray-900">{delegation.votingPower.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Delegated Since</span>
                          <span className="font-medium text-gray-900">{delegation.delegatedSince}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Focus Categories</span>
                          <div className="flex gap-1">
                            {delegation.categories.map((category) => (
                              <Badge key={category} variant="outline">
                                {category}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" className="flex-1">
                          Edit
                        </Button>
                        <Button variant="destructive" className="flex-1">
                          Revoke
                        </Button>
                      </div>
                    </div>
                  ))}

                  {delegations.length === 0 && (
                    <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center">
                      <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-gray-100">
                        <Users className="size-6 text-gray-400" />
                      </div>
                      <h3 className="mb-2 text-lg font-medium text-gray-900">No Active Delegations</h3>
                      <p className="mb-4 text-sm text-gray-600">
                        You haven't delegated your voting power to anyone yet. Delegation allows you to support trusted
                        community members.
                      </p>
                      <Button>Delegate Voting Power</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Delegate Your Voting Power</CardTitle>
                  <CardDescription>Support trusted community members</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="delegate-address">Delegate Address</Label>
                    <Input id="delegate-address" placeholder="0x..." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="delegate-amount">Amount to Delegate</Label>
                    <Input id="delegate-amount" type="number" placeholder="Enter amount" />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Available: 1,000</span>
                      <button className="text-blue-600">Max</button>
                    </div>
                  </div>
                  <div className="rounded-lg bg-blue-50 p-3 text-sm text-blue-800">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="mt-0.5 size-4 flex-shrink-0" />
                      <p>
                        Delegation transfers your voting power but not your tokens. You can revoke delegation at any
                        time.
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-gradient-to-r from-[#00A3FF] to-[#4ADE80] text-white hover:opacity-90">
                    Delegate Voting Power
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Delegates</CardTitle>
                  <CardDescription>Community-trusted representatives</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">EcoDAO</div>
                        <div className="text-xs text-gray-500">0x8B...C4D2</div>
                      </div>
                      <Badge variant="outline">1.2M Votes</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">TechGuild</div>
                        <div className="text-xs text-gray-500">0x2A...F7B3</div>
                      </div>
                      <Badge variant="outline">850K Votes</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">AssetGuardians</div>
                        <div className="text-xs text-gray-500">0x5D...E7F2</div>
                      </div>
                      <Badge variant="outline">720K Votes</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">TokenomicsLab</div>
                        <div className="text-xs text-gray-500">0x3F...A9C1</div>
                      </div>
                      <Badge variant="outline">580K Votes</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
