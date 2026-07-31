// 10 Worlds x 10 Levels = 100 Levels total static config
export const WORLDS = [
  {
    id: 1,
    name: "Addition & Subtraction Fluency",
    subtitle: "Single-digit to 3-digit with regrouping",
    icon: "➕",
    gradient: "from-emerald-500 to-teal-700",
    border: "border-emerald-500",
    badge: "White Belt",
    description: "Master basic calculation speed, place value addition, and subtraction regrouping."
  },
  {
    id: 2,
    name: "Multiplication Tables & Concepts",
    subtitle: "Tables 2–12, array models & word problems",
    icon: "✖️",
    gradient: "from-cyan-500 to-blue-700",
    border: "border-cyan-500",
    badge: "Yellow Belt",
    description: "Build table fluency from 2x2 to 12x12 and solve real-life multiplicative scenarios."
  },
  {
    id: 3,
    name: "Division Basics & Remainders",
    subtitle: "Equal sharing, long division & remainders",
    icon: "➗",
    gradient: "from-blue-500 to-indigo-700",
    border: "border-blue-500",
    badge: "Orange Belt",
    description: "Understand division as inverse multiplication and master quotient-remainder calculations."
  },
  {
    id: 4,
    name: "Fractions I: Fundamentals",
    subtitle: "Identification, equivalence & same denominators",
    icon: "🍕",
    gradient: "from-indigo-500 to-purple-700",
    border: "border-indigo-500",
    badge: "Green Belt",
    description: "Visual fraction models, comparing numerators, and like-denominator arithmetic."
  },
  {
    id: 5,
    name: "Fractions II: Advanced Operations",
    subtitle: "Unlike denominators, mixed numbers & improper fractions",
    icon: "🍰",
    gradient: "from-purple-500 to-pink-700",
    border: "border-purple-500",
    badge: "Blue Belt",
    description: "LCM calculations, fraction conversions, and multi-step fraction operations."
  },
  {
    id: 6,
    name: "Decimals & Place Value",
    subtitle: "Tenths, hundredths, operations & rounding",
    icon: "🔢",
    gradient: "from-pink-500 to-rose-700",
    border: "border-pink-500",
    badge: "Purple Belt",
    description: "Decimal place values, alignment during addition/subtraction, and decimal scaling."
  },
  {
    id: 7,
    name: "Percentages & Ratios",
    subtitle: "Proportions, discounts, simple interest & ratios",
    icon: "🏷️",
    gradient: "from-amber-500 to-orange-700",
    border: "border-amber-500",
    badge: "Red Belt",
    description: "Convert between fractions and percents, calculate sale prices, and ratio scaling."
  },
  {
    id: 8,
    name: "Basic Geometry & Measurement",
    subtitle: "Shapes, perimeter, area, angles & symmetry",
    icon: "📐",
    gradient: "from-lime-500 to-emerald-700",
    border: "border-lime-500",
    badge: "Brown Belt",
    description: "Calculate 2D shape perimeters, polygon areas, missing angles, and spatial properties."
  },
  {
    id: 9,
    name: "Logical & Pattern Reasoning",
    subtitle: "Number series, magic squares & algebraic puzzles",
    icon: "🧩",
    gradient: "from-fuchsia-500 to-purple-800",
    border: "border-fuchsia-500",
    badge: "Black Belt",
    description: "Spot complex number rules, evaluate sequence terms, and solve balance puzzles."
  },
  {
    id: 10,
    name: "Grandmaster Mixed Mastery",
    subtitle: "Comprehensive curriculum challenge & Boss Battles",
    icon: "🥷",
    gradient: "from-rose-600 via-purple-600 to-amber-500",
    border: "border-amber-400",
    badge: "Grandmaster Ninja",
    description: "The ultimate test! Speed round mixed topics with strict timed boss levels."
  }
];

// Generate 100 levels config programmatically
export const LEVELS = Array.from({ length: 100 }, (_, index) => {
  const id = index + 1;
  const worldId = Math.ceil(id / 10);
  const levelInWorld = ((id - 1) % 10) + 1;
  const isBoss = levelInWorld === 10;
  
  // Topic mapping per world
  const topicKeys = [
    'add_sub', 'multiplication', 'division', 'fractions_1', 'fractions_2',
    'decimals', 'percentages', 'geometry', 'patterns', 'mixed'
  ];
  const topic = topicKeys[worldId - 1];

  return {
    id,
    worldId,
    levelInWorld,
    topic,
    title: isBoss ? `World ${worldId} Boss Battle! 🏆` : `Level ${id}: ${getLevelSubTitle(worldId, levelInWorld)}`,
    masteryThreshold: isBoss ? 85 : 80, // 85% for boss levels, 80% for regular
    timeLimitPerQuestion: isBoss ? 12 : 20, // seconds
    questionCount: isBoss ? 7 : 5,
    difficultyTier: Math.min(5, Math.ceil(levelInWorld / 2)), // 1 to 5 within world
    isBoss,
    xpReward: isBoss ? 250 : 100
  };
});

function getLevelSubTitle(worldId, levelInWorld) {
  const titles = {
    1: ["Single-digit Add", "Single-digit Sub", "Double-digit Add (No Carry)", "Double-digit Sub (No Borrow)", "Add with Carrying", "Sub with Borrowing", "3-Digit Addition", "3-Digit Subtraction", "Mixed Add/Sub Speed", "Boss: Addition Mastery"],
    2: ["2s & 3s Tables", "4s & 5s Tables", "6s & 7s Tables", "8s & 9s Tables", "10s & 11s & 12s Tables", "Multiplication Array Word Problems", "Double-digit x 1-digit", "Multiplication Properties", "Missing Factor Puzzles", "Boss: Multiplication Mastery"],
    3: ["Simple Sharing", "Division Facts 2-5", "Division Facts 6-10", "Dividing 2-digits", "Division with Remainder Intro", "Finding Remainders", "Word Problems: Sharing", "Divisibility Rules", "Multi-step Division", "Boss: Division Mastery"],
    4: ["Recognizing Fractions", "Numerator & Denominator", "Equivalent Fraction Intro", "Comparing Like Denominators", "Adding Same Denominator", "Subtracting Same Denominator", "Fraction Word Problems", "Fractions on Number Line", "Simplifying Fractions", "Boss: Fraction Fundamentals"],
    5: ["Unlike Denominator Addition", "Unlike Denominator Subtraction", "Finding Common Denominator", "Improper to Mixed Numbers", "Mixed Number to Improper", "Adding Mixed Numbers", "Subtracting Mixed Numbers", "Fraction Multiplication Intro", "Real-world Fraction Word Problems", "Boss: Advanced Fraction Mastery"],
    6: ["Decimal Place Value (Tenths)", "Hundredths & Thousandths", "Decimal Comparison", "Adding Decimals", "Subtracting Decimals", "Multiplying Decimals by 10/100", "Dividing Decimals by 10", "Rounding Decimals", "Money & Price Calculations", "Boss: Decimal Mastery"],
    7: ["Percent Meaning (out of 100)", "Converting % to Fractions", "Converting Fractions to %", "Finding % of a Number", "Discount Calculations", "Tax & Tip Word Problems", "Ratio Basics (A:B)", "Equivalent Ratios", "Simple Interest Formula", "Boss: Percent & Ratio Mastery"],
    8: ["2D Shape Properties", "Perimeter of Rectangles & Triangles", "Area of Rectangles", "Area of Triangles", "Identifying Angles (Acute/Obtuse/Right)", "Missing Angles in Triangles", "Circle Radius & Diameter", "3D Shape Faces & Edges", "Symmetry & Reflections", "Boss: Geometry Mastery"],
    9: ["Arithmetic Sequences (+/-)", "Geometric Sequences (x/÷)", "Two-step Pattern Rules", "Missing Number Grids", "Symbol Substitution Puzzles", "Magic Square Challenges", "Logic Matrix Riddles", "Input-Output Function Machines", "Balance Scale Equivalence", "Boss: Logic Ninja Mastery"],
    10: ["Speed Run: Arithmetic", "Speed Run: Tables & Division", "Speed Run: Fractions", "Speed Run: Decimals & Percents", "Speed Run: Geometry", "Speed Run: Patterns", "High Difficulty Challenge", "Grand Master Test I", "Grand Master Test II", "FINAL BOSS: GRANDMASTER NINJA 🥷"]
  };
  return titles[worldId]?.[levelInWorld - 1] || `Concept Focus ${levelInWorld}`;
}
