/**
 * CollectPhase — Post-race settlement screen.
 *   Top    : final horse rankings
 *   Middle : earnings per player
 *   Bottom : "繼續" (next turn) | "結束賽事" (go to result)
 *
 * Props:
 *   state      : game state
 *   nextTurn   : () => void
 *   goToBet    : () => void
 *   goToResult : () => void
 */

import React from 'react';
import {
  Box, Button, Typography, Paper, Chip,
  Table, TableBody, TableCell, TableHead, TableRow, Divider,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import HorseRankings from '../components/HorseRankings';

export default function CollectPhase({ state, nextTurn, goToBet, goToResult }) {
  const { players, finalRanking, currentTurn, maxTurns } = state;
  const isLastTurn = currentTurn >= maxTurns;

  const handleContinue = () => {
    nextTurn(); // increment turn counter
    goToBet();  // grant income + move to Bet phase
  };

  return (
    <Box minHeight="100vh" sx={{ background: '#f5f5f5', pb: 6 }}>
      {/* Header */}
      <Box sx={{
        background: 'linear-gradient(135deg,#4a148c,#7b1fa2)',
        px: 3, py: 2,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <Box display="flex" alignItems="center" gap={1}>
          <TrendingUpIcon sx={{ color: 'white' }} />
          <Typography variant="h6" fontWeight={800} color="white">結算</Typography>
        </Box>
        <Chip
          label={`第 ${currentTurn} / ${maxTurns} 回合`}
          sx={{ background: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 700 }}
        />
      </Box>

      <Box maxWidth={700} mx="auto" px={2} mt={2}>
        {/* 1. Final rankings */}
        <HorseRankings ranking={finalRanking} title={`第 ${currentTurn} 回合 — 最終名次`} />

        {/* 2. Earnings table */}
        <Paper elevation={2} sx={{ mt: 2, p: 2 }}>
          <Typography variant="subtitle1" fontWeight={700} mb={1.5}>💰 玩家收益</Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>玩家</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>本回合收益</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>目前金幣</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {players.map(player => (
                <TableRow key={player.id}>
                  <TableCell sx={{ fontWeight: 600 }}>{player.name}</TableCell>
                  <TableCell>
                    {player.lastEarned > 0
                      ? <Chip label={`+${player.lastEarned} 💰`} color="success" size="small" sx={{ fontWeight: 700 }} />
                      : <Chip label="無贏彩" size="small" variant="outlined" />}
                  </TableCell>
                  <TableCell align="right">
                    <Typography fontWeight={700} color={player.lastEarned > 0 ? 'success.main' : 'text.primary'}>
                      💰 {player.coins}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>

        <Divider sx={{ my: 3 }} />

        {/* 3. Action buttons */}
        <Box display="flex" gap={2} justifyContent="center">
          {!isLastTurn && (
            <Button
              variant="contained" size="large"
              onClick={handleContinue}
              sx={{
                flex: 1, py: 1.5, fontWeight: 800,
                background: 'linear-gradient(90deg,#1565C0,#1976D2)',
              }}
            >
              繼續下一回合 →
            </Button>
          )}
          <Button
            variant={isLastTurn ? 'contained' : 'outlined'}
            color={isLastTurn ? 'secondary' : 'inherit'}
            size="large"
            onClick={goToResult}
            sx={{
              flex: isLastTurn ? 1 : undefined,
              py: 1.5, fontWeight: 800,
              ...(isLastTurn ? { background: 'linear-gradient(90deg,#4a148c,#7b1fa2)', color: 'white' } : {}),
            }}
          >
            結束賽事
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
