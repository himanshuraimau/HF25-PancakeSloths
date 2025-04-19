import { TrustTransparency } from "@/components/trust-transparency"
import { Navbar } from "@/components/navbar"
import { LearnHowItWorks } from "@/components/learn-how-it-works"
import { trustPageContent } from "@/lib/learn-how-it-works-content"

export default function TrustPage() {
  return (
    <>
      <Navbar />
      <TrustTransparency />
      <div className="container py-8">
        <LearnHowItWorks content={trustPageContent} />
      </div>
    </>
  )
}
