export type FormData = {
    submissionId: string;
    timestamp: string;

    // S1
    brandName: string;
    foundedYear: string;
    coreProducts: string;
    northStar: string;
    brandArchetype: string;
    competitors: string;

    // S2
    growthGoals: string[];
    targetAudience: string;
    growthBottlenecks: string[];
    growthBottlenecksOther: string; // Separate field for text input

    // S3
    existingAssets: string[];
    assetsConsistency: string;
    brandTone: string[]; // Changed to array based on implementation details
    explorationInterests: string[];

    // S4
    activeChannels: string[];
    marketingExplorations: string[];
    marketingStrategyStyle: string;

    // S5
    priorityContentTypes: string[];
    productionStylePreference: string;
    preProductionNeeds: string[];
    postProductionEnhancements: string[];

    // S6
    existingDigitalCapabilities: string[];
    websitePurpose: string;
    digitalInterests: string[];

    // S7
    wantsAudit: string;
    workingWithAgencies: string;
    workingWithAgenciesDetails: string; // "If yes, where can we..."
    openToBundle: string;
    nextPhaseServices: string[];

    // S8
    satisfactionDefinition: string;
    unsolvedProblems: string;
};

export const INITIAL_DATA: FormData = {
    submissionId: '',
    timestamp: '',
    brandName: '',
    foundedYear: '',
    coreProducts: '',
    northStar: '',
    brandArchetype: '',
    competitors: '',
    growthGoals: [],
    targetAudience: '',
    growthBottlenecks: [],
    growthBottlenecksOther: '',
    existingAssets: [],
    assetsConsistency: '',
    brandTone: [],
    explorationInterests: [],
    activeChannels: [],
    marketingExplorations: [],
    marketingStrategyStyle: '',
    priorityContentTypes: [],
    productionStylePreference: '',
    preProductionNeeds: [],
    postProductionEnhancements: [],
    existingDigitalCapabilities: [],
    websitePurpose: '',
    digitalInterests: [],
    wantsAudit: '',
    workingWithAgencies: '',
    workingWithAgenciesDetails: '',
    openToBundle: '',
    nextPhaseServices: [],
    satisfactionDefinition: '',
    unsolvedProblems: '',
};
