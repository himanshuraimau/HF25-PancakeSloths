"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Layers, BarChart3, Shield, Wallet } from "lucide-react"

import { MessagesSquare, Github, Twitter, } from 'lucide-react';
import { Input } from '@/components/ui/input';


import React, { useEffect, useRef } from 'react';
import { Lock, CheckCircle, AlertTriangle } from 'lucide-react';

import { Building, Coins, ArrowLeftRight, Heart, VoteIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import { Zap, Users, Globe } from 'lucide-react';

import { Calendar, DollarSign, FileText } from 'lucide-react';

import { ArrowDown, Clock } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay,
      ease: 'easeOut',
    },
  }),
}

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
}


const FeatureCard = ({
  icon: Icon,
  title,
  description
}: {
  icon: LucideIcon,
  title: string,
  description: string
}) => {
  return (
    <div className="p-6 rounded-lg bg-gradient-card dark:bg-navy/50 shadow-card hover:shadow-card-hover transition-all duration-300 transform hover:scale-[1.02] hover:border-teal/30 border border-transparent dark:border-teal/10 dark:hover:border-teal/30">
      <div className="w-12 h-12 mb-4 rounded-lg bg-gradient-cta/10 flex items-center justify-center">
        <Icon className="text-purple dark:text-teal" size={24} />
      </div>
      <h3 className="text-lg font-montserrat font-semibold mb-2 text-navy dark:text-white">{title}</h3>
      <p className="text-navy/70 dark:text-white/70">{description}</p>
    </div>
  );
};

const UseCaseCard = ({
  icon: Icon,
  title,
  description,
  details
}: {
  icon: LucideIcon,
  title: string,
  description: string,
  details: string
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-300 rounded-lg shadow-card border border-subtleGray/30 overflow-hidden transition-all duration-300">
      <div className="p-6">
        <div className="w-12 h-12 mb-4 rounded-lg bg-gradient-cta/10 flex items-center justify-center">
          <Icon className="text-purple" size={24} />
        </div>
        <h3 className="text-lg font-montserrat font-semibold mb-2">{title}</h3>
        <p className="text-navy/70 mb-4">{description}</p>

        <div className={`overflow-hidden transition-all duration-300 ${expanded ? 'max-h-60' : 'max-h-0'}`}>
          <p className="text-navy/70 mb-4 text-sm">{details}</p>
        </div>

        <Button
          variant="ghost"
          className="p-0 h-auto text-purple hover:text-purple/80 hover:bg-transparent"
          onClick={() => setExpanded(!expanded)}
        >
          <span className="text-underline-animation">
            {expanded ? 'Show less' : 'See how it works'}
          </span>
        </Button>
      </div>
    </div>
  );
};

export function LandingPage() {
  const [showDemo, setShowDemo] = useState(false)
  const outerRingRef = useRef<HTMLDivElement>(null);
  const middleRingRef = useRef<HTMLDivElement>(null);
  const innerRingRef = useRef<HTMLDivElement>(null);
  const lockRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (outerRingRef.current) outerRingRef.current.classList.add('opacity-100');
            setTimeout(() => {
              if (middleRingRef.current) middleRingRef.current.classList.add('opacity-100');
            }, 400);
            setTimeout(() => {
              if (innerRingRef.current) innerRingRef.current.classList.add('opacity-100');
            }, 800);
            setTimeout(() => {
              if (lockRef.current) lockRef.current.classList.add('scale-100');
            }, 1200);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (outerRingRef.current) {
      observer.observe(outerRingRef.current);
    }

    return () => {
      if (outerRingRef.current) {
        observer.unobserve(outerRingRef.current);
      }
    };
  }, []);

  const securityFeatures = [
    { type: "outer", name: "End-to-End Encryption", icon: CheckCircle },
    { type: "outer", name: "Multi-Factor Authentication", icon: CheckCircle },
    { type: "outer", name: "Secure API Endpoints", icon: CheckCircle },
    { type: "outer", name: "DDOS Protection", icon: CheckCircle },
    { type: "middle", name: "Smart Contract Validation", icon: CheckCircle },
    { type: "middle", name: "Comprehensive Audit Trails", icon: CheckCircle },
    { type: "middle", name: "Formal Verification", icon: CheckCircle },
    { type: "inner", name: "Decentralized Identity", icon: CheckCircle },
    { type: "inner", name: "Multi-Signature Authorization", icon: CheckCircle },
  ];

  const technologies = [
    {
      name: "Blockchain Layer",
      color: "bg-gray-200 dark:bg-gray-800", // Gray background
      borderColor: "border-gray-300 dark:border-gray-700",
      textColor: "text-purple-600 dark:text-purple-300",
      dotColor: "bg-purple-600 dark:bg-purple-300",
      components: ["Solana Blockchain", "65,000 TPS", "Proof of History"]
    },
    {
      name: "Smart Contracts",
      color: "bg-cyan-400/20 dark:bg-cyan-500/30", // Changed to teal background
      borderColor: "border-cyan-400/40 dark:border-cyan-500/50", // Adjusted border for teal
      textColor: "text-cyan-600 dark:text-cyan-300",
      dotColor: "bg-cyan-600 dark:bg-cyan-300",
      components: ["Rust/Anchor", "Token Programs", "Escrow Logic"]
    },
    {
      name: "Backend Services",
      color: "bg-blue-400/20 dark:bg-blue-500/30",
      borderColor: "border-blue-400/40 dark:border-blue-500/50",
      textColor: "text-blue-600 dark:text-blue-300",
      dotColor: "bg-blue-600 dark:bg-blue-300",
      components: ["Golang/Node.js", "API Gateway", "Data Indexing"]
    },
    {
      name: "Frontend",
      color: "bg-cyan-400/20 dark:bg-cyan-500/30",
      borderColor: "border-cyan-400/40 dark:border-cyan-500/50",
      textColor: "text-cyan-600 dark:text-cyan-300",
      dotColor: "bg-cyan-600 dark:bg-cyan-300",
      components: ["Next.js/React", "Responsive UI", "Web3 Wallets"]
    },
    {
      name: "Infrastructure",
      color: "bg-gray-400/20 dark:bg-gray-500/30",
      borderColor: "border-gray-400/40 dark:border-gray-500/50",
      textColor: "text-gray-600 dark:text-gray-300",
      dotColor: "bg-gray-600 dark:bg-gray-300",
      components: ["AWS/Docker", "Distributed Network", "Secure Cloud"]
    }
  ];

  const useCases = [
    {
      icon: Building,
      title: "Real Estate Tokenization",
      description: "Transform property into tradable digital tokens",
      details: "Our platform enables property owners to convert real estate assets into digital tokens. This allows for fractional ownership, increased liquidity, and simplified transfers without traditional paperwork delays."
    },
    {
      icon: Coins,
      title: "Token Lending",
      description: "Lend tokens securely with transparent collateral",
      details: "Lenders can offer asset-backed loans with complete visibility into collateral and automated interest payments. Smart contracts ensure terms are enforced without requiring trust between parties."
    },
    {
      icon: ArrowLeftRight,
      title: "Asset Trading",
      description: "Trade various assets directly without intermediaries",
      details: "Our decentralized exchange enables direct peer-to-peer trading of tokenized assets, eliminating middlemen and reducing costs. Trade real estate tokens for cryptocurrency or other assets with instant settlement."
    },
    {
      icon: Heart,
      title: "Community Aid",
      description: "Direct verified donations with transparent allocation",
      details: "Enable direct support for community initiatives with full transparency. Donors can track exactly how their contributions are used, and communities can democratically vote on fund allocation."
    },
    {
      icon: VoteIcon,
      title: "Governance Participation",
      description: "Vote on platform policies and earn rewards",
      details: "Token holders can participate in governance decisions, shaping the future direction of the platform. Active participation is rewarded with additional tokens, incentivizing community involvement."
    }
  ];

  // Scroll functionality for mobile
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const features = [
    {
      icon: Building,
      title: "Asset Tokenization",
      description: "Convert real-world assets into tradable digital tokens with fractional ownership capabilities."
    },
    {
      icon: Zap,
      title: "Instant Transfers",
      description: "Send assets globally in seconds, not days, with full settlement finality."
    },
    {
      icon: Users,
      title: "Community Aid Network",
      description: "Direct support with verification and transparency for community-driven initiatives."
    },
    {
      icon: VoteIcon,
      title: "Adaptive Governance",
      description: "Shape platform policies and earn rewards through decentralized voting."
    },
    {
      icon: Shield,
      title: "Transparency & Trust",
      description: "Full visibility into all transactions and valuations through immutable records."
    },
    {
      icon: Globe,
      title: "Interoperability",
      description: "Seamless integration with existing financial infrastructure and blockchain networks."
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <header className="border-b backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="relative size-8 rounded-full bg-primary p-[1px]">
              <div className="h-full w-full rounded-full bg-background"></div>
            </div>
            <span className="font-space text-xl font-bold tracking-tight">UnityVault</span>
          </div>
          <div className="hidden items-center gap-6 md:flex">
            <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground">
              How It Works
            </Link>
            <Link href="#ecosystem" className="text-sm text-muted-foreground hover:text-foreground">
              Ecosystem
            </Link>
            <Link href="/auth" className="text-sm text-muted-foreground hover:text-foreground">
              Sign In
            </Link>
            <Button asChild className="bg-primary text-primary-foreground hover:opacity-90">
              <Link href="/auth">
                Get Started
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
          </div>
          <Button asChild className="bg-primary text-primary-foreground hover:opacity-90 md:hidden">
            <Link href="/auth">
              Sign In
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section
        className="pt-28 pb-16 md:py-32 relative overflow-hidden bg-gradient-to-br from-background via-background/95 to-background"
        aria-label="Hero Section"
      >
        {/* Animated gradient orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        </div>

        <div className="container mx-auto px-4 md:px-6 relative">
          <div className="flex flex-col md:flex-row items-center">
            <div className="w-full md:w-3/5 mb-10 md:mb-0 z-10">
              <motion.h1
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight"
                initial="hidden"
                animate="visible"
                variants={fadeUp}
              >
                The Future of Asset Transfer is Here
              </motion.h1>

              <motion.p
                className="text-lg md:text-xl mb-8 max-w-2xl text-navy/80"
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                custom={0.2}
              >
                Tokenize, transfer, and trade assets instantly with near-zero fees on our unified blockchain ledger
              </motion.p>

              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {[
                  { icon: <Zap className="w-5 h-5 text-purple mr-2" />, label: 'Fast', stat: '65,000 TPS' },
                  { icon: <Wallet className="w-5 h-5 text-purple mr-2" />, label: 'Affordable', stat: 'Fees < $0.01' },
                  { icon: <Clock className="w-5 h-5 text-purple mr-2" />, label: 'Quick', stat: 'Instant Settlement' },
                ].map((item, i) => (
                  <motion.div
                    whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(0, 255, 200, 0.3)' }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    key={i}
                    className="frosted-glass p-5 rounded-xl shadow-sm border border-white/10 backdrop-blur-sm bg-white/5"
                    initial="hidden"
                    animate="visible"
                    variants={fadeUp}
                    custom={i * 0.2}
                  >
                    <div className="flex items-center mb-2">
                      {item.icon}
                      <span className="font-montserrat font-semibold text-white">{item.label}</span>
                    </div>
                    <p className="text-2xl font-bold text-navy">{item.stat}</p>
                  </motion.div>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  variants={fadeUp}
                  custom={0.1}
                >
                  <Button className="bg-gradient-to-r from-teal-500 to-blue-500 text-white px-6 py-3 rounded-lg font-semibold">
                    Get Started Now
                  </Button>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  variants={fadeUp}
                  custom={0.2}
                >
                  <Button
                    variant="outline"
                    className="border border-teal-500 text-teal-300 px-6 py-3 rounded-lg hover:bg-teal-500/10"
                  >
                    Explore Features
                  </Button>
                </motion.div>
              </div>
            </div>

            {/* Illustration */}
            <div className="w-full md:w-2/5 z-10 flex justify-center">
              <div className="w-full max-w-md relative">
                <div className="aspect-square bg-gradient-cta/5 rounded-3xl p-6 border border-purple/10">
                  <div className="relative w-full h-full flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-32 h-32 bg-navy/5 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                      <div className="w-48 h-48 bg-navy/5 rounded-full animate-pulse absolute" style={{ animationDelay: '1s' }}></div>
                      <div className="w-64 h-64 bg-navy/5 rounded-full animate-pulse absolute" style={{ animationDelay: '1.5s' }}></div>
                    </div>

                    <div className="z-10 text-center">
                      <div className="w-20 h-20 mx-auto mb-4 relative">
                        <div className="absolute inset-0 bg-gradient-cta opacity-20 rounded-xl"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <motion.div
                            whileHover={{ scale: 1.1, rotate: 2 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                            className="w-12 h-12 bg-gradient-to-br from-purple-500 to-teal-400 rounded-lg flex items-center justify-center"
                          >
                            <span className="text-white font-bold text-xl">UV</span>
                          </motion.div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 mt-6">
                        {[...Array(9)].map((_, i) => (
                          <motion.div
                            key={i}
                            whileHover={{ scale: 1.2 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                            className="aspect-square bg-gradient-cta/10 rounded-lg border border-teal/20 flex items-center justify-center"
                            style={{ transitionDelay: `${i * 0.05}s` }}
                          >
                            <div className={`w-3 h-3 rounded-full ${i % 2 === 0 ? 'bg-purple/60' : 'bg-teal/60'}`} />
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
            <span className="text-navy/60 text-sm mb-2">Scroll to discover</span>
            <ArrowDown className="w-5 h-5 text-purple animate-bounce" />
          </div>
        </div>
      </section>


      {/* Problem-Solution */}
      <section
        id="problem-solution"
        className="py-16 md:py-24 bg-navy/90 relative overflow-hidden"
        aria-label="Problem Solution Section"
      >
        <div className="container mx-auto px-4 md:px-6">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-center mb-12 text-white"
          >
            Transforming <span className="text-purple">Traditional Finance</span> Challenges
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
            {/* Current Challenges Panel */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="rounded-xl bg-gradient-to-br from-navy/80 to-navy/60 p-6 md:p-8 border border-white/10 hover:border-cyan-400 transition-all duration-300 hover:shadow-lg"
            >
              <h3 className="text-2xl font-bold mb-6 text-white">Current Challenges</h3>
              <div className="space-y-8">
                {/* Slow Transfer Times */}
                <div className="flex items-start space-x-4 group">
                  <div className="p-3 bg-white/10 text-white rounded-full transition transform group-hover:scale-110 group-hover:bg-cyan-500/30">
                    <Calendar size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-1 text-white">Slow Transfer Times</h4>
                    <p className="text-white/70 mb-2">
                      Traditional asset transfers can take days or even weeks to settle, creating unnecessary delays and inefficiencies.
                    </p>
                    <div className="w-full h-8 rounded-full bg-white/20 overflow-hidden">
                      <div className="h-full bg-cyan-400/60 text-sm text-white flex items-center pl-4 font-semibold" style={{ width: "90%" }}>
                        5-7 Business Days
                      </div>
                    </div>
                  </div>
                </div>

                {/* High Costs */}
                <div className="flex items-start space-x-4 group">
                  <div className="p-3 bg-white/10 text-white rounded-full transition transform group-hover:scale-110 group-hover:bg-cyan-500/30">
                    <DollarSign size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-1 text-white">High Costs</h4>
                    <p className="text-white/70 mb-2">
                      Significant fees and hidden costs associated with asset transfers create barriers to entry and reduce profitability.
                    </p>
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, idx) => (
                        <div key={idx} className="w-8 h-8 flex items-center justify-center bg-white/20 text-white rounded-full">
                          <DollarSign size={16} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Lack of Transparency */}
                <div className="flex items-start space-x-4 group">
                  <div className="p-3 bg-white/10 text-white rounded-full transition transform group-hover:scale-110 group-hover:bg-cyan-500/30">
                    <Lock size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-1 text-white">Lack of Transparency</h4>
                    <p className="text-white/70 mb-2">
                      Opaque processes make it difficult to track asset ownership and verify transactions, creating trust issues.
                    </p>
                    <div className="w-full h-16 bg-white/10 rounded-lg flex items-center justify-center">
                      <div className="w-3/4 h-3/4 bg-white/20 backdrop-blur-md rounded flex items-center justify-center">
                        <Lock size={24} className="text-white/30" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Solutions Panel */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="rounded-xl bg-gradient-to-br from-teal/10 to-cyan-200/10 p-6 md:p-8 border border-white/10 hover:border-cyan-400 transition-all duration-300 hover:shadow-lg"
            >
              <h3 className="text-2xl font-bold mb-6 text-white">Our Solutions</h3>
              <div className="space-y-8">
                {/* Instant Transfers */}
                <div className="flex items-start space-x-4 group">
                  <div className="p-3 bg-white/10 text-cyan-400 rounded-full transition transform group-hover:scale-110 group-hover:bg-cyan-500/30">
                    <Zap size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-1 text-white">Instant Transfers</h4>
                    <p className="text-white/70 mb-2">
                      Assets transfer in seconds, not days, enabling immediate settlement and improved liquidity management.
                    </p>
                    <div className="w-full h-8 rounded-full bg-white/20 overflow-hidden">
                      <div className="h-full bg-cyan-400 text-sm text-white flex items-center pl-4 font-semibold" style={{ width: "5%" }}>
                        &lt;5s
                      </div>
                    </div>
                  </div>
                </div>

                {/* Microscopic Fees */}
                <div className="flex items-start space-x-4 group">
                  <div className="p-3 bg-white/10 text-cyan-400 rounded-full transition transform group-hover:scale-110 group-hover:bg-cyan-500/30">
                    <Coins size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-1 text-white">Microscopic Fees</h4>
                    <p className="text-white/70 mb-2">
                      Near-zero transaction costs open up new possibilities for micro-transactions and fractional ownership.
                    </p>
                    <div className="flex items-center space-x-1">
                      <div className="w-8 h-8 flex items-center justify-center rounded-full bg-cyan-400 text-white text-xs">
                        ¢
                      </div>
                      {[...Array(4)].map((_, idx) => (
                        <div key={idx} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-white opacity-30">
                          <DollarSign size={16} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Complete Transparency */}
                <div className="flex items-start space-x-4 group">
                  <div className="p-3 bg-white/10 text-cyan-400 rounded-full transition transform group-hover:scale-110 group-hover:bg-cyan-500/30">
                    <FileText size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-1 text-white">Complete Transparency</h4>
                    <p className="text-white/70 mb-2">
                      Immutable blockchain records provide full visibility into ownership history and transaction details.
                    </p>
                    <div className="w-full h-16 bg-white/10 rounded-lg p-2">
                      <div className="h-full w-full bg-white/80 rounded border border-cyan-400/40 flex items-center justify-center px-2">
                        <code className="text-xs text-navy/80 font-mono">
                          {"{tx: '0x71c...9f3', asset: 'Property-A', owner: '0xf8d...3e2'}"}
                        </code>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Center Divider with Arrow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 hidden md:block"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple to-cyan-400 flex items-center justify-center shadow-lg">
              <ArrowRight size={24} className="text-white" />
            </div>
          </motion.div>
        </div>
      </section>


      {/* Core Features */}
      <section id="features" className="py-16 md:py-24 bg-softWhite dark:bg-navy/95" aria-label="Features Section">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-navy dark:text-white">Core Features</h2>
            <p className="text-lg text-navy/70 dark:text-white/70 max-w-2xl mx-auto">
              Our comprehensive suite of features transforms how assets are managed, transferred, and governed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Use Case */}
      <section id="use-cases" className="py-16 md:py-24 bg-navy/5 dark:text-black" aria-label="Use Cases Section">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Use Cases</h2>
            <p className="text-lg text-navy/70 max-w-2xl mx-auto text-white">
              Discover how UnityVault transforms various industries and processes
            </p>
          </div>

          {/* Desktop Grid */}
          <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {useCases.map((useCase, index) => (
              <UseCaseCard
                key={index}
                icon={useCase.icon}
                title={useCase.title}
                description={useCase.description}
                details={useCase.details}
              />
            ))}
          </div>

          {/* Mobile Carousel */}
          <div className="md:hidden relative">
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10">
              <button
                className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center "
                onClick={() => scroll('left')}
                aria-label="Scroll left"
              >
                <ChevronLeft size={20} className="text-navy" />
              </button>
            </div>

            <div
              ref={scrollContainerRef}
              className="flex overflow-x-auto hide-scrollbar snap-x snap-mandatory gap-4 py-4 px-4"
              style={{ scrollbarWidth: 'none' }}
            >
              {useCases.map((useCase, index) => (
                <div
                  key={index}
                  className="snap-center flex-shrink-0 w-[85%]"
                >
                  <UseCaseCard
                    icon={useCase.icon}
                    title={useCase.title}
                    description={useCase.description}
                    details={useCase.details}
                  />
                </div>
              ))}
            </div>

            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10">
              <button
                className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center"
                onClick={() => scroll('right')}
                aria-label="Scroll right"
              >
                <ChevronRight size={20} className="text-navy" />
              </button>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Button className="cta-button-secondary dark:bg-white">Explore All Use Cases</Button>
          </div>
        </div>
      </section>

      {/* Technology */}
      <section id="technology" className="py-16 md:py-24 bg-softWhite dark:bg-gray-900" aria-label="Technology Section">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-navy dark:text-white">Technology Architecture</h2>
            <p className="text-lg text-navy/70 dark:text-gray-300 max-w-2xl mx-auto">
              Powered by cutting-edge blockchain technology and modern development frameworks
            </p>
          </div>

          <div className="relative">
            {/* Architecture Visualization */}
            <div className="flex flex-col items-center mb-16">
              <div className="w-full max-w-4xl aspect-[4/3] relative bg-gradient-to-br from-navy/5 to-purple/5 dark:from-navy/20 dark:to-purple/20 rounded-xl border border-subtleGray/30 dark:border-gray-700 p-6 md:p-12">
                {/* Line connections */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M200,40 L100,120 L200,200 L300,120 L200,40"
                    fill="none"
                    stroke="#E0E5EB"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                    className="dark:stroke-gray-600"
                  />
                  <path
                    d="M200,200 L200,260"
                    fill="none"
                    stroke="#E0E5EB"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                    className="dark:stroke-gray-600"
                  />
                </svg>

                {/* Tech nodes - Updated smart contracts to teal bg */}
                <div className="absolute top-[10%] left-1/2 transform -translate-x-1/2">
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-lg bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 flex items-center justify-center transform hover:scale-105 transition-transform">
                    <div className="text-center p-2">
                      <div className="text-lg font-semibold text-purple-600 dark:text-purple-300">Blockchain</div>
                      <div className="text-xs text-navy/70 dark:text-gray-300">Solana</div>
                    </div>
                  </div>
                </div>

                <div className="absolute top-[35%] left-[25%] transform -translate-x-1/2">
                  <div className="w-24 h-24 md:w-28 md:h-28 rounded-lg bg-blue-400/20 dark:bg-blue-500/30 border border-blue-400/40 dark:border-blue-500/50 flex items-center justify-center transform hover:scale-105 transition-transform">
                    <div className="text-center p-2">
                      <div className="text-lg font-semibold text-blue-600 dark:text-blue-300">Smart Contracts</div>
                      <div className="text-xs text-navy/70 dark:text-gray-300">Rust/Anchor</div>
                    </div>
                  </div>
                </div>

                <div className="absolute top-[35%] left-[75%] transform -translate-x-1/2">
                  <div className="w-24 h-24 md:w-28 md:h-28 rounded-lg bg-blue-400/20 dark:bg-blue-500/30 border border-blue-400/40 dark:border-blue-500/50 flex items-center justify-center transform hover:scale-105 transition-transform">
                    <div className="text-center p-2">
                      <div className="text-lg font-semibold text-blue-600 dark:text-blue-300">Backend</div>
                      <div className="text-xs text-navy/70 dark:text-gray-300">Go/Node.js</div>
                    </div>
                  </div>
                </div>

                <div className="absolute top-[65%] left-1/2 transform -translate-x-1/2">
                  <div className="w-24 h-24 md:w-28 md:h-28 rounded-lg bg-cyan-400/20 dark:bg-cyan-500/30 border border-cyan-400/40 dark:border-cyan-500/50 flex items-center justify-center transform hover:scale-105 transition-transform">
                    <div className="text-center p-2">
                      <div className="text-lg font-semibold text-cyan-600 dark:text-cyan-300">Frontend</div>
                      <div className="text-xs text-navy/70 dark:text-gray-300">Next.js/React</div>
                    </div>
                  </div>
                </div>

                <div className="absolute top-[85%] left-1/2 transform -translate-x-1/2">
                  <div className="w-24 h-24 md:w-28 md:h-28 rounded-lg bg-gray-400/20 dark:bg-gray-500/30 border border-gray-400/40 dark:border-gray-500/50 flex items-center justify-center transform hover:scale-105 transition-transform">
                    <div className="text-center p-2">
                      <div className="text-lg font-semibold text-gray-600 dark:text-gray-300">Infrastructure</div>
                      <div className="text-xs text-navy/70 dark:text-gray-300">AWS/Docker</div>
                    </div>
                  </div>
                </div>

                {/* Animated data flow particles */}
                <div className="absolute inset-0 pointer-events-none">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-2 h-2 rounded-full bg-purple-600 dark:bg-purple-300 animate-pulse"
                      style={{
                        top: '40%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        opacity: 0.7,
                        animationDelay: `${i * 0.5}s`
                      }}
                    ></div>
                  ))}
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-2 h-2 rounded-full bg-teal-600 dark:bg-teal-300 animate-pulse"
                      style={{
                        top: '60%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        opacity: 0.7,
                        animationDelay: `${i * 0.5}s`
                      }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>

            {/* Technology Stacks - Updated Smart Contracts to teal bg */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {technologies.map((tech, index) => (
                <div
                  key={index}
                  className={`p-6 rounded-lg ${tech.color} border ${tech.borderColor} hover:shadow-lg transition-all duration-300`}
                >
                  <h3 className={`text-xl font-montserrat font-semibold mb-4 ${tech.textColor}`}>
                    {tech.name}
                  </h3>
                  <ul className="space-y-3">
                    {tech.components.map((component, i) => (
                      <li key={i} className="text-navy/80 dark:text-white text-sm flex items-center">
                        <span className={`w-2 h-2 rounded-full ${tech.dotColor} mr-2`}></span>
                        {component}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16 text-center">
            <Button className="cta-button-secondary border-2 dark:bg-gray-900 dark:text-white dark:hover:bg-purple-800">
              <span className="mr-2">Technical Documentation</span>
              <span className="w-5 h-5 rounded-full bg-purple-400/20 dark:bg-purple-400/30 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
              </span>
            </Button>
          </div>
        </div>
      </section>

      {/* Security */}
      <section id="security" className="py-16 md:py-24 bg-gradient-to-b from-navy/5 to-purple/5 text-white" aria-label="Security Section">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Trust & Security</h2>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              Our multi-layered security approach ensures the safety of all assets and transactions
            </p>
          </div>

          {/* Security Visualization */}
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="w-full md:w-1/2 mb-12 md:mb-0">
              <div className="relative w-full aspect-square max-w-md mx-auto">
                {/* Outer ring */}
                <div
                  ref={outerRingRef}
                  className="absolute inset-0 rounded-full border-4 border-dashed border-purple/30 opacity-0 transition-opacity duration-700"
                ></div>

                {/* Middle ring */}
                <div
                  ref={middleRingRef}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 rounded-full border-4 border-dashed border-teal/30 opacity-0 transition-opacity duration-700"
                ></div>

                {/* Inner ring */}
                <div
                  ref={innerRingRef}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 rounded-full border-4 border-dashed border-navy/30 opacity-0 transition-opacity duration-700"
                ></div>

                {/* Center shield */}
                <div
                  ref={lockRef}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/4 h-1/4 scale-0 transition-transform duration-500"
                >
                  <div className="w-full h-full rounded-full bg-gradient-cta shadow-lg flex items-center justify-center">
                    <Shield className="text-white w-1/2 h-1/2" />
                  </div>
                </div>

                {/* Security features */}
                {securityFeatures.map((feature, index) => {
                  let radius, angle;
                  if (feature.type === "outer") {
                    radius = 47;
                    angle = (index * 72) % 360;
                  } else if (feature.type === "middle") {
                    radius = 37;
                    angle = ((index * 120) + 60) % 360;
                  } else {
                    radius = 25;
                    angle = ((index * 180) + 90) % 360;
                  }

                  const x = 50 + radius * Math.cos(angle * Math.PI / 180);
                  const y = 50 + radius * Math.sin(angle * Math.PI / 180);
                  const Icon = feature.icon;

                  return (
                    <div
                      key={index}
                      className="absolute w-8 h-8 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center opacity-0 animate-fade-in"
                      style={{
                        left: `${x}%`,
                        top: `${y}%`,
                        animationDelay: `${1.5 + index * 0.2}s`
                      }}
                    >
                      <div className={`w-8 h-8 rounded-full ${feature.type === "outer" ? "bg-purple/10" :
                        feature.type === "middle" ? "bg-teal/10" : "bg-navy/10"
                        } flex items-center justify-center`}>
                        <Icon className={`w-4 h-4 ${feature.type === "outer" ? "text-purple" :
                          feature.type === "middle" ? "text-teal" : "text-navy"
                          }`} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="w-full md:w-1/2">
              <div className="space-y-6">
                {/* Card 1 */}
                <div className="p-6 bg-gradient-to-br from-cyan-600 to-teal-500 rounded-lg shadow-card border border-white/10 text-white">
                  <div className="flex items-start space-x-4">
                    <div className="mt-1 p-2 rounded-full bg-purple/20 text-white">
                      <Lock size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-montserrat font-semibold mb-2">
                        Comprehensive Security Model
                      </h3>
                      <p className="text-white/80">
                        Our multi-layered approach provides defense-in-depth, from basic encryption to
                        advanced smart contract verification and multi-signature controls.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card 2 */}
                <div className="p-6 bg-gradient-to-br from-cyan-600 to-teal-500 rounded-lg shadow-card border border-white/10 text-white">
                  <div className="flex items-start space-x-4">
                    <div className="mt-1 p-2 rounded-full bg-teal/20 text-white">
                      <Shield size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-montserrat font-semibold mb-2">
                        Regular Security Audits
                      </h3>
                      <p className="text-white/80">
                        All smart contracts and system components undergo rigorous third-party security audits
                        to ensure the highest standards of safety and reliability.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card 3 */}
                <div className="p-6 bg-gradient-to-br from-cyan-600 to-teal-500 rounded-lg shadow-card border border-white/10 text-white">
                  <div className="flex items-start space-x-4">
                    <div className="mt-1 p-2 rounded-full bg-navy/20 text-white">
                      <AlertTriangle size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-montserrat font-semibold mb-2">
                        Transparent Security Practices
                      </h3>
                      <p className="text-white/80">
                        We maintain full transparency about our security measures, vulnerabilities, and
                        incident response protocols to build trust with our community.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Security Statistics */}
                <div className="grid grid-cols-3 gap-4 mt-8 text-white">
                  <div className="text-center p-4 bg-gradient-to-br from-cyan-600 to-teal-500 rounded-lg shadow-sm border border-white/10">
                    <div className="text-2xl font-bold">100%</div>
                    <div className="text-sm">Transparent Transactions</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-cyan-600 to-teal-500 rounded-lg shadow-sm border border-white/10">
                    <div className="text-2xl font-bold">24h</div>
                    <div className="text-sm">Value Updates</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-cyan-600 to-teal-500 rounded-lg shadow-sm border border-white/10">
                    <div className="text-2xl font-bold">3+</div>
                    <div className="text-sm">Security Layers</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Footer */}
      <section className="bg-gradient-footer dark:bg-navy/95 text-white" aria-label="Footer">
        <div className="container mx-auto px-4 md:px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-1">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mr-3">
                  <span className="text-navy font-bold text-xl">UV</span>
                </div>
                <span className="text-white font-montserrat font-bold text-xl">UnityVault</span>
              </div>
              <p className="text-white/70 mb-6">
                The future of asset transfer and tokenization on the blockchain.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                  aria-label="Discord"
                >
                  <MessagesSquare size={18} className="text-white" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                  aria-label="GitHub"
                >
                  <Github size={18} className="text-white" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter size={18} className="text-white" />
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-montserrat font-semibold text-lg mb-4">Platform</h3>
              <ul className="space-y-3">
                <li><a href="#features" className="text-white/70 hover:text-white transition-colors">Features</a></li>
                <li><a href="#use-cases" className="text-white/70 hover:text-white transition-colors">Use Cases</a></li>
                <li><a href="#technology" className="text-white/70 hover:text-white transition-colors">Technology</a></li>
                <li><a href="#security" className="text-white/70 hover:text-white transition-colors">Security</a></li>
                <li><a href="#roadmap" className="text-white/70 hover:text-white transition-colors">Roadmap</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-montserrat font-semibold text-lg mb-4">Resources</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-white/70 hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="text-white/70 hover:text-white transition-colors">API Reference</a></li>
                <li><a href="#" className="text-white/70 hover:text-white transition-colors">SDKs</a></li>
                <li><a href="#" className="text-white/70 hover:text-white transition-colors">Tutorials</a></li>
                <li><a href="#" className="text-white/70 hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-montserrat font-semibold text-lg mb-4">Subscribe</h3>
              <p className="text-white/70 mb-4">
                Stay updated with our latest news and updates.
              </p>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Your email"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-teal focus:ring-teal"
                />
                <Button
                  className="bg-teal hover:bg-teal/90 text-navy"
                  size="icon"
                >
                  <ArrowRight size={18} />
                </Button>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
            <div className="text-white/60 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} UnityVault. All rights reserved. HACKFEST-2025 Project.
            </div>

            <div className="flex gap-6">
              <a href="#" className="text-white/60 text-sm hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-white/60 text-sm hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="text-white/60 text-sm hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>

          {/* Special acknowledgment */}
          <div className="mt-6 text-center text-white/60 text-sm">
            Made with ❤️ by Pancake Sloths from Siddaganga Institute of Technology

            {/* Easter egg - tiny animated sloth that appears on hover */}
            <div className="inline-block relative ml-2 cursor-pointer group">
              <span className="font-bold">PS</span>
              <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className="w-16 h-16 bg-purple/80 rounded-lg p-2 flex items-center justify-center">
                  <span className="text-xs text-white">🦥 Pancake Sloths</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
