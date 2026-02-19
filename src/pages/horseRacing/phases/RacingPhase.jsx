/**
 * RacingPhase — Race viewer.
 *   Top    : animated horse track (RacingCourt)
 *   Middle : live horse rankings (HorseRankings)
 *   Bottom : player bet summary (PlayerBetsInfo)
 *
 * Props:
 *   state        : game state
 *   raceFinished : (finalRanking: number[]) => void
 */

import React, { useCallback, useEffect } from 'react';
import { Box, Typography, Paper, Chip } from '@mui/material';
import { useRaceEngine } from '../hooks/useRaceEngine';
import RacingCourt from '../components/RacingCourt';
import HorseRankings from '../components/HorseRankings';
import PlayerBetsInfo from '../components/PlayerBetsInfo';

export default function RacingPhase({ state, raceFinished }) {
  const { players, currentTurn, maxTurns } = state;

  // Brief delay after winner so user can see the result before transitioning
  const handleRaceFinished = useCallback((finalRanking) => {
    setTimeout(() => raceFinished(finalRanking), 1800);
  }, [raceFinished]);

  const { horsePositions, ranking, finished, winnerHorseId, diceRoll, countdown, startRace } =
    useRaceEngine(handleRaceFinished);

  // Auto-start after a short mount delay
  useEffect(() => {
    const t = setTimeout(startRace, 600);
    return () => clearTimeout(t);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box minHeight="100vh" sx={{ background: '#1a1a2e', pb: 4 }}>
      {/* Header */}
      <Box sx={{
        background: 'linear-gradient(135deg,#1b5e20,#388e3c)',
        px: 3, py: 1.5,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <Typography variant="h6" fontWeight={800} color="white">🏇 賽馬進行中</Typography>
        <Chip
          label={`第 ${currentTurn} / ${maxTurns} 回合`}
          sx={{ background: 'rgba(255,255,255,0.15)', color: 'white', fontWeight: 700 }}
        />
      </Box>

      <Box maxWidth={780} mx="auto" px={2} mt={2}>
        {/* 1. Track */}
        <RacingCourt
          horsePositions={horsePositions}
          countdown={countdown}
          diceRoll={diceRoll}
          finished={finished}
          winnerHorseId={winnerHorseId}
        />

        {/* 2. Live rankings */}
        <Box mt={2}>
          <HorseRankings ranking={ranking} title="目前名次" />
        </Box>

        {/* 3. Player bets */}
        <Box mt={2}>
          <PlayerBetsInfo players={players} />
        </Box>

        {/* Winner banner */}
        {finished && (
          <Paper elevation={4} sx={{
            mt: 3, p: 2, textAlign: 'center',
            background: 'linear-gradient(135deg,#F9A825,#FF6F00)',
            borderRadius: 3,
          }}>
            <Typography variant="h5" fontWeight={900} color="white">
              🏆 {winnerHorseId}號 率先衝線！
            </Typography>
            <Typography variant="body2" color="rgba(255,255,255,0.85)" mt={0.5}>
              正在計算結果…
            </Typography>
          </Paper>
        )}
      </Box>
    </Box>
  );
}
