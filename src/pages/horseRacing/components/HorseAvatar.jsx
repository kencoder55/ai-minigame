/**
 * HorseAvatar — Renders a horse using its image asset.
 * Falls back to a coloured circle + 🐎 emoji when the image is missing.
 *
 * Props:
 *   horseId   : number   (1-7)
 *   size      : number   px, default 36
 *   showLabel : boolean  show the horse number below the image
 */

import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { HORSE_MAP } from '../constants';

export default function HorseAvatar({ horseId, size = 36, showLabel = false }) {
  const horse = HORSE_MAP[horseId];
  const [imgError, setImgError] = useState(false);

  if (!horse) return null;

  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={0.25}>
      {imgError ? (
        // Fallback: coloured circle with emoji
        <Box
          sx={{
            width: size, height: size,
            borderRadius: '50%',
            background: horse.bg,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: size * 0.55,
            userSelect: 'none',
            flexShrink: 0,
          }}
        >
          🐎
        </Box>
      ) : (
        <Box
          component="img"
          src={horse.image}
          alt={`Horse ${horseId}`}
          onError={() => setImgError(true)}
          sx={{ width: size, height: size, objectFit: 'contain', flexShrink: 0 }}
        />
      )}

      {showLabel && (
        <Typography variant="caption" sx={{ color: horse.bg, fontWeight: 700, lineHeight: 1 }}>
          {horse.label}
        </Typography>
      )}
    </Box>
  );
}
