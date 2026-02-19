/**
 * PlayerBetsInfo — Summary table of every player's current bets.
 * Displayed at the bottom of the Racing phase.
 *
 * Props:
 *   players : player[]  each with { id, name, coins, currentBets }
 */

import React from 'react';
import {
  Box, Paper, Typography, Table, TableBody, TableCell,
  TableHead, TableRow, Chip,
} from '@mui/material';
import { COLOR_BETS, HORSE_BET_TYPES } from '../constants';

/** Return a human-readable label for any bet key */
function betLabel(betKey) {
  const cb = COLOR_BETS.find(b => b.key === betKey);
  if (cb) return cb.label;
  for (const bt of HORSE_BET_TYPES) {
    const prefix = `${bt.key}_`;
    if (betKey.startsWith(prefix)) {
      return `#${betKey.replace(prefix, '')} ${bt.label}`;
    }
  }
  return betKey;
}

export default function PlayerBetsInfo({ players }) {
  return (
    <Paper variant="outlined" sx={{ p: 1.5 }}>
      <Typography variant="subtitle2" fontWeight={700} mb={1}>玩家投注概覽</Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 700 }}>玩家</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>投注內容</TableCell>
            <TableCell align="right" sx={{ fontWeight: 700 }}>剩餘金幣</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {players.map(player => {
            const betEntries = Object.entries(player.currentBets || {}).filter(([, amt]) => amt > 0);
            return (
              <TableRow key={player.id}>
                <TableCell sx={{ fontWeight: 600 }}>{player.name}</TableCell>
                <TableCell>
                  {betEntries.length === 0
                    ? <Typography variant="caption" color="text.disabled">無投注</Typography>
                    : (
                      <Box display="flex" gap={0.5} flexWrap="wrap">
                        {betEntries.map(([key, amt]) => (
                          <Chip key={key} label={`${betLabel(key)} x${amt}`}
                            size="small" variant="outlined" sx={{ fontSize: '0.65rem' }} />
                        ))}
                      </Box>
                    )}
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2" fontWeight={700}>💰 {player.coins}</Typography>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Paper>
  );
}
