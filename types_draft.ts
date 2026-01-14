export type FormData = {
    // Meta
    submissionId: string;
    timestamp: string;

    // Section 1: Brand Profile
    brandName: string;
    foundedYear: string;
    coreProducts: string;
    northStar: string;
    brandArchetype: string;
    competitors: string;

    // Section 2: Business Goals
    growthGoals: string[]; // Multi-select
    targetAudience: string;
    growthBottlenecks: string[]; // Multi-select or text? "Current Bottlenecks You Face in Growth" -> List provided, plus "Other". Treat as array.

    // Section 3: Brand Identity
    existingAssets: string[];
    assetsConsistency: string;
    brandTone: string; // Single or Multi? "Your brand tone is" -> usually single select if not specified, but list implies selection. Logic says maybe multi. Prompt says "Your brand tone is:" singular. I'll stick to single or multi. Let's make it array to be safe or string if single. "single select" was specified for Archetype, not Tone. I'll use array.
    explorationInterests: string[];

    // Section 4: Strategic Marketing
    activeChannels: string[];
    marketingExplorations: string[];
    marketingStrategyStyle: string; // "Style" implies singular? Or multi? Likely single.

    // Section 5: Visual Production
    priorityContentTypes: string[];
    productionStylePreference: string;
    preProductionNeeds: string[];
    postProductionEnhancements: string[];

    // Section 6: Web, UI/UX
    existingDigitalCapabilities: string[];
    websitePurpose: string; // "Purpose" -> Likely single, or primary.
    digitalInterests: string[];

    // Section 7: Opportunity Mapping
    wantsAudit: string; // Yes/No
    workingWithAgencies: string; // Yes/No
    collaborationNotes: string;
    openToBundle: string; // Yes/No
    nextPhaseServices: string[];

    // Section 8: Feedback
    satisfactionDefinition: string;
    unsolvedProblems: string;
};
