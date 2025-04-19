import { TokenizationInterface } from "@/components/tokenization-interface"
import { Navbar } from "@/components/navbar"
import { Suspense } from "react"
import { LearnHowItWorks } from "@/components/learn-how-it-works"
import { tokenizePageContent } from "@/lib/learn-how-it-works-content"

export default function TokenizePage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div className="container py-8 text-white">Loading tokenization interface...</div>}>
        <TokenizationInterface />
      </Suspense>
      <div className="container py-8">
        <LearnHowItWorks content={tokenizePageContent} />
      </div>
    </>
  )
}
