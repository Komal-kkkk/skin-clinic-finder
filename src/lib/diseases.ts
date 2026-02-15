export interface Disease {
  id: string;
  name: string;
  description: string;
  symptoms: string[];
  category: "bacterial" | "fungal" | "viral" | "parasitic";
}

export const diseases: Disease[] = [
  {
    id: "cellulitis",
    name: "Cellulitis",
    description: "A common bacterial skin infection causing redness, swelling, and pain in the affected area.",
    symptoms: ["redness", "swelling", "warmth", "pain", "fever"],
    category: "bacterial",
  },
  {
    id: "impetigo",
    name: "Impetigo",
    description: "A highly contagious bacterial skin infection forming sores and blisters, most common in children.",
    symptoms: ["blisters", "crusting", "itching", "sores", "redness"],
    category: "bacterial",
  },
  {
    id: "athlete-foot",
    name: "Athlete's Foot",
    description: "A fungal infection affecting the skin on feet, causing itching, scaling, and redness.",
    symptoms: ["itching", "scaling", "redness", "cracking", "burning"],
    category: "fungal",
  },
  {
    id: "nail-fungus",
    name: "Nail Fungus",
    description: "A fungal infection of the nails causing discoloration, thickening, and crumbling at the edge.",
    symptoms: ["discoloration", "thickening", "brittleness", "distortion", "debris"],
    category: "fungal",
  },
  {
    id: "ringworm",
    name: "Ringworm",
    description: "A contagious fungal infection causing a ring-shaped, red, itchy rash on the skin.",
    symptoms: ["ring-shaped rash", "itching", "redness", "scaling", "blisters"],
    category: "fungal",
  },
  {
    id: "cutaneous-larva-migrans",
    name: "Cutaneous Larva Migrans",
    description: "A parasitic skin infection caused by hookworm larvae, creating winding, raised tracks on the skin.",
    symptoms: ["winding tracks", "itching", "redness", "raised lines", "blisters"],
    category: "parasitic",
  },
  {
    id: "chickenpox",
    name: "Chickenpox",
    description: "A highly contagious viral infection causing an itchy rash with fluid-filled blisters.",
    symptoms: ["blisters", "itching", "fever", "fatigue", "rash"],
    category: "viral",
  },
  {
    id: "shingles",
    name: "Shingles",
    description: "A viral infection causing a painful rash, occurring in people who have had chickenpox.",
    symptoms: ["painful rash", "blisters", "burning", "numbness", "tingling"],
    category: "viral",
  },
];

export interface DiagnosticQuestion {
  id: number;
  question: string;
  weight: number;
}

export const diagnosticQuestions: DiagnosticQuestion[] = [
  { id: 1, question: "Is the affected area red or inflamed?", weight: 1 },
  { id: 2, question: "Do you experience itching or burning sensation?", weight: 1 },
  { id: 3, question: "Are there visible blisters or sores on the skin?", weight: 1 },
  { id: 4, question: "Has the condition been spreading to other areas?", weight: 1 },
  { id: 5, question: "Do you have fever or feel generally unwell?", weight: 1 },
  { id: 6, question: "Is there any discharge or oozing from the affected area?", weight: 1 },
  { id: 7, question: "Has the skin texture changed (thickening, scaling, cracking)?", weight: 1 },
  { id: 8, question: "Have you been in contact with someone who has a similar condition?", weight: 1 },
  { id: 9, question: "Has the condition persisted for more than a week?", weight: 1 },
  { id: 10, question: "Does the affected area feel warm to the touch?", weight: 1 },
];

export function calculateSeverity(yesCount: number): { level: string; color: string; description: string } {
  if (yesCount <= 3) {
    return {
      level: "Mild",
      color: "text-success",
      description: "Your symptoms suggest a mild condition. Home remedies and over-the-counter treatments may help. Monitor the condition and consult a doctor if it worsens.",
    };
  } else if (yesCount <= 6) {
    return {
      level: "Moderate",
      color: "text-warning",
      description: "Your symptoms suggest a moderate condition. We recommend consulting a dermatologist for proper diagnosis and treatment.",
    };
  } else {
    return {
      level: "Severe",
      color: "text-destructive",
      description: "Your symptoms suggest a potentially severe condition. Please seek medical attention promptly for professional evaluation and treatment.",
    };
  }
}
