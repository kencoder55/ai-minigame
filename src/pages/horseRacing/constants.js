/**
 * Horse Racing Game — Core Constants
 * Defines all horses, bet types, payout rates, and race parameters.
 */

// ─── Horse Definitions ────────────────────────────────────────────────────────

export const HORSE_COLORS = {
  blue:   'blue',
  yellow: 'yellow',
  red:    'red',
  black:  'black',
};

/** All 7 horses with their colour group, display colour, and image asset path. */
export const HORSES = [
  { id: 1, color: HORSE_COLORS.blue,   label: '1號', bg: '#1565C0', text: '#fff', image: '/horseRacing/assets/blue-1.png'   },
  { id: 2, color: HORSE_COLORS.blue,   label: '2號', bg: '#1976D2', text: '#fff', image: '/horseRacing/assets/blue-2.png'   },
  { id: 3, color: HORSE_COLORS.blue,   label: '3號', bg: '#42A5F5', text: '#fff', image: '/horseRacing/assets/blue-3.png'   },
  { id: 4, color: HORSE_COLORS.yellow, label: '4號', bg: '#F9A825', text: '#333', image: '/horseRacing/assets/yellow-4.png' },
  { id: 5, color: HORSE_COLORS.yellow, label: '5號', bg: '#FDD835', text: '#333', image: '/horseRacing/assets/yellow-5.png' },
  { id: 6, color: HORSE_COLORS.red,    label: '6號', bg: '#C62828', text: '#fff', image: '/horseRacing/assets/red-6.png'    },
  { id: 7, color: HORSE_COLORS.black,  label: '7號', bg: '#212121', text: '#fff', image: '/horseRacing/assets/black-7.png'  },
];

/** Quick lookup by horse id */
export const HORSE_MAP = Object.fromEntries(HORSES.map(h => [h.id, h]));

// ─── Colour-Group Bet Definitions ─────────────────────────────────────────────

/**
 * Top-row colour bets on the bet board.
 *   colorBlue   → winning horse is #1, #2, or #3         x2
 *   colorYellow → winning horse is #4 or #5              x3
 *   colorRed    → winning horse is #6                    x4
 *   colorBlack  → horse #7 finishes 5th or worse         x5
 */
export const COLOR_BETS = [
  {
    key: 'colorBlue',
    label: '藍馬 Win',
    sublabel: 'x 2',
    multiplier: 2,
    color: '#1565C0',
    textColor: '#fff',
    condition: (_rank1st, finalRanking) => [1, 2, 3].includes(finalRanking[0]),
  },
  {
    key: 'colorYellow',
    label: '黃馬 Win',
    sublabel: 'x 3',
    multiplier: 3,
    color: '#F9A825',
    textColor: '#333',
    condition: (_rank1st, finalRanking) => [4, 5].includes(finalRanking[0]),
  },
  {
    key: 'colorRed',
    label: '紅馬 Win',
    sublabel: 'x 4',
    multiplier: 4,
    color: '#C62828',
    textColor: '#fff',
    condition: (_rank1st, finalRanking) => finalRanking[0] === 6,
  },
  {
    key: 'colorBlack',
    label: '黑馬 5名或以下',
    sublabel: 'x 5',
    multiplier: 5,
    color: '#212121',
    textColor: '#fff',
    // Horse 7 finishes 5th or worse (0-indexed position ≥ 4)
    condition: (_rank1st, finalRanking) => finalRanking.indexOf(7) >= 4,
  },
];

// ─── Per-Horse Bet Types ───────────────────────────────────────────────────────

/**
 * Individual horse bet columns — each cell is (bet type, horse id).
 *   show  → horse finishes top-3   rate x2
 *   place → horse finishes top-2   rate x3
 *   win   → horse finishes 1st     rate x5
 */
export const HORSE_BET_TYPES = [
  { key: 'show',  label: '名次 Show',  sublabel: '1~3名', multiplier: 2 },
  { key: 'place', label: '位置 Place', sublabel: '1~2名', multiplier: 3 },
  { key: 'win',   label: '獨贏 Win',   sublabel: '1名',   multiplier: 5 },
];

/** Build a unique bet-board cell key */
export const makeBetKey = (type, horseId) =>
  horseId != null ? `${type}_${horseId}` : type;

// ─── Game Parameters ──────────────────────────────────────────────────────────

export const INITIAL_COINS = 5;   // coins every player starts with
export const TURN_INCOME   = 5;   // coins added at the start of each Bet phase

export const MIN_PLAYERS = 1;
export const MAX_PLAYERS = 5;
export const MIN_TURNS   = 1;
export const MAX_TURNS   = 3;

// ─── Race Engine Parameters ───────────────────────────────────────────────────

export const TRACK_LENGTH          = 100;   // abstract units (0 → 100)
export const TICK_MS               = 100;   // simulation tick in ms
export const BASE_SPEED            = 0.38;  // progress units per tick (same for all)
export const DICE_INTERVAL_S       = 2;     // seconds between dice rolls
export const DICE_INTERVAL_TICKS   = DICE_INTERVAL_S * (1000 / TICK_MS); // 20 ticks
export const BOOST_AMOUNT          = 4;     // progress units added on dice boost

// Countdown labels shown before the race starts
export const COUNTDOWN = ['準備', 'GO!'];

// ─── Game Phases ──────────────────────────────────────────────────────────────

export const PHASE = {
  START:   'start',
  BET:     'bet',
  RACING:  'racing',
  COLLECT: 'collect',
  RESULT:  'result',
};
