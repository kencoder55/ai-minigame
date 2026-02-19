/**
 * BetPhase — Betting phase.
 * Players take turns placing bets on the BetBoard.
 * "結束投注" advances to the next player; after all players go, racing begins.
 *
 * Props:
 *   state         : game state
 *   placeBet      : (betKey, amount) => void
 *   removeBet     : (betKey) => void
 *   nextBetPlayer : () => void
 */

import React from 'react';
import {
  Box, Button, Typography, Paper, Chip, Divider, LinearProgress,
} from '@mui/material';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import BetBoard from '../components/BetBoard';

export default function BetPhase({ state, placeBet, removeBet, nextBetPlayer }) {
  const { players, currentBetPlayerIndex, currentTurn, maxTurns } = state;
  const currentPlayer = players[currentBetPlayerIndex];

  if (!currentPlayer) return null;

  const totalBet = Object.values(currentPlayer.currentBets || {}).reduce((s, a) => s + a, 0);
  const isLastPlayer = currentBetPlayerIndex === players.length - 1;

  return (
    <Box minHeight="100vh" sx={{ background: '#f5f5f5', pb: 4 }}>
      {/* Header */}
      <Box sx={{ background: 'linear-gradient(135deg,#1565C0,#1976D2)', px: 3, py: 2 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1}>
            <HowToVoteIcon sx={{ color: 'white' }} />
            <Typography variant="h6" fontWeight={800} color="white">投注階段</Typography>
          </Box>
          <Chip
            label={`第 ${currentTurn} / ${maxTurns} 回合`}
            sx={{ background: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 700 }}
          />
        </Box>

        {/* Progress bar — how many players have bet */}
        <Box mt={1.5}>
          <Box display="flex" justifyContent="space-between" mb={0.5}>
            <Typography variant="body2" color="rgba(255,255,255,0.8)">
              玩家 {currentBetPlayerIndex + 1} / {players.length}
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={(currentBetPlayerIndex / players.length) * 100}
            sx={{
              borderRadius: 4,
              bgcolor: 'rgba(255,255,255,0.3)',
              '& .MuiLinearProgress-bar': { bgcolor: '#FDD835' },
            }}
          />
        </Box>
      </Box>

      <Box maxWidth={700} mx="auto" px={2} mt={2}>
        {/* Current player info */}
        <Paper elevation={2} sx={{ p: 2, mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">目前投注玩家</Typography>
            <Typography variant="h5" fontWeight={800}>{currentPlayer.name}</Typography>
          </Box>
          <Box textAlign="right">
            <Typography variant="caption" color="text.secondary">可用金幣</Typography>
            <Typography variant="h6" fontWeight={700} color="primary">💰 {currentPlayer.coins}</Typography>
            {totalBet > 0 && (
              <Typography variant="caption" color="text.secondary" display="block">已投 {totalBet} 幣</Typography>
            )}
          </Box>
        </Paper>

        {/* Bet board */}
        <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
          <BetBoard
            player={currentPlayer}
            onPlaceBet={(betKey, amount) => placeBet(currentPlayer.id, betKey, amount)}
            onRemoveBet={(betKey) => removeBet(currentPlayer.id, betKey)}
          />
        </Paper>

        {/* Confirm / next player button */}
        <Button
          variant="contained" size="large" fullWidth
          onClick={nextBetPlayer}
          sx={{
            py: 1.5, fontWeight: 800, fontSize: '1.05rem',
            background: 'linear-gradient(90deg,#2e7d32,#43a047)',
            '&:hover': { background: 'linear-gradient(90deg,#1b5e20,#2e7d32)' },
          }}
        >
          {isLastPlayer
            ? '結束投注 → 開始賽馬！🏇'
            : `結束投注 → 下一位: ${players[currentBetPlayerIndex + 1].name}`}
        </Button>

        {/* Summary of players who already bet */}
        {currentBetPlayerIndex > 0 && (
          <Box mt={3}>
            <Divider sx={{ mb: 2 }}>
              <Typography variant="caption" color="text.secondary">已完成投注的玩家</Typography>
            </Divider>
            {players.slice(0, currentBetPlayerIndex).map(p => {
              const pBet = Object.values(p.currentBets || {}).reduce((s, a) => s + a, 0);
              return (
                <Box key={p.id} display="flex" justifyContent="space-between" px={1} py={0.5}>
                  <Typography variant="body2">{p.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    已投 {pBet} 幣 ｜ 剩餘 {p.coins} 幣
                  </Typography>
                </Box>
              );
            })}
          </Box>
        )}
      </Box>
    </Box>
  );
}
