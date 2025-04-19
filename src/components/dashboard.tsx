"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowUpRight, Layers, BarChart3, CreditCard, Gift, TrendingUp, TrendingDown, Clock } from "lucide-react"
import { HeroScene } from "@/components/hero-scene"
import { PortfolioChart } from "@/components/portfolio-chart"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Navbar } from "@/components/navbar"

export function Dashboard() {
  const [activeTab, setActiveTab] = useState("all")
  const [timeframe, setTimeframe] = useState("1m")
  const [showActivityModal, setShowActivityModal] = useState(false)
  const [selectedAsset, setSelectedAsset] = useState(null)

  const assets = [
    {
      id: 1,
      name: "Skyline Tower",
      symbol: "SKY",
      value: 125000,
      change: 3.2,
      type: "property",
      location: "New York, NY",
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      id: 2,
      name: "Digital Masterpiece",
      symbol: "DGART",
      value: 47500,
      change: -1.2,
      type: "collectible",
      creator: "Digital Visionary",
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      id: 3,
      name: "Carbon Credits",
      symbol: "CARB",
      value: 32750,
      change: 5.7,
      type: "environmental",
      location: "Global",
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      id: 4,
      name: "Tech Patent",
      symbol: "TPAT",
      value: 85000,
      change: 0.8,
      type: "intellectual",
      field: "Renewable Energy",
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      id: 5,
      name: "Luxury Apartment",
      symbol: "LUXAP",
      value: 95000,
      change: 2.1,
      type: "property",
      location: "Miami, FL",
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      id: 6,
      name: "Rare Collectible",
      symbol: "RCOL",
      value: 28500,
      change: 4.3,
      type: "collectible",
      year: "1985",
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      id: 7,
      name: "Water Rights",
      symbol: "WATER",
      value: 42000,
      change: -0.5,
      type: "environmental",
      location: "Colorado River",
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      id: 8,
      name: "Music Royalties",
      symbol: "MUSIC",
      value: 63500,
      change: 1.9,
      type: "intellectual",
      artist: "Various Artists",
      image: "/placeholder.svg?height=80&width=80",
    },
  ]

  const filteredAssets = activeTab === "all" ? assets : assets.filter((asset) => asset.type === activeTab)

  const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0)
  const totalChange = +(
    assets.reduce((sum, asset) => sum + asset.value * (asset.change / 100), 0) / totalValue
  ).toFixed(2)

  const recentActivity = [
    {
      id: 1,
      type: "purchase",
      asset: "Skyline Tower",
      amount: "$12,500",
      time: "2 hours ago",
    },
    {
      id: 2,
      type: "sale",
      asset: "Digital Masterpiece",
      amount: "$5,200",
      time: "5 hours ago",
    },
    {
      id: 3,
      type: "dividend",
      asset: "Tech Patent",
      amount: "$850",
      time: "1 day ago",
    },
    {
      id: 4,
      type: "tokenize",
      asset: "Luxury Apartment",
      amount: "$95,000",
      time: "2 days ago",
    },
  ]

  const allActivity = [
    ...recentActivity,
    {
      id: 5,
      type: "purchase",
      asset: "Carbon Credits",
      amount: "$3,200",
      time: "3 days ago",
    },
    {
      id: 6,
      type: "dividend",
      asset: "Music Royalties",
      amount: "$1,250",
      time: "4 days ago",
    },
    {
      id: 7,
      type: "sale",
      asset: "Rare Collectible",
      amount: "$4,800",
      time: "5 days ago",
    },
    {
      id: 8,
      type: "tokenize",
      asset: "Water Rights",
      amount: "$42,000",
      time: "1 week ago",
    },
    {
      id: 9,
      type: "purchase",
      asset: "Tech Patent",
      amount: "$8,500",
      time: "1 week ago",
    },
    {
      id: 10,
      type: "dividend",
      asset: "Skyline Tower",
      amount: "$3,750",
      time: "2 weeks ago",
    },
  ]

  const handleViewAllActivity = () => {
    setShowActivityModal(true)
  }

  const handleAssetTrade = (asset: any) => {
    setSelectedAsset(asset)
    window.location.href = `/trade?asset=${asset.symbol}`
  }

  return (
    <>
      <Navbar />
      <div className="container py-8">
        {/* Hero Section */}
        <section className="mb-12 px-4 md:px-8 lg:px-16">
          <div className="grid gap-12 md:grid-cols-2 items-center">
            <div className="flex flex-col justify-center space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Badge className="mb-4 bg-gradient-to-r from-teal-400/20 to-purple-500/20 text-black">
                  Decentralized Asset Ecosystem
                </Badge>
                <h1 className="font-montserrat text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-white">
                  Tokenize Reality.
                  <br />
                  <span className="bg-gradient-to-r from-[#1FC6C1] to-white bg-clip-text text-transparent">
                    Unlock Value.
                  </span>
                </h1>
                <p className="mt-4 max-w-md text-lg text-gray-300 font-sans">
                  Transform your physical and digital assets into tokenized value in the decentralized ecosystem.
                </p>
              </motion.div>
              <motion.div
                className="flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Button
                  asChild
                  size="lg"
                  className="bg-[#0B1D3A] text-white hover:bg-[#0B1D3A]/90 transition-all"
                >
                  <Link href="/tokenize">
                    Get Started
                    <ArrowUpRight className="ml-2 size-4" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-purple-400 text-white hover:border-teal-400"
                >
                  Learn More
                </Button>
              </motion.div>
            </div>

            {/* Visual content */}
            <motion.div
              className="h-[400px] w-full rounded-2xl bg-gradient-to-br from-[#1FC6C1]/10 to-white/10 p-4 shadow-md"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
            >
              <HeroScene />
            </motion.div>
          </div>
        </section>



        {/* Quick Actions */}
        <section className="mb-12 px-4 md:px-8 lg:px-16">
          <h2 className="mb-6 font-montserrat text-2xl font-semibold text-[#0B1D3A] dark:text-white">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { icon: Layers, label: "Tokenize", href: "/tokenize", color: "from-[#1FC6C1] to-[#8E7CFF]" },
              { icon: BarChart3, label: "Trade", href: "/trade", color: "from-[#8E7CFF] to-[#1FC6C1]" },
              { icon: CreditCard, label: "Lend", href: "/lend", color: "from-[#1FC6C1] to-[#0B1D3A]" },
              { icon: Gift, label: "Donate", href: "/community", color: "from-[#8E7CFF] to-[#0B1D3A]" },
            ].map((action, index) => (
              <Link key={action.label} href={action.href}>
                <motion.div
                  className="group relative overflow-hidden rounded-2xl border border-transparent bg-gradient-to-br from-white to-gray-50 dark:from-[#0B1D3A] dark:to-[#0B1D3A]/80 p-6 shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-all hover:scale-[1.02] hover:shadow-[0_8px_20px_rgba(0,0,0,0.1)] hover:border-teal-400 dark:hover:border-purple-400"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                  whileHover={{ y: -5 }}
                >
                  <div
                    className={`absolute -right-6 -top-6 size-24 rounded-full bg-gradient-to-br ${action.color} opacity-10 blur-xl transition-all group-hover:opacity-20`}
                  />
                  <div className={`mb-3 flex size-12 items-center justify-center rounded-full bg-gradient-to-r ${action.color}`}>
                    <action.icon className="size-6 text-white" />
                  </div>
                  <h3 className="font-montserrat text-base font-medium text-[#0B1D3A] dark:text-white">{action.label}</h3>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Quick access to {action.label.toLowerCase()} features
                  </p>
                </motion.div>
              </Link>
            ))}
          </div>
        </section>


        {/* Portfolio Overview */}
        <section className="mb-12 px-4 md:px-8 lg:px-16">
          <div className="grid gap-8 md:grid-cols-3">
            {/* Portfolio Performance Chart */}
            <div className="md:col-span-2">
              <Card className="rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-[#0B1D3A] dark:to-[#0B1D3A]/80 shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle className="text-[#0B1D3A] dark:text-white font-montserrat">Portfolio Performance</CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400">Track your asset value over time</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {["1w", "1m", "3m", "1y", "all"].map((period) => (
                      <Button
                        key={period}
                        variant={timeframe === period ? "secondary" : "ghost"}
                        size="sm"
                        className={`h-8 ${timeframe === period ? "bg-teal-500 text-white" : "text-gray-700 dark:text-gray-300"}`}
                        onClick={() => setTimeframe(period)}
                      >
                        {period.toUpperCase()}
                      </Button>
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full">
                    <PortfolioChart timeframe={timeframe} />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Portfolio Stats + Recent Activity */}
            <div className="space-y-8">
              {/* Portfolio Stats */}
              <Card className="rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-[#0B1D3A] dark:to-[#0B1D3A]/80 shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
                <CardHeader>
                  <CardTitle className="text-[#0B1D3A] dark:text-white font-montserrat">Portfolio Stats</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">Current value and metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Total Value</div>
                    <div className="text-3xl font-bold text-[#0B1D3A] dark:text-white">${totalValue.toLocaleString()}</div>
                    <div
                      className={`flex items-center text-sm ${totalChange >= 0 ? "text-green-500" : "text-red-500"}`}
                    >
                      {totalChange >= 0 ? (
                        <TrendingUp className="mr-1 size-4" />
                      ) : (
                        <TrendingDown className="mr-1 size-4" />
                      )}
                      {totalChange >= 0 ? "+" : ""}
                      {totalChange}% overall
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="text-sm text-gray-500 dark:text-gray-400">Assets</div>
                      <div className="text-lg font-medium text-[#0B1D3A] dark:text-white">{assets.length}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm text-gray-500 dark:text-gray-400">Categories</div>
                      <div className="text-lg font-medium text-[#0B1D3A] dark:text-white">4</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm text-gray-500 dark:text-gray-400">Highest Value</div>
                      <div className="text-lg font-medium text-[#0B1D3A] dark:text-white">
                        ${Math.max(...assets.map((a) => a.value)).toLocaleString()}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm text-gray-500 dark:text-gray-400">Best Performer</div>
                      <div className="text-lg font-medium text-green-500">
                        +{Math.max(...assets.map((a) => a.change))}%
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-[#0B1D3A] dark:to-[#0B1D3A]/80 shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
                <CardHeader>
                  <CardTitle className="text-[#0B1D3A] dark:text-white font-montserrat">Recent Activity</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">Latest transactions and updates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-center gap-3">
                        <div
                          className={`flex size-10 items-center justify-center rounded-full
                    ${activity.type === "purchase"
                              ? "bg-green-100 text-green-600"
                              : activity.type === "sale"
                                ? "bg-red-100 text-red-600"
                                : activity.type === "dividend"
                                  ? "bg-blue-100 text-blue-600"
                                  : "bg-purple-100 text-purple-600"
                            }
                    dark:bg-opacity-20 dark:text-white`}
                        >
                          {activity.type === "purchase" ? (
                            <TrendingUp className="size-5" />
                          ) : activity.type === "sale" ? (
                            <TrendingDown className="size-5" />
                          ) : activity.type === "dividend" ? (
                            <CreditCard className="size-5" />
                          ) : (
                            <Layers className="size-5" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div className="font-medium text-[#0B1D3A] dark:text-white">
                              {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                            </div>
                            <div className="text-sm font-medium text-[#0B1D3A] dark:text-white">
                              {activity.amount}
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-500 dark:text-gray-400">{activity.asset}</div>
                            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                              <Clock className="mr-1 size-3" />
                              {activity.time}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    className="w-full border-primary text-primary dark:text-white dark:border-white hover:border-teal-400 dark:hover:border-purple-400"
                    onClick={handleViewAllActivity}
                  >
                    View All Activity
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>


        {/* Asset Cards */}
        <section className="px-4 md:px-8 lg:px-16">
          <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <h2 className="font-display text-2xl font-bold text-[#0B1D3A] dark:text-white">Your Assets</h2>
            <Tabs defaultValue="all" onValueChange={setActiveTab} className="w-full sm:w-auto">
              <TabsList className="bg-gray-100 dark:bg-[#111827]">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="property">Property</TabsTrigger>
                <TabsTrigger value="collectible">Collectible</TabsTrigger>
                <TabsTrigger value="environmental">Environmental</TabsTrigger>
                <TabsTrigger value="intellectual">Intellectual</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filteredAssets.map((asset, index) => (
              <motion.div
                key={asset.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.05 * index }}
              >
                <Card className="group overflow-hidden rounded-2xl bg-white dark:bg-[#0B1D3A] transition-all hover:shadow-xl border border-gray-200 dark:border-white/10">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-[#0B1D3A] dark:text-white border-gray-300 dark:border-white/20">
                        {asset.symbol}
                      </Badge>
                      <div className={`text-sm font-medium ${asset.change >= 0 ? "text-green-500" : "text-red-500"}`}>
                        {asset.change >= 0 ? "+" : ""}
                        {asset.change}%
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="mb-3 flex items-center gap-3">
                      <div className="size-16 overflow-hidden rounded-md bg-gray-100 dark:bg-white/10">
                        <Image
                          src={asset.image || "/placeholder.svg"}
                          width={80}
                          height={80}
                          alt={asset.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-medium text-[#0B1D3A] dark:text-white">{asset.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {asset.type === "property"
                            ? asset.location
                            : asset.type === "collectible"
                              ? asset.creator || asset.year
                              : asset.type === "environmental"
                                ? asset.location
                                : asset.field || asset.artist}
                        </p>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-[#0B1D3A] dark:text-white">
                      ${asset.value.toLocaleString()}
                    </div>
                  </CardContent>
                  <CardFooter className="flex items-center justify-between border-t border-gray-200 dark:border-white/10 pt-3">
                    <Button variant="ghost" size="sm" className="text-primary dark:text-white hover:underline">
                      Details
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-primary text-primary dark:text-white dark:border-white hover:border-teal-400 dark:hover:border-purple-400"
                      onClick={() => handleAssetTrade(asset)}
                    >
                      Trade
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

      </div>

      {/* Activity Modal */}
      <Dialog open={showActivityModal} onOpenChange={setShowActivityModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>All Activity</DialogTitle>
            <DialogDescription>Your complete transaction history</DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto py-4">
            <div className="space-y-4">
              {allActivity.map((activity) => (
                <div key={activity.id} className="flex items-center gap-3 rounded-lg border border-gray-200 p-3">
                  <div
                    className={`flex size-10 items-center justify-center rounded-full ${activity.type === "purchase"
                      ? "bg-green-100 text-green-600"
                      : activity.type === "sale"
                        ? "bg-red-100 text-red-600"
                        : activity.type === "dividend"
                          ? "bg-blue-100 text-blue-600"
                          : "bg-purple-100 text-purple-600"
                      }`}
                  >
                    {activity.type === "purchase" ? (
                      <TrendingUp className="size-5" />
                    ) : activity.type === "sale" ? (
                      <TrendingDown className="size-5" />
                    ) : activity.type === "dividend" ? (
                      <CreditCard className="size-5" />
                    ) : (
                      <Layers className="size-5" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="font-medium text-gray-900">
                        {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                      </div>
                      <div className="text-sm font-medium text-gray-900">{activity.amount}</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">{activity.asset}</div>
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="mr-1 size-3" />
                        {activity.time}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
