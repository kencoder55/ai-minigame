/**
 * useGameState — Central game-state manager for Horse Racing.
 * Uses useReducer so all game data lives in one predictable place.
 *
 * State shape:
 *   phase                 : current game phase (see PHASE constants)
 *   maxTurns              : total turns chosen at start
 *   currentTurn           : 1-indexed turn counter
 *   players               : { id, name, coins, currentBets, lastEarned }[]
 *   currentBetPlayerIndex : index of the player whose bet turn it is
 *   finalRanking          : horseId[] in finish order (set after race)
 *   turnHistory           : { turn, finalRanking, playerSnapshots }[] per turn
 */

import { useReducer, useCallback } from 'react';
import {
  PHASE,
  INITIAL_COINS,
  TURN_INCOME,
  COLOR_BETS,
  HORSE_BET_TYPES,
} from '../constants';

// ─── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Compute the total payout for a single bet cell.
 * Returns coins won (0 = lost). The original stake is NOT included —
 * it was already deducted when the player placed the bet.
 */
function computePayout(betKey, amount, finalRanking) {
  if (!amount || amount <= 0) return 0;

  // ── Colour bets ──
  const colorBet = COLOR_BETS.find(b => b.key === betKey);
  if (colorBet) {
    return colorBet.condition(finalRanking[0], finalRanking)
      ? amount * colorBet.multiplier
      : 0;
  }

  // ── Per-horse bets ──
  for (const betType of HORSE_BET_TYPES) {
    const prefix = `${betType.key}_`;
    if (betKey.startsWith(prefix)) {
      const horseId  = parseInt(betKey.replace(prefix, ''), 10);
      const position = finalRanking.indexOf(horseId); // 0-indexed
      let won = false;
      if (betType.key === 'show')  won = position >= 0 && position <= 2;
      if (betType.key === 'place') won = position >= 0 && position <= 1;
      if (betType.key === 'win')   won = position === 0;
      return won ? amount * betType.multiplier : 0;
    }
  }

  return 0;
}

/** Settle winnings for all players after a race and reset their bet slate. */
function settleRound(players, finalRanking) {
  return players.map(player => {
    let totalPayout = 0;
    for (const [betKey, amount] of Object.entries(player.currentBets || {})) {
      totalPayout += computePayout(betKey, amount, finalRanking);
    }
    return {
      ...player,
      lastEarned: totalPayout,
      coins:      player.coins + totalPayout, // stake was already deducted at bet time
      currentBets: {},
    };
  });
}

// ─── Initial State ─────────────────────────────────────────────────────────────

const buildInitialState = () => ({
  phase: PHASE.START,
  maxTurns: 3,
  currentTurn: 1,
  players: [],
  currentBetPlayerIndex: 0,
  finalRanking: [],
  turnHistory: [],
});

// ─── Reducer ───────────────────────────────────────────────────────────────────

function reducer(state, action) {
  switch (action.type) {

    // ── START ────────────────────────────────────────────────────────────────
    case 'CONFIGURE_GAME': {
      const players = action.payload.players.map((p, i) => ({
        id: i,
        name: p.name,
        coins: INITIAL_COINS,
        currentBets: {},
        lastEarned: 0,
      }));
      return { ...state, maxTurns: action.payload.maxTurns, players };
    }

    // ── BET ──────────────────────────────────────────────────────────────────
    case 'GO_TO_BET': {
      // Grant turn income, wipe previous bets, go to Bet phase
      const earnedPlayers = state.players.map(p => ({
        ...p,
        coins: p.coins + TURN_INCOME,
        currentBets: {},
        lastEarned: 0,
      }));
      return {
        ...state,
        phase: PHASE.BET,
        players: earnedPlayers,
        currentBetPlayerIndex: 0,
      };
    }

    case 'PLACE_BET': {
      // payload: { playerId, betKey, amount }
      const { playerId, betKey, amount } = action.payload;
      const updatedPlayers = state.players.map(p => {
        if (p.id !== playerId) return p;
        const prevAmount = p.currentBets[betKey] || 0;
        const diff = amount - prevAmount; // positive = paying more, negative = refund
        return {
          ...p,
          coins: p.coins - diff,
          currentBets: { ...p.currentBets, [betKey]: amount },
        };
      });
      return { ...state, players: updatedPlayers };
    }

    case 'REMOVE_BET': {
      // payload: { playerId, betKey }
      const { playerId, betKey } = action.payload;
      const updatedPlayers = state.players.map(p => {
        if (p.id !== playerId) return p;
        const refund = p.currentBets[betKey] || 0;
        const { [betKey]: _removed, ...rest } = p.currentBets;
        return { ...p, coins: p.coins + refund, currentBets: rest };
      });
      return { ...state, players: updatedPlayers };
    }

    case 'NEXT_BET_PLAYER': {
      const nextIndex = state.currentBetPlayerIndex + 1;
      if (nextIndex >= state.players.length) {
        return { ...state, phase: PHASE.RACING };
      }
      return { ...state, currentBetPlayerIndex: nextIndex };
    }

    // ── RACING ───────────────────────────────────────────────────────────────
    case 'RACE_FINISHED': {
      const { finalRanking } = action.payload;
      const settledPlayers = settleRound(state.players, finalRanking);
      const snapshot = {
        turn: state.currentTurn,
        finalRanking,
        playerSnapshots: settledPlayers.map(p => ({
          id: p.id, name: p.name, coins: p.coins, lastEarned: p.lastEarned,
        })),
      };
      return {
        ...state,
        phase: PHASE.COLLECT,
        finalRanking,
        players: settledPlayers,
        turnHistory: [...state.turnHistory, snapshot],
      };
    }

    // ── COLLECT ──────────────────────────────────────────────────────────────
    case 'NEXT_TURN': {
      return { ...state, currentTurn: state.currentTurn + 1, finalRanking: [] };
    }

    case 'GO_TO_RESULT': {
      return { ...state, phase: PHASE.RESULT };
    }

    // ── RESULT ───────────────────────────────────────────────────────────────
    case 'RESTART': {
      return buildInitialState();
    }

    default:
      return state;
  }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useGameState() {
  const [state, dispatch] = useReducer(reducer, buildInitialState());

  const configureGame  = useCallback((maxTurns, players) =>
    dispatch({ type: 'CONFIGURE_GAME', payload: { maxTurns, players } }), []);

  const goToBet        = useCallback(() =>
    dispatch({ type: 'GO_TO_BET' }), []);

  const placeBet       = useCallback((playerId, betKey, amount) =>
    dispatch({ type: 'PLACE_BET', payload: { playerId, betKey, amount } }), []);

  const removeBet      = useCallback((playerId, betKey) =>
    dispatch({ type: 'REMOVE_BET', payload: { playerId, betKey } }), []);

  const nextBetPlayer  = useCallback(() =>
    dispatch({ type: 'NEXT_BET_PLAYER' }), []);

  const raceFinished   = useCallback((finalRanking) =>
    dispatch({ type: 'RACE_FINISHED', payload: { finalRanking } }), []);

  const nextTurn       = useCallback(() =>
    dispatch({ type: 'NEXT_TURN' }), []);

  const goToResult     = useCallback(() =>
    dispatch({ type: 'GO_TO_RESULT' }), []);

  const restart        = useCallback(() =>
    dispatch({ type: 'RESTART' }), []);

  return {
    state,
    configureGame, goToBet,
    placeBet, removeBet, nextBetPlayer,
    raceFinished,
    nextTurn, goToResult,
    restart,
  };
}
