/**
 * HorseRacing — Root component.
 * Reads the current phase from useGameState and renders the matching screen.
 */

import React from 'react';
import { PHASE } from './constants';
import { useGameState } from './hooks/useGameState';
import StartPhase   from './phases/StartPhase';
import BetPhase     from './phases/BetPhase';
import RacingPhase  from './phases/RacingPhase';
import CollectPhase from './phases/CollectPhase';
import ResultPhase  from './phases/ResultPhase';

export default function HorseRacing() {
  const {
    state,
    configureGame, goToBet,
    placeBet, removeBet, nextBetPlayer,
    raceFinished,
    nextTurn, goToResult,
    restart,
  } = useGameState();

  const { phase } = state;

  if (phase === PHASE.START)   return <StartPhase   configureGame={configureGame} goToBet={goToBet} />;
  if (phase === PHASE.BET)     return <BetPhase     state={state} placeBet={placeBet} removeBet={removeBet} nextBetPlayer={nextBetPlayer} />;
  if (phase === PHASE.RACING)  return <RacingPhase  state={state} raceFinished={raceFinished} />;
  if (phase === PHASE.COLLECT) return <CollectPhase state={state} nextTurn={nextTurn} goToBet={goToBet} goToResult={goToResult} />;
  if (phase === PHASE.RESULT)  return <ResultPhase  state={state} restart={restart} />;

  return null;
}
