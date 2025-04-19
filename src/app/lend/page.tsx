import { LendingPortal } from "@/components/lending-portal"
import { Navbar } from "@/components/navbar"
import { LearnHowItWorks } from "@/components/learn-how-it-works"
import { lendPageContent } from "@/lib/learn-how-it-works-content"

export default function LendPage() {
  return (
    <>
      <Navbar />
      <LendingPortal />
      <div className="container py-8">
        <LearnHowItWorks content={lendPageContent} />
      </div>
    </>
  )
}
