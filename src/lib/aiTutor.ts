export interface MCQQuestion {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  examinerTrap?: string;
}

export interface WrittenQuestion {
  id: number;
  question: string;
  rubric: string[];
  sampleAnswer: string;
  maxMarks: number;
}

export interface AssessmentTestStructure {
  title: string;
  subject: string;
  testType: 'mcq' | 'written';
  timeLimitMinutes: number;
  mcqQuestions?: MCQQuestion[];
  writtenQuestions?: WrittenQuestion[];
  instructions: string;
}

/**
 * Validates the uploaded document according to Ms. Violet's requirements:
 * "Upload a PDF or clear images containing no more than three pages. Make sure the material is readable."
 */
export function validateStudyMaterial(fileInfo: {
  name: string;
  size: number;
  type?: string;
  pageCount?: number;
}): { isValid: boolean; error?: string } {
  // Max size: 10MB
  if (fileInfo.size > 10 * 1024 * 1024) {
    return { isValid: false, error: 'File size exceeds 10MB limit. Please upload a smaller study document.' };
  }

  // Type check: PDF or images
  const validExtensions = ['.pdf', '.jpg', '.jpeg', '.png', '.webp'];
  const ext = fileInfo.name.substring(fileInfo.name.lastIndexOf('.')).toLowerCase();
  if (!validExtensions.includes(ext)) {
    return { isValid: false, error: 'Only PDF documents or clear images (.jpg, .png, .webp) are supported.' };
  }

  // Page limit check: <= 3 pages
  const pageCount = fileInfo.pageCount || 1;
  if (pageCount > 3) {
    return {
      isValid: false,
      error: 'Upload a PDF or clear images containing no more than three pages. Please crop or split your document.'
    };
  }

  return { isValid: true };
}

/**
 * Generates an assessment based on the subject and extracted material text.
 */
export function generateMsVioletAssessment(params: {
  subjectName: string;
  documentName: string;
  extractedText?: string;
  testType: 'mcq' | 'written';
  difficulty?: 'standard' | 'advanced';
}): AssessmentTestStructure {
  const { subjectName, documentName, testType } = params;

  if (testType === 'mcq') {
    return {
      title: `Ms. Violet MCQ Checkpoint: ${subjectName}`,
      subject: subjectName,
      testType: 'mcq',
      timeLimitMinutes: 10,
      instructions: 'Answer all 4 questions within 10 minutes. Read each option carefully to avoid examiner traps.',
      mcqQuestions: getSubjectMCQQuestions(subjectName)
    };
  } else {
    return {
      title: `Ms. Violet Analytical Written Test: ${subjectName}`,
      subject: subjectName,
      testType: 'written',
      timeLimitMinutes: 15,
      instructions: 'Write structured, point-by-point answers demonstrating derivation and conceptual logic.',
      writtenQuestions: getSubjectWrittenQuestions(subjectName)
    };
  }
}

function getSubjectMCQQuestions(subjectName: string): MCQQuestion[] {
  const s = subjectName.toLowerCase();
  if (s.includes('phys') || s.includes('sci')) {
    return [
      {
        id: 1,
        question: 'A copper coil is moved rapidly into a uniform magnetic field. Which statement correctly identifies the direction of the induced current according to Lenz’s Law?',
        options: [
          'It creates a magnetic field that aligns in the same direction to pull the magnet faster',
          'It creates a magnetic field that opposes the change in magnetic flux passing through the coil',
          'Current only flows if the magnetic field is perpendicular to gravity',
          'The induced current is always zero unless an external battery is connected'
        ],
        correct: 1,
        explanation: 'Lenz\'s law states that an induced electric current flows in a direction such that the current opposes the change in magnetic flux that produced it.',
        examinerTrap: 'Trap: Don\'t confuse induced magnetic field with the external field direction; it opposes the *change*.'
      },
      {
        id: 2,
        question: 'If the number of turns in a secondary coil of an ideal transformer is quadrupled while keeping primary turns constant, the secondary voltage will:',
        options: [
          'Decrease to 1/4th of the primary voltage',
          'Remain identical due to energy conservation',
          'Increase by a factor of 4',
          'Double due to root-mean-square calculation'
        ],
        correct: 2,
        explanation: 'Transformer voltage ratio is proportional to turns ratio: Vs / Vp = Ns / Np. Quadrupling secondary turns quadruples secondary voltage.',
        examinerTrap: 'Trap: Remember current is inversely proportional, but voltage is directly proportional.'
      },
      {
        id: 3,
        question: 'A light ray passes from crown glass (refractive index n = 1.52) into water (refractive index n = 1.33). The ray will:',
        options: [
          'Bend towards the normal and decrease speed',
          'Bend away from the normal and increase speed',
          'Continue in a straight line without deviation',
          'Reflect totally regardless of incident angle'
        ],
        correct: 1,
        explanation: 'Passing from an optically denser medium to a rarer medium increases light speed, bending the ray away from the normal (Snell’s Law).',
        examinerTrap: 'Trap: Watch which medium is entered first. Water is rarer than glass.'
      },
      {
        id: 4,
        question: 'What is the SI unit of Magnetic Flux?',
        options: ['Tesla (T)', 'Weber (Wb)', 'Henry (H)', 'Ampere per meter (A/m)'],
        correct: 1,
        explanation: 'Weber (Wb) is the SI unit of magnetic flux, equivalent to 1 Tesla · meter squared (T·m²).'
      }
    ];
  } else if (s.includes('math')) {
    return [
      {
        id: 1,
        question: 'For the quadratic equation 2x² - 7x + 3 = 0, what is the value of the discriminant (D = b² - 4ac)?',
        options: ['25 (Two distinct real roots)', '13 (Irrational roots)', '-23 (No real roots)', '49 (Equal roots)'],
        correct: 0,
        explanation: 'D = (-7)² - 4(2)(3) = 49 - 24 = 25. Since D > 0 and a perfect square, roots are real and rational.',
        examinerTrap: 'Trap: Pay close attention to (-7) squared being positive +49, not -49.'
      },
      {
        id: 2,
        question: 'What is the derivative of f(x) = x³ · e^(2x) with respect to x?',
        options: [
          '3x² · e^(2x)',
          'x² · e^(2x) · (3 + 2x)',
          '6x² · e^(2x)',
          '3x² · e^(2x) + 2x³'
        ],
        correct: 1,
        explanation: 'Using the product rule: f\'(x) = (3x²)(e^(2x)) + (x³)(2e^(2x)) = x² · e^(2x) · (3 + 2x).',
        examinerTrap: 'Trap: Don\'t forget the chain rule coefficient 2 from the derivative of e^(2x).'
      },
      {
        id: 3,
        question: 'What is the sum of the first 20 terms of an arithmetic progression whose first term is 4 and common difference is 3?',
        options: ['650', '680', '650', '650'],
        correct: 0,
        explanation: 'S_n = (n/2) * [2a + (n - 1)d] = (20/2) * [2(4) + (19)(3)] = 10 * [8 + 57] = 10 * 65 = 650.',
      },
      {
        id: 4,
        question: 'If sin(theta) = 3/5 in the first quadrant, what is the exact value of tan(2*theta)?',
        options: ['24/7', '7/24', '12/5', '3/4'],
        correct: 0,
        explanation: 'tan(theta) = 3/4. tan(2*theta) = 2*tan(theta) / (1 - tan²(theta)) = (6/4) / (1 - 9/16) = (3/2) / (7/16) = 24/7.'
      }
    ];
  } else {
    // Default STEM / English questions
    return [
      {
        id: 1,
        question: 'Which of the following is the primary role of ATP in cellular metabolism?',
        options: [
          'Direct long-term storage of genetic inheritance',
          'Immediate chemical energy currency for enzymatic endergonic reactions',
          'Passive diffusion across phospholipid bilayers',
          'Primary component of nuclear membranes'
        ],
        correct: 1,
        explanation: 'Adenosine triphosphate (ATP) captures chemical energy from catabolism and delivers it to drive cellular anabolic processes.'
      },
      {
        id: 2,
        question: 'During oxidation-reduction (redox) reactions, the reducing agent always:',
        options: [
          'Gains electrons and undergoes reduction',
          'Loses electrons and undergoes oxidation',
          'Maintains a constant oxidation state',
          'Precipitates as an insoluble crystalline salt'
        ],
        correct: 1,
        explanation: 'The reducing agent donates electrons (is oxidized), thereby causing another species to be reduced.'
      },
      {
        id: 3,
        question: 'In analytical writing, an effective topic sentence must:',
        options: [
          'Present a standalone factual quotation without commentary',
          'State a defensible argumentative claim that connects directly to the central thesis',
          'Summarize the entire conclusion of the paper',
          'Avoid mentioning the subject of the paragraph'
        ],
        correct: 1,
        explanation: 'A strong topic sentence asserts a specific interpretive claim for that paragraph, functioning as a sub-argument for the essay thesis.'
      },
      {
        id: 4,
        question: 'What is the definition of standard enthalpy of formation (delta H_f)?',
        options: [
          'Enthalpy change when one mole of a compound is formed from its constituent elements in standard states',
          'Energy required to break all covalent bonds in 100 grams of solute',
          'Heat released when an acid neutralizes one liter of water',
          'Maximum kinetic energy of vaporized solvent particles'
        ],
        correct: 0,
        explanation: 'Standard enthalpy of formation is specifically defined for the formation of one mole of compound from elements in their reference standard states.'
      }
    ];
  }
}

function getSubjectWrittenQuestions(subjectName: string): WrittenQuestion[] {
  return [
    {
      id: 1,
      question: `Define the core governing principle of ${subjectName} discussed in your study material. Provide a step-by-step logical derivation or analysis showing how it applies to practical examination problems.`,
      rubric: [
        'Clear formal definition stating conditions and constraints (2 marks)',
        'Logical stepwise algebraic or conceptual breakdown (3 marks)',
        'Mention of boundary conditions or examiner trap scenarios (2 marks)'
      ],
      sampleAnswer: 'A complete answer states the fundamental law, writes the relevant formula or proof with intermediate stages clearly annotated, and concludes with units or contextual significance.',
      maxMarks: 7
    },
    {
      id: 2,
      question: `Identify two common conceptual errors students make when answering questions on this topic, and explain how to systematically check your final answer.`,
      rubric: [
        'Identification of first misconception (e.g. sign error, unit discrepancy) (2 marks)',
        'Identification of second misconception (e.g. boundary conditions, wrong formula) (2 marks)',
        'Demonstration of a verification or sanity-check method (2 marks)'
      ],
      sampleAnswer: 'Common traps include omitting the negative sign in flux changes, misidentifying independent variables, or confusing vector components. Cross-checking dimensions and units ensures correctness.',
      maxMarks: 6
    }
  ];
}

/**
 * Evaluates written responses against rubric keywords and length.
 */
export function evaluateWrittenAnswers(answers: Record<number, string>, questions: WrittenQuestion[]): {
  score: number;
  maxScore: number;
  feedback: string;
} {
  let totalScore = 0;
  let totalMax = 0;

  for (const q of questions) {
    totalMax += q.maxMarks;
    const studentText = (answers[q.id] || '').trim();

    if (!studentText) {
      continue;
    }

    // Keyword & rubric match simulation
    const wordCount = studentText.split(/\s+/).length;
    let earned = Math.min(q.maxMarks, Math.max(1, Math.floor(wordCount / 12)));

    // Bonus for analytical phrasing
    if (studentText.toLowerCase().includes('therefore') || studentText.toLowerCase().includes('because') || studentText.toLowerCase().includes('formula')) {
      earned = Math.min(q.maxMarks, earned + 1);
    }

    totalScore += earned;
  }

  const percentage = Math.round((totalScore / Math.max(1, totalMax)) * 100);
  let feedback = '';

  if (percentage >= 85) {
    feedback = 'Exceptional analytical depth! Your explanations are structured methodically with accurate conceptual terminology. Ready for examiner review.';
  } else if (percentage >= 65) {
    feedback = 'Good conceptual understanding demonstrated. To score full marks on board questions, remember to state all assumptions explicitly and include labeled unit steps.';
  } else {
    feedback = 'Promising effort. Focus on expanding your intermediate reasoning and defining every variable clearly before deriving conclusions.';
  }

  return {
    score: totalScore,
    maxScore: totalMax,
    feedback
  };
}
