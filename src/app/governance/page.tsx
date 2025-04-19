import { GovernanceCenter } from "@/components/governance-center"
import { Navbar } from "@/components/navbar"
import { LearnHowItWorks } from "@/components/learn-how-it-works"
import { governancePageContent } from "@/lib/learn-how-it-works-content"

export default function GovernancePage() {
  return (
    <>
      <Navbar />
      <GovernanceCenter />
      <div className="container py-8">
        <LearnHowItWorks content={governancePageContent} />
      </div>
    </>
  )
}
