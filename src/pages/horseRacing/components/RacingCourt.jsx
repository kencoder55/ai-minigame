/**
 * RacingCourt — Animated 7-lane horse track.
 *
 * Props:
 *   horsePositions : { [horseId]: number }  progress 0-100
 *   countdown      : string | null
 *   diceRoll       : { d1, d2 } | null
 *   finished       : boolean
 *   winnerHorseId  : number | null
 */

import React from 'react';
import { Box, Typography, Paper, Chip } from '@mui/material';
import { HORSES, TRACK_LENGTH } from '../constants';
import HorseAvatar from './HorseAvatar';

// ─── Single lane ──────────────────────────────────────────────────────────────

function HorseLane({ horse, progress }) {
  // Convert 0-100 progress to a CSS left% (horse spans ~40px, track has ~40px right padding)
  const pct = Math.min((progress / TRACK_LENGTH) * 88, 88); // 88% keeps horse inside box

  return (
    <Box
      sx={{
        position: 'relative',
        height: 44,
        display: 'flex', alignItems: 'center',
        background: horse.id % 2 === 0 ? '#f0f4e8' : '#e8f0e8',
        borderBottom: '1px solid #ddd',
        overflow: 'hidden',
      }}
    >
      {/* Track ground line */}
      <Box sx={{
        position: 'absolute', left: 30, right: 44,
        height: 2, background: '#ccc', top: '50%', transform: 'translateY(-50%)',
      }} />

      {/* Finish line (striped red) */}
      <Box sx={{
        position: 'absolute', right: 40, top: 0, bottom: 0, width: 3,
        backgroundImage: 'repeating-linear-gradient(to bottom,#c62828,#c62828 4px,transparent 4px,transparent 8px)',
      }} />

      {/* Horse sprite — positioned by progress */}
      <Box sx={{
        position: 'absolute',
        left: `${pct}%`,
        transition: `left ${0.1}s linear`,
        display: 'flex', alignItems: 'center', zIndex: 2,
      }}>
        <HorseAvatar horseId={horse.id} size={30} />
      </Box>

      {/* Lane number (right edge) */}
      <Typography variant="caption" fontWeight={800} sx={{
        position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)',
        color: horse.bg, minWidth: 28, textAlign: 'right',
      }}>
        #{horse.id}
      </Typography>
    </Box>
  );
}

// ─── Dice display (fades in/out) ──────────────────────────────────────────────

function DiceDisplay({ roll }) {
  if (!roll) return null;
  return (
    <Box sx={{
      position: 'absolute', top: 8, right: 8, zIndex: 10,
      display: 'flex', gap: 1, alignItems: 'center',
      animation: 'fadeIn 0.2s',
      '@keyframes fadeIn': { from: { opacity: 0, transform: 'scale(0.5)' }, to: { opacity: 1, transform: 'scale(1)' } },
    }}>
      <Typography variant="body2" fontWeight={700} color="text.secondary">🎲</Typography>
      <Chip label={roll.d1} color="secondary" size="small" />
      <Chip label={roll.d2} color="secondary" size="small" />
    </Box>
  );
}

// ─── RacingCourt ──────────────────────────────────────────────────────────────

export default function RacingCourt({ horsePositions, countdown, diceRoll, finished, winnerHorseId }) {
  return (
    <Paper elevation={2} sx={{ position: 'relative', overflow: 'hidden' }}>
      {/* Header bar */}
      <Box sx={{
        background: 'linear-gradient(135deg,#1b5e20,#388e3c)',
        px: 2, py: 0.75,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <Typography variant="subtitle1" fontWeight={700} color="white">🏇 賽馬場</Typography>
        {finished && winnerHorseId && (
          <Chip label={`🏆 ${winnerHorseId}號 勝出！`} color="warning" size="small" sx={{ fontWeight: 700 }} />
        )}
      </Box>

      {/* Lanes */}
      <Box sx={{ position: 'relative' }}>
        {HORSES.map(horse => (
          <HorseLane key={horse.id} horse={horse} progress={horsePositions[horse.id] ?? 0} />
        ))}

        <DiceDisplay roll={diceRoll} />

        {/* Countdown overlay */}
        {countdown && (
          <Box sx={{
            position: 'absolute', inset: 0, zIndex: 20,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0,0,0,0.45)',
          }}>
            <Typography variant="h2" fontWeight={900} color="white" sx={{
              textShadow: '0 2px 12px rgba(0,0,0,0.8)',
              animation: 'zoomIn 0.4s',
              '@keyframes zoomIn': {
                from: { transform: 'scale(0.3)', opacity: 0 },
                to:   { transform: 'scale(1)',   opacity: 1 },
              },
            }}>
              {countdown}
            </Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
}
