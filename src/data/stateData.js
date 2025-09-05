export const stateData = {
  CA: {
    state: "California",
    rightsSummary: [
      "You have the right to remain silent",
      "You have the right to refuse searches without a warrant",
      "You have the right to ask if you're free to leave",
      "You have the right to an attorney"
    ],
    donts: [
      "Don't resist, even if you believe the stop is unfair",
      "Don't argue or be confrontational",
      "Don't consent to searches",
      "Don't provide false information"
    ],
    scriptEnglish: "Officer, I am exercising my right to remain silent. I do not consent to any searches. Am I free to leave?",
    scriptSpanish: "Oficial, estoy ejerciendo mi derecho a permanecer en silencio. No consiento a ningún registro. ¿Soy libre de irme?",
    legalAlerts: [
      "New body camera requirements for all traffic stops",
      "Updated police accountability measures effective 2024"
    ]
  },
  NY: {
    state: "New York",
    rightsSummary: [
      "You have the right to remain silent",
      "You have the right to refuse consent to search",
      "You have the right to ask for a lawyer",
      "You have the right to record police interactions"
    ],
    donts: [
      "Don't run or resist arrest",
      "Don't touch the officer",
      "Don't lie or provide false documents",
      "Don't consent to vehicle searches"
    ],
    scriptEnglish: "I invoke my right to remain silent and my right to an attorney. I do not consent to any search.",
    scriptSpanish: "Invoco mi derecho a permanecer en silencio y mi derecho a un abogado. No consiento a ningún registro.",
    legalAlerts: [
      "Stop and frisk guidelines updated",
      "New civilian complaint review process"
    ]
  },
  TX: {
    state: "Texas",
    rightsSummary: [
      "You have the right to remain silent",
      "You have the right to refuse consent to search",
      "You have the right to ask if you're detained",
      "You have the right to an attorney"
    ],
    donts: [
      "Don't reach for anything without permission",
      "Don't make sudden movements",
      "Don't argue about the law",
      "Don't consent to searches"
    ],
    scriptEnglish: "I am exercising my right to remain silent. I do not consent to searches. Am I being detained?",
    scriptSpanish: "Estoy ejerciendo mi derecho a permanecer en silencio. No consiento registros. ¿Estoy siendo detenido?",
    legalAlerts: [
      "Open carry laws updated",
      "New dashboard camera requirements"
    ]
  },
  FL: {
    state: "Florida",
    rightsSummary: [
      "You have the right to remain silent",
      "You have the right to refuse searches",
      "You have the right to record interactions",
      "You have the right to ask for identification"
    ],
    donts: [
      "Don't interfere with the investigation",
      "Don't provide false information",
      "Don't consent to searches",
      "Don't resist or flee"
    ],
    scriptEnglish: "I choose to exercise my right to remain silent. I do not consent to any searches.",
    scriptSpanish: "Elijo ejercer mi derecho a permanecer en silencio. No consiento a ningún registro.",
    legalAlerts: [
      "Stand Your Ground law clarifications",
      "New police transparency requirements"
    ]
  }
};

export const scenarios = [
  {
    id: "traffic-stop",
    name: "Traffic Stop",
    icon: "🚗",
    description: "Being pulled over while driving"
  },
  {
    id: "street-encounter",
    name: "Street Encounter", 
    icon: "🚶",
    description: "Being approached or questioned on the street"
  },
  {
    id: "home-visit",
    name: "Home Visit",
    icon: "🏠", 
    description: "Police at your door or residence"
  },
  {
    id: "arrest",
    name: "Arrest Situation",
    icon: "👮",
    description: "Being arrested or detained"
  }
];