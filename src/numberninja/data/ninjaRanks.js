export const NINJA_RANKS = [
  {
    id: 1,
    title: "White Belt Ninja",
    color: "from-slate-100 to-slate-300 text-slate-900",
    border: "border-slate-300",
    minWorld: 1,
    minXp: 0,
    icon: "⚪",
    description: "Beginning student of the mathematical arts. Focus on calculation fluency."
  },
  {
    id: 2,
    title: "Yellow Belt Ninja",
    color: "from-amber-300 to-yellow-500 text-amber-950",
    border: "border-amber-400",
    minWorld: 2,
    minXp: 800,
    icon: "🟡",
    description: "Mastered multiplication tables! Speed and pattern recognition awakening."
  },
  {
    id: 3,
    title: "Orange Belt Ninja",
    color: "from-orange-400 to-amber-600 text-orange-950",
    border: "border-orange-500",
    minWorld: 3,
    minXp: 1800,
    icon: "🟠",
    description: "Division scholar. Splits complex challenges with surgical precision."
  },
  {
    id: 4,
    title: "Green Belt Ninja",
    color: "from-emerald-400 to-green-600 text-emerald-950",
    border: "border-emerald-500",
    minWorld: 4,
    minXp: 3000,
    icon: "🟢",
    description: "Fraction initiate. Sees parts of a whole with absolute clarity."
  },
  {
    id: 5,
    title: "Blue Belt Ninja",
    color: "from-cyan-400 to-blue-600 text-blue-950",
    border: "border-cyan-400",
    minWorld: 5,
    minXp: 4500,
    icon: "🔵",
    description: "Advanced Fraction Sensei. Harmonizes unlike denominators effortless."
  },
  {
    id: 6,
    title: "Purple Belt Ninja",
    color: "from-purple-400 to-indigo-600 text-purple-950",
    border: "border-purple-500",
    minWorld: 6,
    minXp: 6200,
    icon: "🟣",
    description: "Decimal Virtuoso. Commands place values to thousandths and beyond."
  },
  {
    id: 7,
    title: "Red Belt Ninja",
    color: "from-rose-500 to-red-700 text-rose-950",
    border: "border-rose-500",
    minWorld: 7,
    minXp: 8000,
    icon: "🔴",
    description: "Percent & Ratio Master. Scales values and discounts in a heartbeat."
  },
  {
    id: 8,
    title: "Brown Belt Ninja",
    color: "from-amber-700 to-stone-800 text-amber-100",
    border: "border-amber-700",
    minWorld: 8,
    minXp: 10000,
    icon: "🟤",
    description: "Geometric Architect. Measures space, perimeter, angles, and 3D shapes."
  },
  {
    id: 9,
    title: "Black Belt Ninja",
    color: "from-slate-800 to-slate-950 text-emerald-400",
    border: "border-slate-700",
    minWorld: 9,
    minXp: 12500,
    icon: "⬛",
    description: "Logic Strategist. Decodes unseen sequence patterns and algebraic riddles."
  },
  {
    id: 10,
    title: "Grandmaster Ninja 🥷",
    color: "from-amber-400 via-rose-500 to-purple-600 text-slate-950",
    border: "border-amber-300",
    minWorld: 10,
    minXp: 15000,
    icon: "👑",
    description: "Supreme Number Master! Has conquered all 100 levels of mathematical excellence."
  }
];

export function getRankForXpAndWorld(xp, maxWorldCompleted) {
  let highest = NINJA_RANKS[0];
  for (const rank of NINJA_RANKS) {
    if (xp >= rank.minXp || maxWorldCompleted >= rank.minWorld) {
      highest = rank;
    }
  }
  return highest;
}
