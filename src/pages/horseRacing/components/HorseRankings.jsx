/**
 * HorseRankings — Shows current or final horse standings.
 * Layout: rank-number header row + horse-icon row with number badge.
 *
 * Props:
 *   ranking : horseId[]  leader first
 *   title   : string
 */

import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { HORSE_MAP } from '../constants';

export default function HorseRankings({ ranking, title = '名次' }) {
  return (
    <Paper variant="outlined" sx={{ p: 1.5, overflow: 'hidden' }}>
      <Typography variant="subtitle2" fontWeight={700} mb={1}>{title}</Typography>

      {/* Grid: 7 equal columns */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', border: '1px solid #ccc', borderRadius: 1, overflow: 'hidden' }}>

        {/* Row 1 — rank numbers */}
        {ranking.map((_, index) => (
          <Box
            key={`rank-${index}`}
            sx={{
              background: '#f5f5f5',
              borderRight: index < 6 ? '1px solid #ccc' : 'none',
              borderBottom: '1px solid #ccc',
              textAlign: 'center',
              py: 0.5,
            }}
          >
            <Typography variant="body2" fontWeight={900} sx={{ fontSize: '0.95rem', color: '#111' }}>
              {index + 1}
            </Typography>
          </Box>
        ))}

        {/* Row 2 — horse icons with number badge */}
        {ranking.map((horseId, index) => {
          const horse = HORSE_MAP[horseId];
          return (
            <Box
              key={horseId}
              sx={{
                position: 'relative',
                background: horse.bg,
                borderRight: index < 6 ? '1px solid #ccc' : 'none',
                aspectRatio: '1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
              }}
            >
              {/* Horse icon */}
              <Box
                component="img"
                src={horse.icon}
                alt={horse.label}
                sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />

              {/* Number badge */}
              <Box sx={{
                position: 'absolute',
                top: '6%',
                right: '6%',
                width: '36%',
                height: '36%',
                borderRadius: '50%',
                background: horse.text === '#fff' ? 'rgba(0,0,0,0.75)' : 'rgba(255,255,255,0.85)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Typography
                  sx={{
                    color: horse.text === '#fff' ? '#fff' : '#111',
                    fontWeight: 900,
                    fontSize: 'clamp(0.55rem, 2vw, 1rem)',
                    lineHeight: 1,
                  }}
                >
                  {horseId}
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Paper>
  );
}
