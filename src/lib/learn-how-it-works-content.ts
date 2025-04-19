export const tokenizePageContent = {
  title: "How Tokenization Works",
  description: "Learn about the tokenization process and how to convert your assets into digital tokens.",
  sections: [
    {
      title: "What is Asset Tokenization?",
      content:
        "Asset tokenization is the process of converting ownership rights in a real-world asset into digital tokens on a blockchain. This allows for fractional ownership, increased liquidity, and easier transferability of traditionally illiquid assets.",
    },
    {
      title: "Supported Asset Types",
      content:
        "UnityVault supports tokenization of various asset types including real estate properties, art and collectibles, intellectual property rights, and environmental assets like carbon credits and renewable energy certificates.",
    },
    {
      title: "Tokenization Process",
      content:
        "The tokenization process involves four main steps: 1) Asset selection and verification, 2) Document submission and verification, 3) Setting tokenization parameters, and 4) Token creation and distribution. Each step is guided and requires specific documentation to ensure legal compliance.",
    },
    {
      title: "Legal Compliance",
      content:
        "All tokenized assets on UnityVault undergo rigorous verification to ensure legal compliance. This includes ownership verification, valuation reports, and regulatory compliance checks specific to the asset type and jurisdiction.",
    },
    {
      title: "Token Economics",
      content:
        "When you tokenize an asset, you can determine what percentage of the asset to tokenize. Tokens are initially valued at $1 each, with the total token supply equal to the tokenized value of the asset. Token holders receive proportional rights to the asset's value and any income it generates.",
    },
  ],
}

export const lendPageContent = {
  title: "How Lending Works",
  description: "Learn about lending and borrowing assets on the UnityVault platform.",
  sections: [
    {
      title: "Lending Your Assets",
      content:
        "By lending your tokenized assets, you can earn interest on your holdings. Select the asset you want to lend, specify the amount and term, and start earning interest immediately. Interest rates vary based on market demand and asset type.",
    },
    {
      title: "Borrowing Against Collateral",
      content:
        "You can use your tokenized assets as collateral to borrow other assets or stablecoins. The collateralization ratio determines how much you can borrow relative to your collateral value. Higher ratios provide more security against liquidation.",
    },
    {
      title: "Interest Rate Model",
      content:
        "Interest rates are determined dynamically based on the utilization rate of each lending pool. As more assets are borrowed from a pool, both supply and borrow rates increase, creating a balanced market.",
    },
    {
      title: "Liquidation Process",
      content:
        "If your collateral value falls below the required threshold (determined by the health factor), your position may be liquidated to repay the loan. Maintaining a higher collateralization ratio reduces this risk.",
    },
    {
      title: "Risk Management",
      content:
        "Each asset has a specific collateral factor that determines its borrowing power. Assets with higher volatility have lower collateral factors. Monitor your health factor regularly to avoid liquidation.",
    },
  ],
}

export const tradePageContent = {
  title: "How Trading Works",
  description: "Learn about trading tokenized assets on the UnityVault platform.",
  sections: [
    {
      title: "Market Overview",
      content:
        "The trading platform allows you to buy and sell tokenized assets in a secure and transparent marketplace. View real-time price charts, order books, and market depth to make informed trading decisions.",
    },
    {
      title: "Order Types",
      content:
        "UnityVault supports various order types including market orders (execute immediately at current market price), limit orders (execute at a specified price or better), and stop orders (trigger when price reaches a certain level).",
    },
    {
      title: "Trading Pairs",
      content:
        "Assets are traded in pairs, with one asset (the base) being priced in terms of another (the quote). Common quote assets include USDC and other stablecoins. You can view all available trading pairs and their current prices.",
    },
    {
      title: "Fees and Execution",
      content:
        "Trading fees are typically charged as a percentage of the transaction value. Maker orders (adding liquidity) often have lower fees than taker orders (removing liquidity). All trades are executed on-chain for maximum transparency.",
    },
    {
      title: "Portfolio Management",
      content:
        "Track your trading history, open orders, and portfolio performance in real-time. Set price alerts and use advanced charting tools to analyze market trends and optimize your trading strategy.",
    },
  ],
}

export const communityPageContent = {
  title: "How Community Aid Works",
  description: "Learn about supporting global initiatives and participating in community governance.",
  sections: [
    {
      title: "Supporting Projects",
      content:
        "Browse and support verified aid projects around the world. Each project undergoes thorough verification to ensure legitimacy and impact. You can donate any amount and track how your contribution is being used.",
    },
    {
      title: "Impact Tracking",
      content:
        "All donations and project progress are tracked on the blockchain, providing complete transparency. Project creators provide regular updates and milestone achievements, allowing you to see the real-world impact of your contributions.",
    },
    {
      title: "Governance Participation",
      content:
        "Community members can vote on funding proposals, project approvals, and other governance decisions. Your voting power is determined by your platform activity and token holdings.",
    },
    {
      title: "Creating Proposals",
      content:
        "Any community member can submit a funding proposal for a new aid project. Proposals undergo community review and voting before being approved for funding. Detailed guidelines ensure that all proposals meet quality and impact standards.",
    },
    {
      title: "Rewards and Recognition",
      content:
        "Contributors receive impact NFTs as proof of their support, which can be displayed in their profile. Active community members also earn reputation points that increase their influence in governance decisions.",
    },
  ],
}

export const governancePageContent = {
  title: "How Governance Works",
  description: "Learn about participating in the decentralized governance of the UnityVault ecosystem.",
  sections: [
    {
      title: "Governance Overview",
      content:
        "UnityVault governance allows token holders to propose and vote on changes to the protocol. This includes parameter adjustments, asset listings, fee structures, and protocol upgrades.",
    },
    {
      title: "Voting Process",
      content:
        "Proposals go through several stages: creation, discussion, voting, and (if passed) implementation. Voting power is determined by your token holdings, and you can vote 'Yes', 'No', or 'Abstain' on any active proposal.",
    },
    {
      title: "Creating Proposals",
      content:
        "To create a proposal, you need a minimum amount of voting power. Proposals should include a clear title, detailed description, and specific implementation details. Community discussion is encouraged before formal submission.",
    },
    {
      title: "Delegation",
      content:
        "If you don't have time to actively participate in governance, you can delegate your voting power to trusted community members. Delegation transfers only your voting rights, not your tokens, and can be revoked at any time.",
    },
    {
      title: "Implementation",
      content:
        "Passed proposals are implemented after a timelock period, allowing users to prepare for the changes. Implementation details and timelines are communicated through governance announcements and platform notifications.",
    },
  ],
}

export const trustPageContent = {
  title: "How Trust & Transparency Works",
  description: "Learn about the security, verification, and transparency features of the UnityVault platform.",
  sections: [
    {
      title: "Trust Score System",
      content:
        "Your Trust Score reflects the security and reliability of your account and assets. It's calculated based on identity verification, asset verification, compliance status, and security measures. Higher scores provide greater access to platform features.",
    },
    {
      title: "Verification Process",
      content:
        "UnityVault uses a comprehensive verification process for both users and assets. This includes identity verification (KYC/AML), asset ownership verification, legal compliance checks, and security verification.",
    },
    {
      title: "Transaction Verification",
      content:
        "All transactions on the platform are recorded on the blockchain with a trust score. This provides complete transparency and allows users to verify the legitimacy of any transaction.",
    },
    {
      title: "Security Audits",
      content:
        "The platform undergoes regular security audits by independent third-party firms. Audit reports are publicly available, detailing any findings and their resolution status.",
    },
    {
      title: "Transparency Reporting",
      content:
        "UnityVault publishes regular transparency reports covering platform metrics, security status, governance activities, and financial information. This ensures that all users have access to accurate and up-to-date information about the platform.",
    },
  ],
}
