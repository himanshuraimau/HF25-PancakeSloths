"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Shield,
  CheckCircle2,
  Clock,
  Search,
  FileText,
  ExternalLink,
  AlertCircle,
  Lock,
  Eye,
  Fingerprint,
  BarChart3,
} from "lucide-react"
import { TrustScoreChart } from "@/components/trust-score-chart"

export function TrustTransparency() {
  const [activeTab, setActiveTab] = useState("verification")
  const [searchQuery, setSearchQuery] = useState("")

  const verificationStatus = {
    identity: { status: "verified", date: "March 15, 2024" },
    assets: { status: "verified", date: "April 2, 2024" },
    compliance: { status: "verified", date: "March 28, 2024" },
    security: { status: "pending", date: "In progress" },
  }

  const transactions = [
    {
      id: "0x8a7c...3f9b",
      type: "Tokenization",
      asset: "Skyline Tower",
      amount: "$125,000",
      date: "April 12, 2024",
      status: "Completed",
      trustScore: 98,
    },
    {
      id: "0x3d2e...7a1c",
      type: "Trade",
      asset: "DGART/USDC",
      amount: "$47,500",
      date: "April 10, 2024",
      status: "Completed",
      trustScore: 95,
    },
    {
      id: "0x5f8b...2d4e",
      type: "Loan",
      asset: "CARB",
      amount: "$32,750",
      date: "April 8, 2024",
      status: "Active",
      trustScore: 92,
    },
    {
      id: "0x1a9c...6e3b",
      type: "Donation",
      asset: "Clean Water Initiative",
      amount: "$5,000",
      date: "April 5, 2024",
      status: "Completed",
      trustScore: 99,
    },
  ]

  const auditReports = [
    {
      id: 1,
      title: "Smart Contract Security Audit",
      auditor: "BlockSec",
      date: "March 2024",
      findings: { critical: 0, high: 0, medium: 2, low: 3 },
      status: "Resolved",
    },
    {
      id: 2,
      title: "Tokenization Protocol Audit",
      auditor: "ChainGuard",
      date: "February 2024",
      findings: { critical: 0, high: 1, medium: 3, low: 5 },
      status: "Resolved",
    },
    {
      id: 3,
      title: "Governance Mechanism Audit",
      auditor: "SecureDAO",
      date: "January 2024",
      findings: { critical: 0, high: 0, medium: 1, low: 2 },
      status: "Resolved",
    },
  ]

  const filteredTransactions = searchQuery
    ? transactions.filter(
      (tx) =>
        tx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.asset.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.type.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    : transactions

  return (
    <div className="container py-8">
      <div className="mb-8 text-center">
        <Badge className="mb-2 bg-primary/20 text-primary hover:bg-primary/20 dark:bg-primary/20 dark:text-primary hover:dark:bg-primary/20">Trust & Transparency</Badge>
        <h1 className="font-display text-3xl font-bold text-gray-900 md:text-4xl dark:text-white">Verified Security</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Ensuring trust and transparency in the UnityVault ecosystem</p>
      </div>


      <div className="mb-12 grid gap-8 md:grid-cols-2">
        <div className="flex flex-col justify-center space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white">Trust Score: 95/100</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Your UnityVault Trust Score reflects the security and reliability of your account and assets. Higher
              scores provide greater access to platform features and better rates.
            </p>
          </motion.div>

          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-lg border border-gray-200 bg-white p-4 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-800">
                <Shield className="size-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-medium text-gray-900 dark:text-white">100%</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Verified</p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-4 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-800">
                <Lock className="size-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-medium text-gray-900 dark:text-white">A+</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Security</p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-4 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-800">
                <Eye className="size-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-medium text-gray-900 dark:text-white">100%</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Transparency</p>
            </div>
          </div>

          <Button className="w-fit bg-primary text-primary-foreground hover:opacity-90 dark:bg-primary/80 dark:text-primary-foreground dark:hover:bg-primary/70">
            Improve Your Trust Score
          </Button>
        </div>

        <div className="h-[300px] rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h3 className="mb-4 font-medium text-gray-900 dark:text-white">Trust Score History</h3>
          <TrustScoreChart />
        </div>
      </div>


      <Tabs defaultValue="verification" onValueChange={setActiveTab} className="space-y-8">
        <div className="flex justify-center">
          <TabsList className="grid w-[600px] grid-cols-3">
            <TabsTrigger
              value="verification"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Verification Status
            </TabsTrigger>
            <TabsTrigger
              value="transactions"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Transaction History
            </TabsTrigger>
            <TabsTrigger
              value="audits"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Audit Reports
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="verification" className="space-y-8">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Identity Verification Card */}
            <Card>
              <CardHeader>
                <CardTitle>Identity Verification</CardTitle>
                <CardDescription>Personal identity verification status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex size-10 items-center justify-center rounded-full ${verificationStatus.identity.status === "verified" ? "bg-green-100" : "bg-yellow-100"}`}
                    >
                      {verificationStatus.identity.status === "verified" ? (
                        <CheckCircle2 className="size-5 text-green-600" />
                      ) : (
                        <Clock className="size-5 text-yellow-600" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {verificationStatus.identity.status === "verified" ? "Verified" : "Pending"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {verificationStatus.identity.status === "verified"
                          ? `Completed on ${verificationStatus.identity.date}`
                          : verificationStatus.identity.date}
                      </div>
                    </div>
                  </div>
                  <Badge
                    className={
                      verificationStatus.identity.status === "verified"
                        ? "bg-green-50 text-green-600"
                        : "bg-yellow-50 text-yellow-600"
                    }
                  >
                    {verificationStatus.identity.status === "verified" ? "Verified" : "Pending"}
                  </Badge>
                </div>

                {/* Verified Information */}
                <div className="rounded-lg bg-gray-50 p-3">
                  <h4 className="mb-2 font-medium text-gray-900">Verified Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Name</span>
                      <span className="font-medium text-gray-900">John Doe</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Email</span>
                      <span className="font-medium text-gray-900">j***@example.com</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Phone</span>
                      <span className="font-medium text-gray-900">+1 *** *** 1234</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Address</span>
                      <span className="font-medium text-gray-900">Verified</span>
                    </div>
                  </div>
                </div>

                {/* Biometric Verification */}
                <div className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
                  <div className="flex items-center gap-2">
                    <Fingerprint className="size-5 text-blue-600" />
                    <span className="font-medium text-gray-900 dark:text-white">Biometric Verification</span>
                  </div>
                  <Badge className="bg-green-50 text-green-600">Completed</Badge>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Update Information
                </Button>
              </CardFooter>
            </Card>

            {/* Asset Verification Card */}
            <Card>
              <CardHeader>
                <CardTitle>Asset Verification</CardTitle>
                <CardDescription>Verification of tokenized assets</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex size-10 items-center justify-center rounded-full ${verificationStatus.assets.status === "verified" ? "bg-green-100" : "bg-yellow-100"}`}
                    >
                      {verificationStatus.assets.status === "verified" ? (
                        <CheckCircle2 className="size-5 text-green-600" />
                      ) : (
                        <Clock className="size-5 text-yellow-600" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {verificationStatus.assets.status === "verified" ? "Verified" : "Pending"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {verificationStatus.assets.status === "verified"
                          ? `Last updated on ${verificationStatus.assets.date}`
                          : verificationStatus.assets.date}
                      </div>
                    </div>
                  </div>
                  <Badge
                    className={
                      verificationStatus.assets.status === "verified"
                        ? "bg-green-50 text-green-600"
                        : "bg-yellow-50 text-yellow-600"
                    }
                  >
                    {verificationStatus.assets.status === "verified" ? "Verified" : "Pending"}
                  </Badge>
                </div>

                {/* Assets List */}
                <div className="space-y-3">
                  <div className="rounded-lg border border-gray-200 p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <div className="font-medium text-gray-900 dark:text-white">Skyline Tower</div>
                      <Badge className="bg-green-50 text-green-600">Verified</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Ownership</span>
                      <span className="font-medium text-gray-900">Verified</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Valuation</span>
                      <span className="font-medium text-gray-900">Verified</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Legal Status</span>
                      <span className="font-medium text-gray-900">Clear</span>
                    </div>
                  </div>

                  <div className="rounded-lg border border-gray-200 p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <div className="font-medium text-gray-900 dark:text-white">Digital Masterpiece</div>
                      <Badge className="bg-green-50 text-green-600">Verified</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Authenticity</span>
                      <span className="font-medium text-gray-900">Verified</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Provenance</span>
                      <span className="font-medium text-gray-900">Verified</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Copyright</span>
                      <span className="font-medium text-gray-900">Verified</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View All Assets
                </Button>
              </CardFooter>
            </Card>

            {/* Compliance Verification Card */}
            <Card>
              <CardHeader>
                <CardTitle>Compliance Verification</CardTitle>
                <CardDescription>Regulatory compliance status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex size-10 items-center justify-center rounded-full ${verificationStatus.compliance.status === "verified" ? "bg-green-100" : "bg-yellow-100"}`}
                    >
                      {verificationStatus.compliance.status === "verified" ? (
                        <CheckCircle2 className="size-5 text-green-600" />
                      ) : (
                        <Clock className="size-5 text-yellow-600" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {verificationStatus.compliance.status === "verified" ? "Verified" : "Pending"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {verificationStatus.compliance.status === "verified"
                          ? `Completed on ${verificationStatus.compliance.date}`
                          : verificationStatus.compliance.date}
                      </div>
                    </div>
                  </div>
                  <Badge
                    className={
                      verificationStatus.compliance.status === "verified"
                        ? "bg-green-50 text-green-600"
                        : "bg-yellow-50 text-yellow-600"
                    }
                  >
                    {verificationStatus.compliance.status === "verified" ? "Verified" : "Pending"}
                  </Badge>
                </div>

                {/* Compliance Status */}
                <div className="rounded-lg bg-gray-50 p-3">
                  <h4 className="mb-2 font-medium text-gray-900">Compliance Status</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">KYC/AML</span>
                      <span className="font-medium text-green-600">Passed</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Accredited Investor</span>
                      <span className="font-medium text-green-600">Verified</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Tax Compliance</span>
                      <span className="font-medium text-green-600">Verified</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Jurisdiction</span>
                      <span className="font-medium text-gray-900">United States</span>
                    </div>
                  </div>
                </div>

                {/* Compliance Documents */}
                <div className="rounded-lg border border-gray-200 p-3">
                  <div className="flex items-center gap-2">
                    <FileText className="size-5 text-blue-600" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Compliance Documents</div>
                      <div className="text-sm text-gray-500">
                        All required documents have been submitted and verified
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Update Compliance Info
                </Button>
              </CardFooter>
            </Card>

            {/* Security Verification Card */}
            <Card>
              <CardHeader>
                <CardTitle>Security Verification</CardTitle>
                <CardDescription>Account security status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex size-10 items-center justify-center rounded-full ${verificationStatus.security.status === "verified" ? "bg-green-100" : "bg-yellow-100"}`}
                    >
                      {verificationStatus.security.status === "verified" ? (
                        <CheckCircle2 className="size-5 text-green-600" />
                      ) : (
                        <Clock className="size-5 text-yellow-600" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {verificationStatus.security.status === "verified" ? "Verified" : "Pending"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {verificationStatus.security.status === "verified"
                          ? `Last updated on ${verificationStatus.security.date}`
                          : verificationStatus.security.date}
                      </div>
                    </div>
                  </div>
                  <Badge
                    className={
                      verificationStatus.security.status === "verified"
                        ? "bg-green-50 text-green-600"
                        : "bg-yellow-50 text-yellow-600"
                    }
                  >
                    {verificationStatus.security.status === "verified" ? "Verified" : "Pending"}
                  </Badge>
                </div>

                {/* Security Settings */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
                    <div className="flex items-center gap-2">
                      <Lock className="size-5 text-blue-600" />
                      <span className="font-medium text-gray-900 dark:text-white">Two-Factor Authentication</span>
                    </div>
                    <Badge className="bg-green-50 text-green-600">Enabled</Badge>
                  </div>

                  <div className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
                    <div className="flex items-center gap-2">
                      <Shield className="size-5 text-blue-600" />
                      <span className="font-medium text-gray-900 dark:text-white">Hardware Wallet</span>
                    </div>
                    <Badge className="bg-green-50 text-green-600">Connected</Badge>
                  </div>

                  <div className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="size-5 text-yellow-600" />
                      <span className="font-medium text-gray-900 dark:text-white">Recovery Options</span>
                    </div>
                    <Badge className="bg-yellow-50 text-yellow-600">Incomplete</Badge>
                  </div>
                </div>

                <div className="rounded-lg bg-blue-50 p-3 text-sm text-blue-800">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="mt-0.5 size-4 flex-shrink-0" />
                    <p>
                      Complete your security verification by setting up recovery options to achieve a 100% security
                      score.
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-primary text-primary-foreground hover:opacity-90">
                  Complete Security Setup
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>


        <TabsContent value="transactions" className="space-y-8">
          <Card className="bg-gray-800 text-white">
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="text-white">Transaction History</CardTitle>
                  <CardDescription className="text-gray-400">View and verify your transaction history</CardDescription>
                </div>
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-2.5 top-2.5 size-4 text-gray-400" />
                  <Input
                    placeholder="Search transactions..."
                    className="pl-8 bg-gray-700 text-white placeholder-gray-400"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="bg-gray-800">
              <div className="space-y-4">
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((tx) => (
                    <div key={tx.id} className="rounded-lg border border-gray-700 p-4">
                      <div className="mb-3 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-white">
                              {tx.type}: {tx.asset}
                            </h3>
                            <Badge
                              className={
                                tx.status === "Completed"
                                  ? "bg-green-50 text-green-600"
                                  : "bg-blue-50 text-blue-600"
                              }
                            >
                              {tx.status}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-400">{tx.id}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-white">{tx.amount}</div>
                          <div className="text-sm text-gray-400">{tx.date}</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <BarChart3 className="size-4 text-blue-600" />
                          <span className="text-sm text-gray-400">Trust Score:</span>
                          <div className="flex items-center gap-1">
                            <span className="font-medium text-white">{tx.trustScore}/100</span>
                            <div className="h-2 w-16 rounded-full bg-gray-600">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-[#00A3FF] to-[#4ADE80]"
                                style={{ width: `${tx.trustScore}%` }}
                              />
                            </div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="gap-1">
                          <ExternalLink className="size-4" />
                          View
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-lg border border-dashed border-gray-600 p-8 text-center">
                    <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-gray-700">
                      <Search className="size-6 text-gray-400" />
                    </div>
                    <h3 className="mb-2 text-lg font-medium text-white">No Transactions Found</h3>
                    <p className="text-sm text-gray-400">
                      No transactions match your search criteria. Try adjusting your search or view all transactions.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between bg-gray-800">
              <Button variant="outline" className="text-gray-400 hover:bg-gray-700">
                Export History
              </Button>
              <Button variant="outline" className="text-gray-400 hover:bg-gray-700">
                View All
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>


        <TabsContent value="audits" className="space-y-8">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Security Audit Reports</CardTitle>
                  <CardDescription>Independent security audits of the UnityVault platform</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {auditReports.map((report) => (
                    <div key={report.id} className="rounded-lg border border-gray-200 p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">{report.title}</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span>By {report.auditor}</span>
                            <span>•</span>
                            <span>{report.date}</span>
                          </div>
                        </div>
                        <Badge className="bg-green-50 text-green-600">{report.status}</Badge>
                      </div>
                      <div className="mb-3 grid grid-cols-4 gap-2">
                        <div className="rounded-lg bg-red-50 p-2 text-center">
                          <div className="font-medium text-red-600">{report.findings.critical}</div>
                          <div className="text-xs text-red-600">Critical</div>
                        </div>
                        <div className="rounded-lg bg-orange-50 p-2 text-center">
                          <div className="font-medium text-orange-600">{report.findings.high}</div>
                          <div className="text-xs text-orange-600">High</div>
                        </div>
                        <div className="rounded-lg bg-yellow-50 p-2 text-center">
                          <div className="font-medium text-yellow-600">{report.findings.medium}</div>
                          <div className="text-xs text-yellow-600">Medium</div>
                        </div>
                        <div className="rounded-lg bg-blue-50 p-2 text-center">
                          <div className="font-medium text-blue-600">{report.findings.low}</div>
                          <div className="text-xs text-blue-600">Low</div>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button variant="outline" size="sm" className="gap-1">
                          <FileText className="size-4" />
                          View Full Report
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Security</CardTitle>
                  <CardDescription>Current security status</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg bg-green-50 p-4 text-center">
                    <div className="text-3xl font-bold text-green-600">A+</div>
                    <div className="text-sm text-green-600">Security Rating</div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Smart Contracts</span>
                      <span className="font-medium text-green-600">Audited</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Bug Bounty</span>
                      <span className="font-medium text-green-600">Active</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Insurance</span>
                      <span className="font-medium text-green-600">$10M Coverage</span>
                    </div>
                  </div>
                  <div className="rounded-lg border border-gray-200 p-3">
                    <h4 className="mb-2 font-medium text-gray-900">Security Measures</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="size-4 text-green-600" />
                        <span className="text-gray-600">Multi-signature wallets</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="size-4 text-green-600" />
                        <span className="text-gray-600">Timelock mechanisms</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="size-4 text-green-600" />
                        <span className="text-gray-600">Formal verification</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="size-4 text-green-600" />
                        <span className="text-gray-600">Regular security audits</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Security Documentation
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Transparency Report</CardTitle>
                  <CardDescription>Platform transparency metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg bg-gray-50 p-3 text-center">
                      <div className="text-xl font-bold text-gray-900">100%</div>
                      <div className="text-sm text-gray-500">Open Source</div>
                    </div>
                    <div className="rounded-lg bg-gray-50 p-3 text-center">
                      <div className="text-xl font-bold text-gray-900">100%</div>
                      <div className="text-sm text-gray-500">On-Chain Data</div>
                    </div>
                    <div className="rounded-lg bg-gray-50 p-3 text-center">
                      <div className="text-xl font-bold text-gray-900">Weekly</div>
                      <div className="text-sm text-gray-500">Updates</div>
                    </div>
                    <div className="rounded-lg bg-gray-50 p-3 text-center">
                      <div className="text-xl font-bold text-gray-900">Public</div>
                      <div className="text-sm text-gray-500">Governance</div>
                    </div>
                  </div>
                  <div className="rounded-lg border border-gray-200 p-3">
                    <h4 className="mb-2 font-medium text-gray-900">Recent Updates</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center justify-between">
                        <span className="text-gray-600">Security Upgrade</span>
                        <span className="text-gray-900">April 10, 2024</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-gray-600">Governance Update</span>
                        <span className="text-gray-900">April 5, 2024</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-gray-600">Protocol Audit</span>
                        <span className="text-gray-900">March 28, 2024</span>
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
