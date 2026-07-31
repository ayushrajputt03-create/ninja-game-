import { TOPIC_EXPLANATIONS } from '../data/explanationsData';

// Utility for integer random in range [min, max]
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Utility to shuffle array
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Generate 4 distinct options including correct answer and smart distractors
function createOptions(correctVal, distractorFunc) {
  const options = new Set();
  options.add(correctVal);

  let attempts = 0;
  while (options.size < 4 && attempts < 30) {
    attempts++;
    const d = distractorFunc(correctVal, options.size);
    if (d !== undefined && d !== null && !Number.isNaN(d) && d !== correctVal) {
      options.add(d);
    }
  }

  // Fallbacks if distractors didn't yield 4 unique options
  let offset = 1;
  while (options.size < 4) {
    if (typeof correctVal === 'number') {
      options.add(correctVal + offset);
      options.add(correctVal - offset > 0 ? correctVal - offset : correctVal + offset + 2);
    } else {
      options.add(`Option ${options.size + 1}`);
    }
    offset++;
  }

  return shuffle(Array.from(options));
}

// MAIN PROCEDURAL GENERATOR
export function generateQuestion(level, currentDifficultyTier = 1, weakTopics = []) {
  const { topic, worldId, isBoss } = level;
  // Effective tier scales with level & adaptive adjustment
  const tier = Math.min(5, Math.max(1, currentDifficultyTier));

  // Determine actual topic (if mixed or weak spot override)
  let activeTopic = topic;
  if (topic === 'mixed') {
    const choices = ['add_sub', 'multiplication', 'division', 'fractions_1', 'decimals', 'percentages', 'geometry', 'patterns'];
    activeTopic = choices[randInt(0, choices.length - 1)];
  }

  // 10% chance to inject a weak spot if available
  if (weakTopics.length > 0 && Math.random() < 0.25 && topic !== 'mixed') {
    activeTopic = weakTopics[randInt(0, weakTopics.length - 1)];
  }

  switch (activeTopic) {
    case 'add_sub':
      return genAddSub(tier);
    case 'multiplication':
      return genMultiplication(tier);
    case 'division':
      return genDivision(tier);
    case 'fractions_1':
      return genFractions1(tier);
    case 'fractions_2':
      return genFractions2(tier);
    case 'decimals':
      return genDecimals(tier);
    case 'percentages':
      return genPercentages(tier);
    case 'geometry':
      return genGeometry(tier);
    case 'patterns':
      return genPatterns(tier);
    default:
      return genAddSub(tier);
  }
}

// -------------------------------------------------------------
// TOPIC 1: ADDITION & SUBTRACTION
// -------------------------------------------------------------
function genAddSub(tier) {
  const isAdd = Math.random() > 0.4;
  let a, b, answer, promptText;

  if (tier === 1) {
    a = randInt(2, 9);
    b = randInt(2, 9);
  } else if (tier === 2) {
    a = randInt(10, 49);
    b = randInt(10, 49);
  } else if (tier === 3) {
    a = randInt(50, 199);
    b = randInt(20, 99);
  } else if (tier === 4) {
    a = randInt(150, 499);
    b = randInt(150, 499);
  } else {
    a = randInt(500, 999);
    b = randInt(250, 899);
  }

  if (isAdd) {
    answer = a + b;
    promptText = `What is ${a} + ${b}?`;
  } else {
    // Ensure positive subtraction
    if (a < b) [a, b] = [b, a];
    answer = a - b;
    promptText = `What is ${a} - ${b}?`;
  }

  const options = createOptions(answer, (ans, idx) => {
    const delta = idx === 1 ? 10 : idx === 2 ? -10 : (Math.random() < 0.5 ? 1 : -1);
    return ans + delta;
  });

  return {
    topic: 'add_sub',
    prompt: promptText,
    correctAnswer: answer.toString(),
    options: options.map(o => o.toString()),
    explanation: TOPIC_EXPLANATIONS.add_sub,
    visualType: 'number_card',
    visualData: { a, b, op: isAdd ? '+' : '-' }
  };
}

// -------------------------------------------------------------
// TOPIC 2: MULTIPLICATION
// -------------------------------------------------------------
function genMultiplication(tier) {
  let a, b, answer, promptText;

  if (tier === 1) {
    a = randInt(2, 5);
    b = randInt(2, 5);
  } else if (tier === 2) {
    a = randInt(6, 9);
    b = randInt(3, 8);
  } else if (tier === 3) {
    a = randInt(7, 12);
    b = randInt(6, 12);
  } else if (tier === 4) {
    a = randInt(13, 25);
    b = randInt(4, 9);
  } else {
    a = randInt(20, 50);
    b = randInt(11, 19);
  }

  answer = a * b;

  // 20% word problem format
  if (Math.random() < 0.25) {
    const items = ['ninja stars', 'scrolls', 'bamboo sticks', 'gold coins', 'apples'];
    const item = items[randInt(0, items.length - 1)];
    promptText = `A ninja student collects ${a} pouches. Each pouch holds ${b} ${item}. How many ${item} in total?`;
  } else {
    promptText = `Evaluate: ${a} × ${b} = ?`;
  }

  const options = createOptions(answer, (ans, idx) => {
    if (idx === 1) return (a + 1) * b;
    if (idx === 2) return a * (b - 1);
    return ans + (Math.random() < 0.5 ? 5 : -5);
  });

  return {
    topic: 'multiplication',
    prompt: promptText,
    correctAnswer: answer.toString(),
    options: options.map(o => o.toString()),
    explanation: TOPIC_EXPLANATIONS.multiplication,
    visualType: 'grid_array',
    visualData: { rows: Math.min(a, 6), cols: Math.min(b, 8), totalA: a, totalB: b }
  };
}

// -------------------------------------------------------------
// TOPIC 3: DIVISION
// -------------------------------------------------------------
function genDivision(tier) {
  let divisor, quotient, dividend, answer, promptText;
  const isRemainder = tier >= 3 && Math.random() > 0.4;

  if (tier <= 2) {
    divisor = randInt(2, 9);
    quotient = randInt(2, 9);
    dividend = divisor * quotient;
    answer = quotient.toString();
    promptText = `Calculate: ${dividend} ÷ ${divisor} = ?`;
  } else if (!isRemainder) {
    divisor = randInt(4, 12);
    quotient = randInt(6, 15);
    dividend = divisor * quotient;
    answer = quotient.toString();
    promptText = `Solve: ${dividend} ÷ ${divisor} = ?`;
  } else {
    divisor = randInt(3, 9);
    quotient = randInt(3, 10);
    const rem = randInt(1, divisor - 1);
    dividend = divisor * quotient + rem;
    answer = `${quotient} R ${rem}`;
    promptText = `Find quotient and remainder for: ${dividend} ÷ ${divisor}`;

    const options = createOptions(answer, (ans, idx) => {
      if (idx === 1) return `${quotient + 1} R ${rem}`;
      if (idx === 2) return `${quotient} R ${Math.max(1, rem - 1)}`;
      return `${quotient - 1} R ${rem + 1}`;
    });

    return {
      topic: 'division',
      prompt: promptText,
      correctAnswer: answer,
      options,
      explanation: TOPIC_EXPLANATIONS.division,
      visualType: 'division_box',
      visualData: { dividend, divisor }
    };
  }

  const options = createOptions(parseInt(answer), (ans, idx) => {
    return ans + (idx === 1 ? 1 : idx === 2 ? -1 : (Math.random() < 0.5 ? 2 : -2));
  });

  return {
    topic: 'division',
    prompt: promptText,
    correctAnswer: answer,
    options: options.map(o => o.toString()),
    explanation: TOPIC_EXPLANATIONS.division,
    visualType: 'division_box',
    visualData: { dividend, divisor }
  };
}

// -------------------------------------------------------------
// TOPIC 4: FRACTIONS I (INTRO & LIKE DENOMINATORS)
// -------------------------------------------------------------
function genFractions1(tier) {
  let promptText, answer, num1, num2, den;

  if (tier <= 2) {
    // Identify or compare simple fractions
    den = randInt(4, 10);
    num1 = randInt(1, den - 1);
    answer = `${num1}/${den}`;
    promptText = `What fraction of the shape is shaded when ${num1} out of ${den} equal slices are filled?`;

    const options = createOptions(answer, (ans, idx) => {
      if (idx === 1) return `${Math.min(den - 1, num1 + 1)}/${den}`;
      if (idx === 2) return `${num1}/${den + 1}`;
      return `${Math.max(1, num1 - 1)}/${den}`;
    });

    return {
      topic: 'fractions_1',
      prompt: promptText,
      correctAnswer: answer,
      options,
      explanation: TOPIC_EXPLANATIONS.fractions_1,
      visualType: 'fraction_pie',
      visualData: { numerator: num1, denominator: den }
    };
  } else {
    // Like denominator addition / subtraction
    den = randInt(5, 12);
    num1 = randInt(1, den - 2);
    num2 = randInt(1, den - num1);
    const isAdd = Math.random() > 0.4;

    if (isAdd) {
      answer = `${num1 + num2}/${den}`;
      promptText = `Evaluate: ${num1}/${den} + ${num2}/${den} = ?`;
    } else {
      const topMax = Math.max(num1, num2);
      const topMin = Math.min(num1, num2);
      answer = `${topMax - topMin}/${den}`;
      promptText = `Evaluate: ${topMax}/${den} - ${topMin}/${den} = ?`;
    }

    const options = createOptions(answer, (ans, idx) => {
      const parts = ans.split('/');
      const n = parseInt(parts[0]);
      if (idx === 1) return `${n + 1}/${den}`;
      if (idx === 2) return `${n}/${den + den}`; // Common mistake: adding denominators!
      return `${Math.max(1, n - 1)}/${den}`;
    });

    return {
      topic: 'fractions_1',
      prompt: promptText,
      correctAnswer: answer,
      options,
      explanation: TOPIC_EXPLANATIONS.fractions_1,
      visualType: 'fraction_bar',
      visualData: { num1, num2, denominator: den, op: isAdd ? '+' : '-' }
    };
  }
}

// -------------------------------------------------------------
// TOPIC 5: FRACTIONS II (UNLIKE DENOMINATORS & MIXED NUMBERS)
// -------------------------------------------------------------
function genFractions2(tier) {
  // Unlike denominator addition e.g. 1/2 + 1/3 = 5/6 or 1/4 + 1/2 = 3/4
  const pairs = [
    { n1: 1, d1: 2, n2: 1, d2: 3, ans: "5/6" },
    { n1: 1, d1: 4, n2: 1, d2: 2, ans: "3/4" },
    { n1: 2, d1: 3, n2: 1, d2: 4, ans: "11/12" },
    { n1: 1, d1: 5, n2: 1, d2: 2, ans: "7/10" },
    { n1: 3, d1: 4, n2: 1, d2: 3, ans: "13/12" },
    { n1: 1, d1: 3, n2: 1, d2: 6, ans: "1/2" }
  ];

  const p = pairs[randInt(0, pairs.length - 1)];
  const promptText = `Solve unlike denominator addition: ${p.n1}/${p.d1} + ${p.n2}/${p.d2} = ?`;
  const answer = p.ans;

  const options = createOptions(answer, (ans, idx) => {
    if (idx === 1) return `${p.n1 + p.n2}/${p.d1 + p.d2}`; // Common misconception: add top & bottom!
    if (idx === 2) return `${p.n1 + p.n2}/${Math.max(p.d1, p.d2)}`;
    return `${p.n1 * 2}/${p.d1 + 1}`;
  });

  return {
    topic: 'fractions_2',
    prompt: promptText,
    correctAnswer: answer,
    options,
    explanation: TOPIC_EXPLANATIONS.fractions_2,
    visualType: 'fraction_bar',
    visualData: { n1: p.n1, d1: p.d1, n2: p.n2, d2: p.d2 }
  };
}

// -------------------------------------------------------------
// TOPIC 6: DECIMALS
// -------------------------------------------------------------
function genDecimals(tier) {
  let a, b, answer, promptText;

  if (tier <= 2) {
    a = (randInt(10, 89) / 10).toFixed(1);
    b = (randInt(10, 89) / 10).toFixed(1);
    const ansNum = (parseFloat(a) + parseFloat(b)).toFixed(1);
    answer = ansNum;
    promptText = `Calculate: ${a} + ${b} = ?`;
  } else if (tier <= 4) {
    a = (randInt(105, 995) / 100).toFixed(2);
    b = (randInt(105, 995) / 100).toFixed(2);
    const isAdd = Math.random() > 0.5;
    if (isAdd) {
      answer = (parseFloat(a) + parseFloat(b)).toFixed(2);
      promptText = `Calculate: ${a} + ${b} = ?`;
    } else {
      const maxVal = Math.max(parseFloat(a), parseFloat(b));
      const minVal = Math.min(parseFloat(a), parseFloat(b));
      answer = (maxVal - minVal).toFixed(2);
      promptText = `Calculate: ${maxVal.toFixed(2)} - ${minVal.toFixed(2)} = ?`;
    }
  } else {
    // Decimal multiplication by 10/100 or simple decimal product
    a = (randInt(12, 98) / 10).toFixed(1);
    const mult = Math.random() > 0.5 ? 10 : 100;
    answer = (parseFloat(a) * mult).toString();
    promptText = `Multiply decimal: ${a} × ${mult} = ?`;
  }

  const ansFloat = parseFloat(answer);
  const options = createOptions(answer, (ans, idx) => {
    if (idx === 1) return (ansFloat + 0.1).toFixed(ans.includes('.') ? 2 : 0);
    if (idx === 2) return (ansFloat - 0.1).toFixed(ans.includes('.') ? 2 : 0);
    return (ansFloat * 10).toString();
  });

  return {
    topic: 'decimals',
    prompt: promptText,
    correctAnswer: answer,
    options,
    explanation: TOPIC_EXPLANATIONS.decimals,
    visualType: 'decimal_grid',
    visualData: { val: answer }
  };
}

// -------------------------------------------------------------
// TOPIC 7: PERCENTAGES & RATIOS
// -------------------------------------------------------------
function genPercentages(tier) {
  let promptText, answer;

  if (tier <= 2) {
    const pList = [10, 20, 25, 50, 75];
    const pct = pList[randInt(0, pList.length - 1)];
    const base = randInt(2, 10) * 10;
    answer = ((pct / 100) * base).toString();
    promptText = `What is ${pct}% of ${base}?`;
  } else if (tier <= 4) {
    // Discount word problem
    const pct = [10, 20, 25, 50][randInt(0, 3)];
    const price = randInt(4, 20) * 10;
    const discount = (pct / 100) * price;
    const finalPrice = price - discount;
    answer = `$${finalPrice}`;
    promptText = `A ninja jacket costs $${price}. It is on sale for ${pct}% off. What is the final price?`;

    const options = createOptions(answer, (ans, idx) => {
      if (idx === 1) return `$${discount}`; // mistake: return discount amount only
      if (idx === 2) return `$${finalPrice + 5}`;
      return `$${price}`;
    });

    return {
      topic: 'percentages',
      prompt: promptText,
      correctAnswer: answer,
      options,
      explanation: TOPIC_EXPLANATIONS.percentages,
      visualType: 'tag_discount',
      visualData: { price, pct }
    };
  } else {
    // Ratio scaling
    const r1 = randInt(2, 5);
    const r2 = randInt(2, 5);
    const multiplier = randInt(2, 6);
    answer = `${r1 * multiplier}:${r2 * multiplier}`;
    promptText = `Which ratio is equivalent to ${r1}:${r2}?`;

    const options = createOptions(answer, (ans, idx) => {
      if (idx === 1) return `${r1 + multiplier}:${r2 + multiplier}`; // mistake: adding multiplier!
      if (idx === 2) return `${r1 * multiplier}:${r2 * (multiplier + 1)}`;
      return `${r1}:${r2 + 2}`;
    });

    return {
      topic: 'percentages',
      prompt: promptText,
      correctAnswer: answer,
      options,
      explanation: TOPIC_EXPLANATIONS.percentages,
      visualType: 'ratio_badge',
      visualData: { r1, r2 }
    };
  }

  const ansNum = parseInt(answer);
  const options = createOptions(ansNum, (ans, idx) => {
    return ans + (idx === 1 ? 5 : idx === 2 ? -2 : 10);
  });

  return {
    topic: 'percentages',
    prompt: promptText,
    correctAnswer: answer,
    options: options.map(o => o.toString()),
    explanation: TOPIC_EXPLANATIONS.percentages,
    visualType: 'percent_bar',
    visualData: { answer }
  };
}

// -------------------------------------------------------------
// TOPIC 8: GEOMETRY
// -------------------------------------------------------------
function genGeometry(tier) {
  let promptText, answer, shapeType;

  if (tier <= 2) {
    // Perimeter of rectangle
    const l = randInt(4, 12);
    const w = randInt(3, 9);
    answer = (2 * (l + w)).toString();
    promptText = `Find the perimeter of a rectangle with length ${l} cm and width ${w} cm.`;
    shapeType = 'rectangle';

    const options = createOptions(parseInt(answer), (ans, idx) => {
      if (idx === 1) return l * w; // common mistake: area instead of perimeter!
      if (idx === 2) return l + w; // mistake: forgot x2
      return ans + 4;
    });

    return {
      topic: 'geometry',
      prompt: promptText,
      correctAnswer: answer + " cm",
      options: options.map(o => `${o} cm`),
      explanation: TOPIC_EXPLANATIONS.geometry,
      visualType: 'geom_shape',
      visualData: { shape: 'rectangle', l, w }
    };
  } else if (tier <= 4) {
    // Area of rectangle or triangle
    const isTriangle = Math.random() > 0.5;
    if (!isTriangle) {
      const l = randInt(5, 12);
      const w = randInt(4, 10);
      answer = (l * w).toString();
      promptText = `Find the area of a rectangle measuring ${l} m by ${w} m.`;

      const options = createOptions(parseInt(answer), (ans, idx) => {
        if (idx === 1) return 2 * (l + w); // mistake: perimeter instead of area
        return ans + (idx === 2 ? 6 : -4);
      });

      return {
        topic: 'geometry',
        prompt: promptText,
        correctAnswer: answer + " sq m",
        options: options.map(o => `${o} sq m`),
        explanation: TOPIC_EXPLANATIONS.geometry,
        visualType: 'geom_shape',
        visualData: { shape: 'rectangle', l, w }
      };
    } else {
      const b = randInt(4, 12) * 2; // even base for integer area
      const h = randInt(3, 10);
      answer = (0.5 * b * h).toString();
      promptText = `Find the area of a triangle with base ${b} cm and height ${h} cm.`;

      const options = createOptions(parseInt(answer), (ans, idx) => {
        if (idx === 1) return b * h; // mistake: forgot 1/2 factor
        return ans + 3;
      });

      return {
        topic: 'geometry',
        prompt: promptText,
        correctAnswer: answer + " sq cm",
        options: options.map(o => `${o} sq cm`),
        explanation: TOPIC_EXPLANATIONS.geometry,
        visualType: 'geom_shape',
        visualData: { shape: 'triangle', b, h }
      };
    }
  } else {
    // Missing angle in triangle (sum = 180 deg)
    const angleA = randInt(40, 80);
    const angleB = randInt(30, 70);
    const missingAngle = 180 - angleA - angleB;
    answer = `${missingAngle}°`;
    promptText = `A triangle has two angles measuring ${angleA}° and ${angleB}°. Find the third angle.`;

    const options = createOptions(answer, (ans, idx) => {
      if (idx === 1) return `${angleA + angleB}°`; // mistake: sum of given angles
      if (idx === 2) return `${missingAngle + 10}°`;
      return `${90}°`;
    });

    return {
      topic: 'geometry',
      prompt: promptText,
      correctAnswer: answer,
      options,
      explanation: TOPIC_EXPLANATIONS.geometry,
      visualType: 'geom_shape',
      visualData: { shape: 'angle_triangle', angleA, angleB }
    };
  }
}

// -------------------------------------------------------------
// TOPIC 9: PATTERNS & LOGIC
// -------------------------------------------------------------
function genPatterns(tier) {
  let promptText, answer, sequence, ruleDesc;

  if (tier <= 2) {
    // Arithmetic sequence (+ step)
    const start = randInt(2, 10);
    const step = randInt(3, 8);
    sequence = [start, start + step, start + 2 * step, start + 3 * step];
    const missing = start + 4 * step;
    answer = missing.toString();
    promptText = `Find the next term in the sequence: ${sequence.join(', ')}, __?`;

    const options = createOptions(missing, (ans, idx) => {
      if (idx === 1) return ans + step;
      if (idx === 2) return ans - 1;
      return ans + 2;
    });

    return {
      topic: 'patterns',
      prompt: promptText,
      correctAnswer: answer,
      options: options.map(o => o.toString()),
      explanation: TOPIC_EXPLANATIONS.patterns,
      visualType: 'pattern_boxes',
      visualData: { seq: [...sequence, '?'] }
    };
  } else if (tier <= 4) {
    // Geometric or alternating sequence (e.g. x2)
    const start = randInt(2, 5);
    sequence = [start, start * 2, start * 4, start * 8];
    const missing = start * 16;
    answer = missing.toString();
    promptText = `Identify the missing number: ${sequence.join(', ')}, __?`;

    const options = createOptions(missing, (ans, idx) => {
      if (idx === 1) return start * 8 + 8; // mistake: addition rule instead of multiplication
      if (idx === 2) return missing + 4;
      return missing - 2;
    });

    return {
      topic: 'patterns',
      prompt: promptText,
      correctAnswer: answer,
      options: options.map(o => o.toString()),
      explanation: TOPIC_EXPLANATIONS.patterns,
      visualType: 'pattern_boxes',
      visualData: { seq: [...sequence, '?'] }
    };
  } else {
    // Symbol substitution puzzle
    const ninjaStar = randInt(3, 9);
    const sword = randInt(4, 12);
    const equation1 = `🥷 + 🥷 = ${ninjaStar * 2}`;
    const equation2 = `🥷 + ⚔️ = ${ninjaStar + sword}`;
    promptText = `If ${equation1} and ${equation2}, what is the value of ⚔️?`;
    answer = sword.toString();

    const options = createOptions(sword, (ans, idx) => {
      if (idx === 1) return ninjaStar;
      if (idx === 2) return ans + 2;
      return ans - 1;
    });

    return {
      topic: 'patterns',
      prompt: promptText,
      correctAnswer: answer,
      options: options.map(o => o.toString()),
      explanation: TOPIC_EXPLANATIONS.patterns,
      visualType: 'symbol_puzzle',
      visualData: { eq1: equation1, eq2: equation2 }
    };
  }
}
