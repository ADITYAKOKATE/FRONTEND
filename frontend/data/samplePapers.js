// Sample NASA Biology Research Papers Data
// This file contains sample data for development and testing

const samplePapers = [
  {
    _id: "507f1f77bcf86cd799439011",
    title: "Effects of Microgravity on Human Cardiovascular System During Long-Duration Spaceflight",
    authors: [
      { name: "Dr. Sarah Chen", affiliation: "NASA Johnson Space Center" },
      { name: "Dr. Michael Rodriguez", affiliation: "Baylor College of Medicine" },
      { name: "Dr. Emily Watson", affiliation: "Harvard Medical School" }
    ],
    abstract: "This study examines the cardiovascular adaptations in astronauts during extended missions aboard the International Space Station. We monitored 12 astronauts over 6-month periods, measuring cardiac output, blood pressure, and vascular resistance. Results show significant cardiovascular deconditioning with implications for future Mars missions.",
    keywords: ["microgravity", "cardiovascular", "long-duration", "spaceflight", "human physiology"],
    organism: "Human",
    mission: {
      name: "ISS Expedition 45-46",
      year: 2015,
      duration: "6 months"
    },
    spaceEnvironment: "ISS",
    researchArea: "Physiology",
    publicationDate: "2016-03-15T00:00:00.000Z",
    journal: "Journal of Applied Physiology",
    doi: "10.1152/japplphysiol.01234.2015",
    url: "https://journals.physiology.org/doi/10.1152/japplphysiol.01234.2015",
    summary: "Long-duration spaceflight causes significant cardiovascular deconditioning in astronauts, with reduced cardiac output and increased vascular resistance. These findings have critical implications for future Mars missions requiring extended space travel.",
    keyFindings: [
      "Cardiac output decreased by 15% after 6 months in space",
      "Blood pressure regulation was impaired in microgravity",
      "Vascular resistance increased significantly during spaceflight",
      "Recovery time on Earth averaged 3-4 weeks"
    ],
    methodology: "Longitudinal study of 12 astronauts using continuous cardiovascular monitoring, echocardiography, and blood pressure measurements during 6-month ISS missions.",
    results: "Significant cardiovascular deconditioning was observed in all subjects, with cardiac output decreasing by an average of 15% and vascular resistance increasing by 22% after 6 months in microgravity.",
    conclusions: "Extended spaceflight poses significant cardiovascular challenges that must be addressed for future long-duration missions to Mars and beyond.",
    recommendations: [
      "Develop countermeasures for cardiovascular deconditioning",
      "Implement pre-flight cardiovascular conditioning programs",
      "Monitor cardiovascular health continuously during missions"
    ],
    tags: ["cardiovascular", "microgravity", "long-duration", "countermeasures"],
    citationCount: 45,
    impactScore: 8.2,
    relatedPapers: [],
    createdAt: "2024-01-15T00:00:00.000Z",
    updatedAt: "2024-01-15T00:00:00.000Z"
  },
  {
    _id: "507f1f77bcf86cd799439012",
    title: "Plant Growth and Development in Lunar Regolith Simulant",
    authors: [
      { name: "Dr. Maria Santos", affiliation: "University of Arizona" },
      { name: "Dr. James Thompson", affiliation: "NASA Kennedy Space Center" },
      { name: "Dr. Lisa Park", affiliation: "Cornell University" }
    ],
    abstract: "This research investigates the feasibility of growing food crops in lunar regolith simulant under controlled conditions. We tested various plant species including lettuce, radishes, and tomatoes in simulated lunar soil with different nutrient amendments. Results demonstrate potential for sustainable agriculture on the Moon.",
    keywords: ["lunar regolith", "plant growth", "space agriculture", "food production", "sustainability"],
    organism: "Plant",
    mission: {
      name: "Lunar Agriculture Experiment",
      year: 2023,
      duration: "12 months"
    },
    spaceEnvironment: "Ground Control",
    researchArea: "Botany",
    publicationDate: "2023-11-20T00:00:00.000Z",
    journal: "Nature Plants",
    doi: "10.1038/s41477-023-01567-8",
    url: "https://www.nature.com/articles/s41477-023-01567-8",
    summary: "Plants can successfully grow in lunar regolith simulant with proper nutrient supplementation, demonstrating the potential for sustainable agriculture on the Moon to support future lunar colonies.",
    keyFindings: [
      "Lettuce achieved 85% of Earth-grown biomass in lunar simulant",
      "Radishes showed improved root development in regolith",
      "Tomatoes required additional calcium supplementation",
      "Microbial communities adapted to regolith environment"
    ],
    methodology: "Controlled greenhouse experiments using JSC-1A lunar regolith simulant with various nutrient amendments and plant species over 12-month period.",
    results: "All tested plant species showed successful growth in lunar regolith simulant with appropriate nutrient supplementation, achieving 70-90% of Earth-grown biomass.",
    conclusions: "Lunar agriculture is feasible with proper soil amendments and nutrient management, providing a foundation for sustainable food production on the Moon.",
    recommendations: [
      "Develop specialized nutrient formulations for lunar regolith",
      "Test additional crop varieties for lunar agriculture",
      "Investigate closed-loop nutrient recycling systems"
    ],
    tags: ["lunar agriculture", "regolith", "sustainability", "food production"],
    citationCount: 23,
    impactScore: 7.8,
    relatedPapers: [],
    createdAt: "2024-01-15T00:00:00.000Z",
    updatedAt: "2024-01-15T00:00:00.000Z"
  },
  {
    _id: "507f1f77bcf86cd799439013",
    title: "Microbial Adaptation to Space Environment: Implications for Life Support Systems",
    authors: [
      { name: "Dr. Alex Kim", affiliation: "MIT" },
      { name: "Dr. Rachel Green", affiliation: "NASA Ames Research Center" },
      { name: "Dr. David Wilson", affiliation: "Stanford University" }
    ],
    abstract: "This study examines how microorganisms adapt to the space environment and their potential role in life support systems. We analyzed microbial communities from ISS samples and conducted ground-based experiments simulating space conditions. Results show remarkable adaptability of certain microbial species.",
    keywords: ["microorganisms", "space adaptation", "life support", "microbiome", "ISS"],
    organism: "Microorganism",
    mission: {
      name: "ISS Microbial Monitoring",
      year: 2022,
      duration: "18 months"
    },
    spaceEnvironment: "ISS",
    researchArea: "Microbiology",
    publicationDate: "2022-09-10T00:00:00.000Z",
    journal: "Astrobiology",
    doi: "10.1089/ast.2022.0123",
    url: "https://www.liebertpub.com/doi/10.1089/ast.2022.0123",
    summary: "Microorganisms demonstrate remarkable adaptability to space conditions, with potential applications in life support systems and waste processing for future space missions.",
    keyFindings: [
      "Certain bacteria showed enhanced growth rates in microgravity",
      "Microbial communities became more diverse over time",
      "Some species developed resistance to radiation",
      "Waste processing efficiency improved with adapted microbes"
    ],
    methodology: "Analysis of ISS microbial samples combined with ground-based experiments simulating space conditions including microgravity, radiation, and altered atmospheric composition.",
    results: "Microbial communities showed significant adaptation to space conditions, with increased diversity and enhanced metabolic capabilities for waste processing and life support applications.",
    conclusions: "Microorganisms represent a valuable resource for developing sustainable life support systems for long-duration space missions.",
    recommendations: [
      "Develop microbial-based life support systems",
      "Investigate radiation-resistant microbial strains",
      "Test microbial waste processing capabilities"
    ],
    tags: ["microbiology", "life support", "adaptation", "waste processing"],
    citationCount: 67,
    impactScore: 8.9,
    relatedPapers: [],
    createdAt: "2024-01-15T00:00:00.000Z",
    updatedAt: "2024-01-15T00:00:00.000Z"
  },
  {
    _id: "507f1f77bcf86cd799439014",
    title: "Psychological Effects of Isolation and Confinement During Mars Simulation Mission",
    authors: [
      { name: "Dr. Jennifer Martinez", affiliation: "University of Hawaii" },
      { name: "Dr. Robert Chen", affiliation: "NASA Human Research Program" },
      { name: "Dr. Amanda Foster", affiliation: "Johns Hopkins University" }
    ],
    abstract: "This study examines the psychological impact of isolation and confinement on crew members during a 12-month Mars simulation mission. We monitored psychological well-being, team dynamics, and cognitive performance throughout the mission. Results provide insights for future Mars missions.",
    keywords: ["psychology", "isolation", "confinement", "Mars simulation", "team dynamics"],
    organism: "Human",
    mission: {
      name: "HI-SEAS Mars Simulation",
      year: 2021,
      duration: "12 months"
    },
    spaceEnvironment: "Ground Control",
    researchArea: "Psychology",
    publicationDate: "2021-12-05T00:00:00.000Z",
    journal: "Acta Astronautica",
    doi: "10.1016/j.actaastro.2021.12.001",
    url: "https://www.sciencedirect.com/science/article/pii/S0094576521001234",
    summary: "Extended isolation and confinement during Mars simulation missions significantly impact psychological well-being and team dynamics, highlighting the need for comprehensive psychological support systems for future Mars missions.",
    keyFindings: [
      "Depression symptoms increased during months 3-6 of isolation",
      "Team cohesion decreased significantly after month 8",
      "Cognitive performance remained stable throughout mission",
      "Individual coping strategies varied significantly"
    ],
    methodology: "Longitudinal psychological assessment of 6 crew members during 12-month Mars simulation mission using standardized questionnaires, cognitive tests, and behavioral observations.",
    results: "Significant psychological challenges emerged during extended isolation, with depression symptoms peaking in months 3-6 and team cohesion declining after month 8.",
    conclusions: "Future Mars missions must include robust psychological support systems and crew selection criteria to ensure mission success and crew well-being.",
    recommendations: [
      "Develop psychological support protocols for Mars missions",
      "Implement regular mental health monitoring",
      "Train crews in stress management techniques",
      "Design habitats to minimize psychological stressors"
    ],
    tags: ["psychology", "isolation", "Mars mission", "team dynamics"],
    citationCount: 89,
    impactScore: 9.1,
    relatedPapers: [],
    createdAt: "2024-01-15T00:00:00.000Z",
    updatedAt: "2024-01-15T00:00:00.000Z"
  },
  {
    _id: "507f1f77bcf86cd799439015",
    title: "Radiation Effects on Plant DNA and Implications for Space Agriculture",
    authors: [
      { name: "Dr. Thomas Anderson", affiliation: "University of California, Davis" },
      { name: "Dr. Sarah Lee", affiliation: "NASA Goddard Space Flight Center" },
      { name: "Dr. Michael Brown", affiliation: "University of Wisconsin" }
    ],
    abstract: "This research investigates the effects of space radiation on plant DNA and genetic stability. We exposed various plant species to simulated space radiation conditions and analyzed DNA damage, mutation rates, and reproductive success. Results inform space agriculture strategies.",
    keywords: ["radiation", "plant DNA", "genetics", "space agriculture", "mutations"],
    organism: "Plant",
    mission: {
      name: "Space Radiation Biology Experiment",
      year: 2020,
      duration: "24 months"
    },
    spaceEnvironment: "Deep Space",
    researchArea: "Genetics",
    publicationDate: "2020-08-15T00:00:00.000Z",
    journal: "Plant Biology",
    doi: "10.1111/plb.13123",
    url: "https://onlinelibrary.wiley.com/doi/10.1111/plb.13123",
    summary: "Space radiation causes significant DNA damage in plants, but certain species show remarkable resistance and adaptation mechanisms that could be harnessed for space agriculture.",
    keyFindings: [
      "DNA damage increased 3-fold in exposed plants",
      "Mutation rates were 5x higher than Earth controls",
      "Some species developed radiation resistance",
      "Reproductive success decreased by 40%"
    ],
    methodology: "Controlled radiation exposure experiments using gamma rays and cosmic ray simulants on various plant species, with DNA analysis and reproductive tracking over 24 months.",
    results: "Space radiation significantly impacts plant DNA integrity and reproductive success, but some species demonstrate natural resistance mechanisms that could be enhanced through breeding.",
    conclusions: "Space agriculture must account for radiation effects on plant genetics, with potential for developing radiation-resistant crop varieties.",
    recommendations: [
      "Develop radiation-resistant crop varieties",
      "Implement radiation shielding for space agriculture",
      "Monitor genetic stability in space-grown plants",
      "Investigate natural radiation resistance mechanisms"
    ],
    tags: ["radiation biology", "genetics", "space agriculture", "DNA damage"],
    citationCount: 156,
    impactScore: 8.7,
    relatedPapers: [],
    createdAt: "2024-01-15T00:00:00.000Z",
    updatedAt: "2024-01-15T00:00:00.000Z"
  }
];

// Additional sample papers for a more comprehensive dataset
const additionalPapers = [
  {
    _id: "507f1f77bcf86cd799439016",
    title: "Nutritional Requirements for Long-Duration Space Missions",
    authors: [
      { name: "Dr. Patricia Williams", affiliation: "NASA Human Research Program" },
      { name: "Dr. Kevin Zhang", affiliation: "Tufts University" }
    ],
    abstract: "Comprehensive analysis of nutritional needs for astronauts during extended space missions, including vitamin D synthesis, bone health, and muscle maintenance requirements.",
    keywords: ["nutrition", "vitamins", "bone health", "long-duration", "spaceflight"],
    organism: "Human",
    mission: { name: "Nutrition Study", year: 2019, duration: "6 months" },
    spaceEnvironment: "ISS",
    researchArea: "Nutrition",
    publicationDate: "2019-05-20T00:00:00.000Z",
    journal: "Space Medicine",
    summary: "Astronauts require specialized nutritional protocols to maintain health during long-duration space missions, with particular attention to vitamin D and bone health.",
    keyFindings: ["Vitamin D deficiency common in space", "Bone density decreases 1-2% per month", "Protein requirements increase by 20%"],
    citationCount: 34,
    impactScore: 7.5,
    relatedPapers: []
  },
  {
    _id: "507f1f77bcf86cd799439017",
    title: "Animal Behavior in Microgravity: Rodent Studies on the ISS",
    authors: [
      { name: "Dr. Lisa Johnson", affiliation: "NASA Ames Research Center" },
      { name: "Dr. Mark Davis", affiliation: "University of California, Berkeley" }
    ],
    abstract: "Study of rodent behavior and physiology in microgravity environment aboard the International Space Station, providing insights into animal adaptation to space conditions.",
    keywords: ["rodents", "behavior", "microgravity", "animal studies", "ISS"],
    organism: "Animal",
    mission: { name: "Rodent Research", year: 2018, duration: "3 months" },
    spaceEnvironment: "ISS",
    researchArea: "Physiology",
    publicationDate: "2018-11-10T00:00:00.000Z",
    journal: "Animal Behavior",
    summary: "Rodents show remarkable adaptation to microgravity, with altered movement patterns but maintained social behaviors and cognitive function.",
    keyFindings: ["Movement patterns adapted to microgravity", "Social behaviors maintained", "Cognitive function preserved"],
    citationCount: 28,
    impactScore: 6.9,
    relatedPapers: []
  }
];

// Combine all sample papers
const allSamplePapers = [...samplePapers, ...additionalPapers];

// Export for use in data seeding
export default allSamplePapers;

// Individual exports for specific use cases
export { samplePapers, additionalPapers };
