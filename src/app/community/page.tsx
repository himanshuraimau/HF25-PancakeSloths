import { CommunityAidNetwork } from "@/components/community-aid-network"
import { Navbar } from "@/components/navbar"
import { LearnHowItWorks } from "@/components/learn-how-it-works"
import { communityPageContent } from "@/lib/learn-how-it-works-content"

export default function CommunityPage() {
  return (
    <>
      <Navbar />
      <CommunityAidNetwork />
      <div className="container py-8">
        <LearnHowItWorks content={communityPageContent} />
      </div>
    </>
  )
}
