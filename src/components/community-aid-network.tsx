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
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Globe, Users, Heart, ArrowRight, Calendar, CheckCircle2, ThumbsUp, ThumbsDown } from "lucide-react"
import { GlobeVisualization } from "@/components/globe-visualization"

export function CommunityAidNetwork() {
  const [activeTab, setActiveTab] = useState("projects")
  const [donationAmount, setDonationAmount] = useState(100)
  const [selectedProject, setSelectedProject] = useState<number | null>(null)

  const aidProjects = [
    {
      id: 1,
      title: "Clean Water Initiative",
      location: "East Africa",
      category: "Infrastructure",
      goal: 50000,
      raised: 32500,
      backers: 245,
      daysLeft: 12,
      description:
        "Providing clean water access to communities in East Africa through well construction and water purification systems.",
      image: "/placeholder.svg?height=200&width=400",
      impact: "Will provide clean water to 5,000+ people",
    },
    {
      id: 2,
      title: "Rural Education Program",
      location: "Southeast Asia",
      category: "Education",
      goal: 35000,
      raised: 28750,
      backers: 312,
      daysLeft: 8,
      description:
        "Building schools and providing educational resources for children in remote villages across Southeast Asia.",
      image: "/placeholder.svg?height=200&width=400",
      impact: "Will educate 1,200+ children",
    },
    {
      id: 3,
      title: "Renewable Energy Access",
      location: "South America",
      category: "Energy",
      goal: 75000,
      raised: 42000,
      backers: 189,
      daysLeft: 21,
      description:
        "Installing solar panels in off-grid communities to provide sustainable electricity for homes and community centers.",
      image: "/placeholder.svg?height=200&width=400",
      impact: "Will power 800+ homes with clean energy",
    },
    {
      id: 4,
      title: "Medical Supplies Distribution",
      location: "South Asia",
      category: "Healthcare",
      goal: 45000,
      raised: 38250,
      backers: 276,
      daysLeft: 5,
      description:
        "Delivering essential medical supplies and equipment to underserved clinics and hospitals in rural areas.",
      image: "/placeholder.svg?height=200&width=400",
      impact: "Will provide care for 10,000+ patients",
    },
  ]

  const proposals = [
    {
      id: 1,
      title: "Community-Led Reforestation",
      creator: "EcoAlliance",
      category: "Environment",
      votes: { yes: 342, no: 28 },
      status: "Active",
      endDate: "May 15, 2024",
      description: "Funding local communities to plant native trees and restore degraded forest ecosystems.",
      requestedAmount: 65000,
    },
    {
      id: 2,
      title: "Microfinance for Women Entrepreneurs",
      creator: "EmpowerFund",
      category: "Economic",
      votes: { yes: 289, no: 42 },
      status: "Active",
      endDate: "May 10, 2024",
      description: "Providing microloans to women entrepreneurs in developing regions to start sustainable businesses.",
      requestedAmount: 50000,
    },
    {
      id: 3,
      title: "Emergency Food Relief",
      creator: "GlobalAid",
      category: "Humanitarian",
      votes: { yes: 412, no: 15 },
      status: "Active",
      endDate: "May 5, 2024",
      description: "Distributing emergency food supplies to regions affected by natural disasters and conflict.",
      requestedAmount: 80000,
    },
  ]

  const completedProjects = [
    {
      id: 1,
      title: "School Reconstruction",
      location: "Caribbean",
      category: "Education",
      raised: 42000,
      backers: 315,
      completionDate: "March 2024",
      impact: "Built 3 schools serving 450+ students",
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 2,
      title: "Vaccination Campaign",
      location: "West Africa",
      category: "Healthcare",
      raised: 38500,
      backers: 276,
      completionDate: "February 2024",
      impact: "Vaccinated 12,000+ children",
      image: "/placeholder.svg?height=100&width=100",
    },
  ]

  const selectedProjectData = selectedProject ? aidProjects.find((p) => p.id === selectedProject) : null

  return (
    <div className="container py-8">
      <div className="mb-8 text-center">
        <Badge className="mb-2 bg-primary/20 text-primary hover:bg-primary/30 dark:bg-primary/10 dark:text-white dark:hover:bg-primary/20 transition-all">
          Community Aid Network
        </Badge>
        <h1 className="font-display text-3xl font-bold text-gray-900 md:text-4xl dark:text-white">
          Support Global Initiatives
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Fund impactful projects and participate in community governance
        </p>
      </div>


      <div className="mb-12 grid gap-8 md:grid-cols-2">
        {/* Left Section */}
        <div className="flex flex-col justify-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white">
              Make a Global Impact
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Our Community Aid Network connects tokenized assets with real-world impact. Support projects around the
              world and track your contributions with full transparency.
            </p>
          </motion.div>

          {/* Statistics Section */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {/* Individual Stat Cards */}
            {[
              { icon: <Globe className="size-6 text-blue-600" />, value: "25+", label: "Countries", bgColor: "bg-blue-100", textColor: "text-blue-600" },
              { icon: <Heart className="size-6 text-green-600" />, value: "$2.4M+", label: "Donated", bgColor: "bg-green-100", textColor: "text-green-600" },
              { icon: <Users className="size-6 text-purple-600" />, value: "50K+", label: "Lives Improved", bgColor: "bg-purple-100", textColor: "text-purple-600" }
            ].map((stat, idx) => (
              <div key={idx} className="rounded-lg border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 p-4 text-center shadow-sm transition-all hover:scale-105">
                <div className={`mx-auto mb-2 flex size-12 items-center justify-center rounded-full ${stat.bgColor}`}>
                  {stat.icon}
                </div>
                <h3 className="font-medium text-gray-900 dark:text-white">{stat.value}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
              </div>
            ))}

          </div>

          {/* Call to Action Button */}
          <Button className="w-fit bg-primary text-primary-foreground hover:opacity-90 dark:bg-primary dark:text-white dark:hover:opacity-80 transition-all">
            Learn How It Works
          </Button>
        </div>

        {/* Right Section - Globe Visualization */}
        <div className="h-[400px] rounded-xl bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-900 dark:to-green-900 p-4">
          <GlobeVisualization />
        </div>
      </div>


      <Tabs defaultValue="projects" onValueChange={setActiveTab} className="space-y-8">
        <div className="flex justify-center">
          <TabsList className="grid w-[400px] grid-cols-2">
            <TabsTrigger
              value="projects"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Aid Projects
            </TabsTrigger>
            <TabsTrigger
              value="governance"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Governance
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="projects" className="space-y-8">
          {selectedProject ? (
            <div className="grid gap-8 md:grid-cols-3">
              {/* Project Details Section */}
              <div className="md:col-span-2">
                <Card className="shadow-lg dark:bg-gray-800 dark:border-gray-700">
                  <CardHeader>
                    <div className="flex justify-between">
                      <div>
                        <Badge className="mb-2">{selectedProjectData?.category}</Badge>
                        <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                          {selectedProjectData?.title}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                          <Globe className="size-4" /> {selectedProjectData?.location}
                        </CardDescription>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedProject(null)}
                        className="hover:bg-gray-200 dark:hover:bg-gray-700"
                      >
                        Back to Projects
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="overflow-hidden rounded-lg shadow-md">
                      <img
                        src={selectedProjectData?.image || "/placeholder.svg"}
                        alt={selectedProjectData?.title}
                        className="h-auto w-full object-cover"
                      />
                    </div>

                    {/* Project Description */}
                    <div>
                      <h3 className="mb-2 font-medium text-gray-900 dark:text-white">Project Description</h3>
                      <p className="text-gray-600 dark:text-gray-300">{selectedProjectData?.description}</p>
                    </div>

                    {/* Expected Impact */}
                    <div>
                      <h3 className="mb-2 font-medium text-gray-900 dark:text-white">Expected Impact</h3>
                      <div className="rounded-lg bg-green-50 p-3 text-green-800 dark:bg-green-900 dark:text-green-200">
                        {selectedProjectData?.impact}
                      </div>
                    </div>

                    {/* Funding Progress */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Funding Progress</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          ${selectedProjectData?.raised.toLocaleString()} of $
                          {selectedProjectData?.goal.toLocaleString()}
                        </span>
                      </div>
                      <Progress
                        value={((selectedProjectData?.raised || 0) / (selectedProjectData?.goal || 1)) * 100}
                        className="h-2"
                      />
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">{selectedProjectData?.backers} backers</span>
                        <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                          <Calendar className="size-4" /> {selectedProjectData?.daysLeft} days left
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Donation Section */}
              <div>
                <Card className="shadow-lg dark:bg-gray-800 dark:border-gray-700">
                  <CardHeader>
                    <CardTitle>Make a Donation</CardTitle>
                    <CardDescription>Support this project with your contribution</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Donation Amount */}
                    <div className="space-y-2">
                      <Label>Donation Amount (USDC)</Label>
                      <div className="relative">
                        <Input
                          type="number"
                          value={donationAmount}
                          onChange={(e) => setDonationAmount(Number(e.target.value))}
                          className="pl-6"
                        />
                        <div className="absolute inset-y-0 left-0 flex items-center pl-2 text-gray-500 dark:text-gray-300">$</div>
                      </div>
                    </div>

                    {/* Slider for Amount */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Amount</Label>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">${donationAmount}</span>
                      </div>
                      <Slider
                        defaultValue={[100]}
                        min={10}
                        max={1000}
                        step={10}
                        value={[donationAmount]}
                        onValueChange={(value) => setDonationAmount(value[0])}
                        className="py-4"
                      />
                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>$10</span>
                        <span>$100</span>
                        <span>$1000</span>
                      </div>
                    </div>

                    {/* Your Impact */}
                    <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700 dark:text-gray-300">
                      <h4 className="mb-3 font-medium text-gray-900 dark:text-white">Your Impact</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="size-4 text-green-600" />
                          <span className="text-gray-600 dark:text-gray-400">
                            {donationAmount >= 100
                              ? `Provides clean water for ${Math.floor(donationAmount / 10)} people`
                              : "Helps provide clean water access"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="size-4 text-green-600" />
                          <span className="text-gray-600 dark:text-gray-400">Transparent tracking of your donation</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="size-4 text-green-600" />
                          <span className="text-gray-600 dark:text-gray-400">Receive impact NFT as proof of contribution</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-primary text-primary-foreground hover:opacity-90 dark:bg-primary dark:text-black dark:hover:opacity-80">
                      Donate Now
                      <Heart className="ml-2 size-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          ) : (
            <>
              {/* Projects Listing */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {aidProjects.map((project) => (
                  <Card key={project.id} className="overflow-hidden dark:bg-gray-800 dark:border-gray-700">
                    <div className="aspect-video w-full overflow-hidden">
                      <img
                        src={project.image || "/placeholder.svg"}
                        alt={project.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <Badge>{project.category}</Badge>
                        <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                          <Calendar className="size-4" /> {project.daysLeft} days left
                        </div>
                      </div>
                      <CardTitle className="text-lg text-gray-900 dark:text-white">{project.title}</CardTitle>
                      <CardDescription className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                        <Globe className="size-4" /> {project.location}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 pb-3">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                          <span>Raised: ${project.raised.toLocaleString()}</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {Math.round((project.raised / project.goal) * 100)}%
                          </span>
                        </div>
                        <Progress value={(project.raised / project.goal) * 100} className="h-2" />
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                        <span>Goal: ${project.goal.toLocaleString()}</span>
                        <span>{project.backers} backers</span>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        className="w-full bg-primary text-primary-foreground hover:opacity-90 dark:bg-primary dark:text-black dark:hover:opacity-80"
                        onClick={() => setSelectedProject(project.id)}
                      >
                        Support Project
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>

              {/* Completed Projects */}
              <div>
                <h2 className="mb-4 font-display text-xl font-bold text-gray-900 dark:text-white">Completed Projects</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {completedProjects.map((project) => (
                    <Card key={project.id} className="dark:bg-gray-800 dark:border-gray-700">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg text-gray-900 dark:text-white">{project.title}</CardTitle>
                          <Badge variant="outline" className="bg-green-50 text-green-600 dark:bg-green-900 dark:text-green-200">
                            Completed
                          </Badge>
                        </div>
                        <CardDescription className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                          <Globe className="size-4" /> {project.location}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex gap-4">
                          <div className="size-16 overflow-hidden rounded-md bg-gray-100">
                            <img
                              src={project.image || "/placeholder.svg"}
                              alt={project.title}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                              <span>Raised</span>
                              <span className="font-medium text-gray-900 dark:text-white">
                                ${project.raised.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                              <span>Backers</span>
                              <span className="font-medium text-gray-900 dark:text-white">{project.backers}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                              <span>Completed</span>
                              <span className="font-medium text-gray-900 dark:text-white">{project.completionDate}</span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 rounded-lg bg-green-50 p-2 text-sm text-green-800 dark:bg-green-900 dark:text-green-200">
                          <div className="flex items-start gap-1">
                            <CheckCircle2 className="mt-0.5 size-4 flex-shrink-0" />
                            <span>{project.impact}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </>
          )}
        </TabsContent>


        <TabsContent value="governance" className="space-y-8">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Active Proposals</CardTitle>
                  <CardDescription>Vote on community funding proposals</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {proposals.map((proposal) => (
                    <div key={proposal.id} className="rounded-lg border border-gray-200 p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">{proposal.title}</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span>By {proposal.creator}</span>
                            <span>•</span>
                            <Badge variant="outline">{proposal.category}</Badge>
                          </div>
                        </div>
                        <Badge className="bg-blue-50 text-blue-600">{proposal.status}</Badge>
                      </div>
                      <p className="mb-3 text-sm text-gray-600">{proposal.description}</p>
                      <div className="mb-3 flex items-center justify-between text-sm">
                        <span className="text-gray-500">Requested: ${proposal.requestedAmount.toLocaleString()}</span>
                        <span className="flex items-center gap-1 text-gray-500">
                          <Calendar className="size-4" /> Ends: {proposal.endDate}
                        </span>
                      </div>
                      <div className="mb-3 space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Votes</span>
                          <span className="font-medium text-gray-900">
                            {Math.round((proposal.votes.yes / (proposal.votes.yes + proposal.votes.no)) * 100)}% in
                            favor
                          </span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                          <div
                            className="h-full bg-gradient-to-r from-[#00A3FF] to-[#4ADE80]"
                            style={{
                              width: `${(proposal.votes.yes / (proposal.votes.yes + proposal.votes.no)) * 100}%`,
                            }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>Yes: {proposal.votes.yes}</span>
                          <span>No: {proposal.votes.no}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button className="flex-1 bg-green-600 hover:bg-green-700">
                          <ThumbsUp className="mr-2 size-4" /> Vote Yes
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                        >
                          <ThumbsDown className="mr-2 size-4" /> Vote No
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Submit a Proposal</CardTitle>
                  <CardDescription>Create a new funding proposal for the community to vote on</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="proposal-title">Proposal Title</Label>
                    <Input id="proposal-title" placeholder="Enter a clear, descriptive title" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="proposal-category">Category</Label>
                    <Select defaultValue="environment">
                      <SelectTrigger id="proposal-category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="environment">Environment</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="economic">Economic</SelectItem>
                        <SelectItem value="humanitarian">Humanitarian</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="proposal-amount">Requested Amount (USDC)</Label>
                    <Input id="proposal-amount" type="number" placeholder="Enter amount" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="proposal-description">Description</Label>
                    <textarea
                      id="proposal-description"
                      className="min-h-[100px] w-full rounded-md border border-gray-300 p-2"
                      placeholder="Describe your proposal, its goals, and expected impact"
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-primary text-primary-foreground hover:opacity-90">
                    Submit Proposal
                    <ArrowRight className="ml-2 size-4" />
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Voting Power</CardTitle>
                  <CardDescription>Your influence in governance decisions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg bg-blue-50 p-4 text-center">
                    <div className="text-3xl font-bold text-blue-600">1,250</div>
                    <div className="text-sm text-blue-600">Voting Power</div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">From Token Holdings</span>
                      <span className="font-medium text-gray-900">850</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">From Staked Assets</span>
                      <span className="font-medium text-gray-900">400</span>
                    </div>
                  </div>
                  <div className="rounded-lg border border-gray-200 p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">Voting History</span>
                      <Badge variant="outline">12 Votes</Badge>
                    </div>
                    <div className="mt-2 text-sm text-gray-600">
                      You've participated in 12 out of 15 recent proposals (80% participation rate)
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Increase Voting Power
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Governance Stats</CardTitle>
                  <CardDescription>Community participation metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg bg-gray-50 p-3 text-center">
                      <div className="text-xl font-bold text-gray-900">15</div>
                      <div className="text-sm text-gray-500">Active Proposals</div>
                    </div>
                    <div className="rounded-lg bg-gray-50 p-3 text-center">
                      <div className="text-xl font-bold text-gray-900">3,450</div>
                      <div className="text-sm text-gray-500">Total Voters</div>
                    </div>
                    <div className="rounded-lg bg-gray-50 p-3 text-center">
                      <div className="text-xl font-bold text-gray-900">$1.2M</div>
                      <div className="text-sm text-gray-500">Funds Allocated</div>
                    </div>
                    <div className="rounded-lg bg-gray-50 p-3 text-center">
                      <div className="text-xl font-bold text-gray-900">72%</div>
                      <div className="text-sm text-gray-500">Approval Rate</div>
                    </div>
                  </div>
                  <div className="rounded-lg border border-gray-200 p-3">
                    <h4 className="mb-2 font-medium text-gray-900">Recent Decisions</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center justify-between">
                        <span className="text-gray-600">Healthcare Initiative</span>
                        <Badge variant="outline" className="bg-green-50 text-green-600">
                          Passed
                        </Badge>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-gray-600">Education Fund</span>
                        <Badge variant="outline" className="bg-green-50 text-green-600">
                          Passed
                        </Badge>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-gray-600">Infrastructure Project</span>
                        <Badge variant="outline" className="bg-red-50 text-red-600">
                          Rejected
                        </Badge>
                      </li>
                    </ul>
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
