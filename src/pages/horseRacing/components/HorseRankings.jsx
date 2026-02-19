/**
 * HorseRankings — Shows current or final horse standings in a compact row.
 *
 * Props:
 *   ranking : horseId[]  leader first
 *   title   : string
 */

import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { HORSE_MAP } from '../constants';
import HorseAvatar from './HorseAvatar';

const MEDALS = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣', '6️⃣', '7️⃣'];

export default function HorseRankings({ ranking, title = '名次' }) {
  return (
    <Paper variant="outlined" sx={{ p: 1.5 }}>
      <Typography variant="subtitle2" fontWeight={700} mb={1}>{title}</Typography>
      <Box display="flex" gap={1} flexWrap="wrap">
        {ranking.map((horseId, index) => {
          const horse = HORSE_MAP[horseId];
          return (
            <Box
              key={horseId}
              display="flex" alignItems="center" gap={0.5}
              sx={{ background: horse.bg, borderRadius: 1, px: 1, py: 0.5, minWidth: 58 }}
            >
              <Typography variant="caption" sx={{ fontSize: '1rem' }}>
                {MEDALS[index] ?? `${index + 1}`}
              </Typography>
              <HorseAvatar horseId={horseId} size={22} />
              <Typography variant="caption" fontWeight={700} color={horse.text}>
                #{horseId}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Paper>
  );
}
