/**
 * useRaceEngine — Simulates the horse race.
 *
 * All horses move at the same BASE_SPEED every tick.
 * Every DICE_INTERVAL_TICKS ticks, two 7-face dice are rolled;
 * the horses matching each dice value receive a BOOST_AMOUNT bonus.
 *
 * Exposed values:
 *   horsePositions  { [horseId]: number }  progress 0-100
 *   ranking         horseId[] sorted by progress, tie-broken by id ascending
 *   finished        boolean
 *   winnerHorseId   number | null
 *   diceRoll        { d1, d2 } | null   (flashes for 800 ms after each roll)
 *   countdown       string | null        ('準備' | 'GO!' | null)
 *   startRace       () => void
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  HORSES,
  TRACK_LENGTH,
  TICK_MS,
  BASE_SPEED,
  DICE_INTERVAL_TICKS,
  BOOST_AMOUNT,
  COUNTDOWN,
} from '../constants';

const HORSE_IDS = HORSES.map(h => h.id);

/** Roll one n-face die (result: 1 to n). */
const rollDie = (faces) => Math.floor(Math.random() * faces) + 1;

/** Sort horse ids by position descending; tie-break: lower id first. */
function buildRanking(positions) {
  return [...HORSE_IDS].sort((a, b) => {
    const diff = positions[b] - positions[a];
    return diff !== 0 ? diff : a - b;
  });
}

export function useRaceEngine(onRaceFinished) {
  const initPos = () => Object.fromEntries(HORSE_IDS.map(id => [id, 0]));

  const [horsePositions, setHorsePositions] = useState(initPos);
  const [ranking,        setRanking]        = useState(HORSE_IDS);
  const [finished,       setFinished]       = useState(false);
  const [winnerHorseId,  setWinnerHorseId]  = useState(null);
  const [diceRoll,       setDiceRoll]       = useState(null);
  const [countdown,      setCountdown]      = useState(null);
  const [raceStarted,    setRaceStarted]    = useState(false);

  // Mutable refs so the interval callback always reads current values
  const posRef      = useRef(initPos());
  const tickRef     = useRef(0);
  const intervalRef = useRef(null);
  const finishedRef = useRef(false);

  // ── Countdown then begin ──────────────────────────────────────────────────
  const startRace = useCallback(() => {
    // Reset to starting state
    const fresh = initPos();
    posRef.current      = { ...fresh };
    tickRef.current     = 0;
    finishedRef.current = false;
    setHorsePositions({ ...fresh });
    setRanking(HORSE_IDS);
    setFinished(false);
    setWinnerHorseId(null);
    setDiceRoll(null);
    setRaceStarted(false);

    // Show '準備' then 'GO!' before releasing the horses
    let step = 0;
    setCountdown(COUNTDOWN[0]);
    const cdTimer = setInterval(() => {
      step += 1;
      if (step < COUNTDOWN.length) {
        setCountdown(COUNTDOWN[step]);
      } else {
        clearInterval(cdTimer);
        setCountdown(null);
        setRaceStarted(true); // triggers the main race loop below
      }
    }, 1200);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Main race tick loop ───────────────────────────────────────────────────
  useEffect(() => {
    if (!raceStarted) return;

    intervalRef.current = setInterval(() => {
      if (finishedRef.current) return;

      tickRef.current += 1;
      const pos = posRef.current;

      // Advance every horse by base speed
      HORSE_IDS.forEach(id => {
        pos[id] = Math.min(pos[id] + BASE_SPEED, TRACK_LENGTH);
      });

      // Dice roll every DICE_INTERVAL_TICKS ticks
      if (tickRef.current % DICE_INTERVAL_TICKS === 0) {
        const d1 = rollDie(7);
        const d2 = rollDie(7);
        // Boost the horses whose number matches the dice
        if (HORSE_IDS.includes(d1)) pos[d1] = Math.min(pos[d1] + BOOST_AMOUNT, TRACK_LENGTH);
        if (HORSE_IDS.includes(d2)) pos[d2] = Math.min(pos[d2] + BOOST_AMOUNT, TRACK_LENGTH);
        setDiceRoll({ d1, d2 });
        setTimeout(() => setDiceRoll(null), 800);
      }

      // Compute new ranking
      const newRanking = buildRanking(pos);

      // Check if the leader has crossed the finish line
      if (pos[newRanking[0]] >= TRACK_LENGTH) {
        finishedRef.current = true;
        clearInterval(intervalRef.current);
        setFinished(true);
        setWinnerHorseId(newRanking[0]);
        setHorsePositions({ ...pos });
        setRanking(newRanking);
        onRaceFinished(newRanking);
        return;
      }

      setHorsePositions({ ...pos });
      setRanking(newRanking);
    }, TICK_MS);

    return () => clearInterval(intervalRef.current);
  }, [raceStarted, onRaceFinished]);

  return {
    horsePositions,
    ranking,
    finished,
    winnerHorseId,
    diceRoll,
    countdown,
    startRace,
  };
}
