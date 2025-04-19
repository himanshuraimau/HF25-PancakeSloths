"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Clock, ArrowRight, AlertTriangle, Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { InterestRateChart } from "@/components/interest-rate-chart"

export function LendingPortal() {
  const [activeTab, setActiveTab] = useState("lend")
  const [selectedAsset, setSelectedAsset] = useState("SKY")
  const [amount, setAmount] = useState(1000)
  const [term, setTerm] = useState(30)
  const [collateralRatio, setCollateralRatio] = useState(150)

  const assets = [
    {
      symbol: "SKY",
      name: "Skyline Tower",
      apy: 5.2,
      tvl: "$2.45M",
      available: "$1.2M",
      collateralFactor: 0.7,
      price: "$1.05",
      icon: "/placeholder.svg?height=40&width=40",
    },
    {
      symbol: "DGART",
      name: "Digital Masterpiece",
      apy: 3.8,
      tvl: "$875K",
      available: "$450K",
      collateralFactor: 0.5,
      price: "$0.95",
      icon: "/placeholder.svg?height=40&width=40",
    },
    {
      symbol: "CARB",
      name: "Carbon Credits",
      apy: 6.5,
      tvl: "$1.1M",
      available: "$650K",
      collateralFactor: 0.6,
      price: "$1.12",
      icon: "/placeholder.svg?height=40&width=40",
    },
    {
      symbol: "TPAT",
      name: "Tech Patent",
      apy: 4.2,
      tvl: "$1.8M",
      available: "$950K",
      collateralFactor: 0.65,
      price: "$1.03",
      icon: "/placeholder.svg?height=40&width=40",
    },
  ]

  const selectedAssetData = assets.find((a) => a.symbol === selectedAsset) || assets[0]

  const calculateInterest = (principal: number, rate: number, days: number) => {
    return principal * (rate / 100) * (days / 365)
  }

  const interest = calculateInterest(amount, selectedAssetData.apy, term)
  const totalReturn = amount + interest

  const calculateLoanAmount = (collateralAmount: number, collateralRatio: number) => {
    return collateralAmount * (100 / collateralRatio)
  }

  const loanAmount = calculateLoanAmount(amount, collateralRatio)
  const healthFactor = collateralRatio / 100
  const liquidationThreshold = amount * 0.825 // 82.5% of collateral value

  const getRiskLevel = (ratio: number) => {
    if (ratio >= 175) return { level: "Low", color: "text-green-600" }
    if (ratio >= 150) return { level: "Medium", color: "text-yellow-600" }
    return { level: "High", color: "text-red-600" }
  }

  const riskLevel = getRiskLevel(collateralRatio)

  const activeLoans = [
    {
      id: 1,
      asset: "SKY",
      amount: 5000,
      collateral: "USDC",
      collateralAmount: 7500,
      healthFactor: 1.5,
      interestRate: 4.8,
      timeRemaining: "25 days",
    },
    {
      id: 2,
      asset: "TPAT",
      amount: 2500,
      collateral: "USDC",
      collateralAmount: 4000,
      healthFactor: 1.6,
      interestRate: 3.9,
      timeRemaining: "12 days",
    },
  ]

  const activeDeposits = [
    {
      id: 1,
      asset: "CARB",
      amount: 3500,
      apy: 6.5,
      interest: 227.5,
      timeRemaining: "30 days",
    },
    {
      id: 2,
      asset: "DGART",
      amount: 1800,
      apy: 3.8,
      interest: 68.4,
      timeRemaining: "15 days",
    },
  ]

  return (
    <div className="container py-8">
      <div className="mb-8 text-center">
        <Badge className="mb-2 bg-primary/20 text-primary hover:bg-primary/20 dark:bg-primary/10 dark:text-primary/90 dark:hover:bg-primary/20">
          Lending Portal
        </Badge>
        <h1 className="font-display text-3xl font-bold text-gray-900 md:text-4xl dark:text-white">
          Lend & Borrow Assets
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Earn interest on your assets or get a loan using your tokens as collateral
        </p>
      </div>


      <Tabs defaultValue="lend" onValueChange={setActiveTab} className="space-y-8">
        <div className="flex justify-center">
          <TabsList className="grid w-[400px] grid-cols-2">
            <TabsTrigger
              value="lend"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Lend Assets
            </TabsTrigger>
            <TabsTrigger
              value="borrow"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Borrow Assets
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="lend" className="space-y-8">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2">
              <Card className="rounded-2xl shadow-sm hover:shadow-lg transition-shadow border border-transparent hover:border-purple-500 dark:hover:border-teal-400 bg-gradient-to-br from-primary/5 to-background p-4">
                <CardHeader>
                  <CardTitle className="text-primary dark:text-white font-semibold font-montserrat">Lend Your Assets</CardTitle>
                  <CardDescription className="text-primary/70 dark:text-white/70">Earn interest by lending your tokenized assets</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Select Asset</Label>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                      {assets.map((asset) => (
                        <div
                          key={asset.symbol}
                          className={`flex cursor-pointer flex-col items-center rounded-2xl border p-3 transition-all transform hover:scale-105 hover:border-purple-500 dark:hover:border-teal-400 hover:bg-primary/10 ${selectedAsset === asset.symbol ? "border-purple-500 dark:border-teal-400 bg-primary/10" : "border-border"
                            }`}
                          onClick={() => setSelectedAsset(asset.symbol)}
                        >
                          <div className="mb-2 w-12 h-12 rounded-full bg-gradient-to-br from-teal-200 to-purple-300 dark:from-purple-300 dark:to-teal-200 flex items-center justify-center">
                            <img src={asset.icon || "/placeholder.svg"} alt={asset.name} className="h-6 w-6" />
                          </div>
                          <div className="text-center">
                            <div className="font-medium text-primary dark:text-white">{asset.symbol}</div>
                            <div className="text-xs text-green-600">{asset.apy}% APY</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount to Lend</Label>
                    <div className="relative">
                      <Input
                        id="amount"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        className="pr-16"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm text-gray-500 dark:text-white/70">
                        {selectedAsset}
                      </div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 dark:text-white/60">
                      <span>Available: 10,000 {selectedAsset}</span>
                      <button className="text-purple-600 dark:text-teal-400" onClick={() => setAmount(10000)}>
                        Max
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Lending Term</Label>
                      <span className="text-sm font-medium text-primary dark:text-white">{term} days</span>
                    </div>
                    <Slider
                      defaultValue={[30]}
                      min={1}
                      max={365}
                      step={1}
                      value={[term]}
                      onValueChange={(value) => setTerm(value[0])}
                      className="py-4"
                    />
                    <div className="flex justify-between text-xs text-gray-500 dark:text-white/60">
                      <span>1 day</span>
                      <span>30 days</span>
                      <span>90 days</span>
                      <span>365 days</span>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-primary/5 dark:bg-white/10 p-4">
                    <h4 className="mb-4 font-medium text-primary dark:text-white">Lending Summary</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-primary/80 dark:text-white/70">Asset</span>
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-teal-200 to-purple-300 dark:from-purple-300 dark:to-teal-200">
                            <img
                              src={selectedAssetData.icon || "/placeholder.svg"}
                              alt={selectedAssetData.name}
                              className="h-full w-full"
                            />
                          </div>
                          <span className="font-medium text-primary dark:text-white">{selectedAssetData.name}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-primary/80 dark:text-white/70">Principal Amount</span>
                        <span className="font-medium text-primary dark:text-white">
                          {amount.toLocaleString()} {selectedAsset}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-primary/80 dark:text-white/70">APY</span>
                        <span className="font-medium text-green-600">{selectedAssetData.apy}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-primary/80 dark:text-white/70">Term</span>
                        <span className="font-medium text-primary dark:text-white">{term} days</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-primary/80 dark:text-white/70">Estimated Interest</span>
                        <span className="font-medium text-green-600">
                          +{interest.toFixed(2)} {selectedAsset}
                        </span>
                      </div>
                      <div className="flex items-center justify-between border-t border-gray-200 dark:border-white/10 pt-3">
                        <span className="text-primary dark:text-white">Total Return</span>
                        <span className="text-lg font-bold text-primary dark:text-white">
                          {totalReturn.toFixed(2)} {selectedAsset}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-primary text-white dark:text-black hover:opacity-90">
                    Lend {selectedAsset}
                    <ArrowRight className="ml-2 size-4" />
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="rounded-2xl shadow-sm p-4">
                <CardHeader>
                  <CardTitle className="text-primary dark:text-white font-semibold font-montserrat">Interest Rate</CardTitle>
                  <CardDescription className="text-primary/70 dark:text-white/70">Current rates for {selectedAssetData.name}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px]">
                    <InterestRateChart asset={selectedAssetData} />
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl shadow-sm p-4">
                <CardHeader>
                  <CardTitle className="text-primary dark:text-white font-semibold font-montserrat">Asset Information</CardTitle>
                  <CardDescription className="text-primary/70 dark:text-white/70">
                    {selectedAssetData.name} ({selectedAssetData.symbol})
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    ["Current Price", selectedAssetData.price],
                    ["Total Value Locked", selectedAssetData.tvl],
                    ["Available Liquidity", selectedAssetData.available],
                    ["Collateral Factor", `${selectedAssetData.collateralFactor * 100}%`]
                  ].map(([label, value], idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <span className="text-sm text-primary/70 dark:text-white/60">{label}</span>
                      <span className="font-medium text-primary dark:text-white">{value}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>

          {activeDeposits.length > 0 && (
            <div>
              <h2 className="mb-4 font-display text-xl font-bold text-primary dark:text-white">Your Active Deposits</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {activeDeposits.map((deposit) => (
                  <Card key={deposit.id} className="rounded-2xl p-4 shadow-sm">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg text-primary dark:text-white">{deposit.asset}</CardTitle>
                        <Badge variant="outline" className="bg-green-100 text-green-600">
                          {deposit.apy}% APY
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-primary/70 dark:text-white/60">Deposited Amount</span>
                          <span className="font-medium text-primary dark:text-white">
                            {deposit.amount.toLocaleString()} {deposit.asset}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-primary/70 dark:text-white/60">Accrued Interest</span>
                          <span className="font-medium text-green-600">
                            +{deposit.interest.toFixed(2)} {deposit.asset}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-primary/70 dark:text-white/60">Time Remaining</span>
                          <div className="flex items-center gap-1 text-sm text-primary dark:text-white">
                            <Clock className="size-4" />
                            {deposit.timeRemaining}
                          </div>
                        </div>
                        <div className="pt-2">
                          <div className="mb-1 flex items-center justify-between text-xs text-primary/60 dark:text-white/60">
                            <span>Term Progress</span>
                            <span>50%</span>
                          </div>
                          <Progress value={50} className="h-2" />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" size="sm">
                        Extend Term
                      </Button>
                      <Button variant="destructive" size="sm">
                        Withdraw Early
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="borrow" className="space-y-8">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2">
              <Card className="rounded-2xl shadow-sm hover:shadow-lg transition-shadow border border-transparent hover:border-purple-500 dark:hover:border-teal-400 bg-gradient-to-br from-primary/5 to-background p-4">
                <CardHeader>
                  <CardTitle className="font-semibold text-[#0B1D3A] dark:text-white">Borrow Against Collateral</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-300">Use your assets as collateral to get a loan</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-[#0B1D3A] dark:text-white">Select Collateral Asset</Label>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                      {assets.map((asset) => (
                        <div
                          key={asset.symbol}
                          className={`flex cursor-pointer flex-col items-center rounded-2xl border p-3 transition-all hover:scale-[1.02] hover:shadow-md hover:border-purple-400 dark:hover:border-teal-400 hover:bg-gradient-to-br hover:from-purple-100 hover:to-white dark:hover:from-teal-900 dark:hover:to-[#0B1D3A] ${selectedAsset === asset.symbol ? "border-purple-400 bg-purple-50 dark:border-teal-400 dark:bg-teal-950" : "border-gray-200 dark:border-gray-700"}`}
                          onClick={() => setSelectedAsset(asset.symbol)}
                        >
                          <div className="mb-2 w-12 h-12 rounded-full bg-gradient-to-tr from-teal-300 via-white to-purple-200 dark:from-purple-900 dark:via-[#0B1D3A] dark:to-teal-800 p-2 flex items-center justify-center">
                            <img src={asset.icon || "/placeholder.svg"} alt={asset.name} className="h-full w-full" />
                          </div>
                          <div className="text-center">
                            <div className="font-medium text-[#0B1D3A] dark:text-white">{asset.symbol}</div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">CF: {asset.collateralFactor * 100}%</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="collateral-amount" className="text-[#0B1D3A] dark:text-white">Collateral Amount</Label>
                    <div className="relative">
                      <Input
                        id="collateral-amount"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        className="pr-16 bg-white dark:bg-[#1E293B] text-[#0B1D3A] dark:text-white"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm text-gray-500 dark:text-gray-300">
                        {selectedAsset}
                      </div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>Available: 10,000 {selectedAsset}</span>
                      <button className="text-purple-600 dark:text-teal-300 hover:underline" onClick={() => setAmount(10000)}>
                        Max
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-[#0B1D3A] dark:text-white">Collateralization Ratio</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-300">
                              <span>{collateralRatio}%</span>
                              <Info className="size-4" />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs text-sm text-[#0B1D3A] dark:text-white">
                              Higher collateralization ratio means lower risk of liquidation but smaller loan amount. Minimum ratio is 125%.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Slider
                      defaultValue={[150]}
                      min={125}
                      max={200}
                      step={5}
                      value={[collateralRatio]}
                      onValueChange={(value) => setCollateralRatio(value[0])}
                      className="py-4"
                    />
                    <div className="flex justify-between text-xs">
                      <span className="text-red-600">High Risk (125%)</span>
                      <span className="text-yellow-600">Medium (150%)</span>
                      <span className="text-green-600">Low Risk (200%)</span>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-[#F8FAFC] dark:bg-[#1E293B] p-4">
                    <h4 className="mb-4 font-medium text-[#0B1D3A] dark:text-white">Loan Summary</h4>
                    <div className="space-y-3 text-[#0B1D3A] dark:text-white">
                      {/* Reuse existing structure, just update text colors below */}
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Collateral Asset</span>
                        <div className="flex items-center gap-2">
                          <div className="size-5 rounded-full bg-gray-100 dark:bg-gray-700">
                            <img src={selectedAssetData.icon || "/placeholder.svg"} alt={selectedAssetData.name} className="h-full w-full" />
                          </div>
                          <span className="font-medium">{selectedAssetData.name}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Collateral Amount</span>
                        <span className="font-medium">{amount.toLocaleString()} {selectedAsset}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Collateral Value</span>
                        <span className="font-medium">${(amount * Number.parseFloat(selectedAssetData.price.replace("$", ""))).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Collateralization Ratio</span>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{collateralRatio}%</span>
                          <Badge className={`${riskLevel.color} bg-opacity-10`}>{riskLevel.level} Risk</Badge>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Liquidation Threshold</span>
                        <span className="font-medium">${liquidationThreshold.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Interest Rate (APR)</span>
                        <span className="font-medium">{(selectedAssetData.apy * 0.8).toFixed(1)}%</span>
                      </div>
                      <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-3">
                        <span className="text-[#0B1D3A] dark:text-white">Available Loan Amount</span>
                        <span className="text-lg font-bold">${loanAmount.toFixed(2)} USDC</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-[#0B1D3A] text-white hover:opacity-90 hover:text-black">
                    Get Loan
                    <ArrowRight className="ml-2 size-4" />
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="rounded-2xl shadow-sm hover:shadow-lg transition-transform duration-200 hover:scale-[1.02] border border-transparent hover:border-purple-400 dark:hover:border-teal-400 bg-gradient-to-br from-[rgba(11,29,58,0.05)] via-white to-[#F8FAFC] dark:from-[rgba(31,198,193,0.05)] dark:via-[#0B1D3A] dark:to-[#0B1D3A]">
                {/* Keep same structure, just repeat above styling pattern */}
              </Card>

              <Card className="rounded-2xl shadow-sm hover:shadow-lg transition-transform duration-200 hover:scale-[1.02] border border-transparent hover:border-purple-400 dark:hover:border-teal-400 bg-gradient-to-br from-[rgba(11,29,58,0.05)] via-white to-[#F8FAFC] dark:from-[rgba(31,198,193,0.05)] dark:via-[#0B1D3A] dark:to-[#0B1D3A]">
                {/* Same here */}
              </Card>
            </div>
          </div>

          {/* Active loans section */}
          {activeLoans.length > 0 && (
            <div>
              <h2 className="mb-4 font-display text-xl font-bold text-[#0B1D3A] dark:text-white">Your Active Loans</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {activeLoans.map((loan) => (
                  <Card
                    key={loan.id}
                    className="rounded-2xl shadow-sm hover:shadow-lg transition-transform duration-200 hover:scale-[1.02] border border-transparent hover:border-purple-400 dark:hover:border-teal-400 bg-gradient-to-br from-[rgba(11,29,58,0.05)] via-white to-[#F8FAFC] dark:from-[rgba(31,198,193,0.05)] dark:via-[#0B1D3A] dark:to-[#0B1D3A]"
                  >
                    {/* Keep loan card structure unchanged, just dark/light styling */}
                  </Card>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

      </Tabs>
    </div>
  )
}
