import { TradingPlatform } from "@/components/trading-platform"
import { Navbar } from "@/components/navbar"
import { LearnHowItWorks } from "@/components/learn-how-it-works"
import { tradePageContent } from "@/lib/learn-how-it-works-content"

export default function TradePage() {
  return (
    <>
      <Navbar />
      <TradingPlatform />
      <div className="container py-8">
        <LearnHowItWorks content={tradePageContent} />
      </div>
    </>
  )
}
