"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Wallet,
  LayoutDashboard,
  Layers,
  BarChart3,
  Users,
  Vote,
  Shield,
  CreditCard,
  Bell,
  Menu,
  X,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"

export function Navbar() {
  const [connected, setConnected] = useState(true)
  const pathname = usePathname()

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/tokenize", label: "Tokenize", icon: Layers },
    { href: "/trade", label: "Trade", icon: BarChart3 },
    { href: "/lend", label: "Lend", icon: CreditCard },
    { href: "/community", label: "Community", icon: Users },
    { href: "/governance", label: "Governance", icon: Vote },
    { href: "/trust", label: "Trust", icon: Shield },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="relative size-8 rounded-full bg-primary p-[1px]">
              <div className="absolute inset-0 rounded-full bg-background p-1">
                <div className="h-full w-full rounded-full bg-primary opacity-80"></div>
              </div>
            </div>
            <span className="font-space text-xl font-bold tracking-tight text-white">UnityVault</span>
          </Link>
          <nav className="hidden md:flex">
            <ul className="flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-secondary text-foreground"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      }`}
                    >
                      <item.icon className="size-4" />
                      {item.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <div className="hidden md:flex md:items-center md:gap-4">
            <Button variant="outline" size="icon" className="relative">
              <Bell className="size-4" />
              <Badge className="absolute -right-1 -top-1 size-2 bg-blue-500 p-0" />
            </Button>

            {connected ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 px-2">
                    <Avatar className="size-8">
                      <AvatarImage src="/placeholder.svg" alt="User" />
                      <AvatarFallback className="bg-slate-700 text-slate-200">JD</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start text-left">
                      <span className="text-sm font-medium">John Doe</span>
                      <span className="text-xs text-slate-400">0x7F...A3D9</span>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-slate-800" />
                  <DropdownMenuItem className="focus:bg-slate-800">
                    <Wallet className="mr-2 size-4" />
                    <span>Wallet</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="focus:bg-slate-800">
                    <Shield className="mr-2 size-4" />
                    <span>Security</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="focus:bg-slate-800">
                    <Users className="mr-2 size-4" />
                    <span>Referrals</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-slate-800" />
                  <DropdownMenuItem onClick={() => setConnected(false)} className="focus:bg-slate-800">
                    <X className="mr-2 size-4" />
                    <span>Disconnect</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                onClick={() => setConnected(true)}
                className="bg-gradient-to-r from-blue-500 to-teal-400 text-white hover:opacity-90"
              >
                <Wallet className="mr-2 size-4" />
                Connect Wallet
              </Button>
            )}
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="size-4" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-6 py-4">
                <Link href="/dashboard" className="flex items-center gap-2">
                  <div className="relative size-8 rounded-full bg-primary p-[1px]">
                    <div className="absolute inset-0 rounded-full bg-background p-1">
                      <div className="h-full w-full rounded-full bg-primary opacity-80"></div>
                    </div>
                  </div>
                  <span className="font-space text-xl font-bold tracking-tight text-white">UnityVault</span>
                </Link>

                <nav className="flex flex-col gap-2">
                  {navItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                          isActive
                            ? "bg-secondary text-foreground"
                            : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                        }`}
                      >
                        <item.icon className="size-4" />
                        {item.label}
                      </Link>
                    )
                  })}
                </nav>

                <div className="mt-auto">
                  {connected ? (
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="size-10">
                          <AvatarImage src="/placeholder.svg" alt="User" />
                          <AvatarFallback className="bg-slate-700 text-slate-200">JD</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">John Doe</div>
                          <div className="text-xs text-slate-400">0x7F...A3D9</div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        className="w-full justify-start border-slate-700"
                        onClick={() => setConnected(false)}
                      >
                        <X className="mr-2 size-4" />
                        Disconnect
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={() => setConnected(true)}
                      className="w-full bg-gradient-to-r from-blue-500 to-teal-400 text-white hover:opacity-90"
                    >
                      <Wallet className="mr-2 size-4" />
                      Connect Wallet
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
