/**
 * BetBoard — The main betting grid.
 *
 * Layout:
 *   Row 0  : Colour bets  (Blue x2 | Yellow x3 | Red x4 | Black 5th+ x5)
 *   Rows 1-7 : Per-horse  (horse# | Show 1-3rd x2 | Place 1-2nd x3 | Win 1st x5)
 *
 * Props:
 *   player      : { id, coins, currentBets }
 *   onPlaceBet  : (betKey, amount) => void
 *   onRemoveBet : (betKey) => void
 *   readOnly    : boolean
 */

import React, { useState } from 'react';
import { Box, Paper, Typography, Grid, Chip } from '@mui/material';
import { COLOR_BETS, HORSE_BET_TYPES, HORSES, makeBetKey } from '../constants';
import HorseAvatar from './HorseAvatar';
import BetDialog from './BetDialog';

// ─── Single interactive cell ──────────────────────────────────────────────────

function BetCell({ betKey, label, multiplier, currentBet, onOpen, readOnly }) {
  const hasBet = currentBet > 0;
  return (
    <Box
      onClick={readOnly ? undefined : () => onOpen(betKey, label, multiplier)}
      sx={{
        border: '1px solid',
        borderColor: hasBet ? 'primary.main' : 'divider',
        backgroundColor: hasBet ? '#e3f2fd' : 'background.paper',
        borderRadius: 1,
        p: 0.75,
        minHeight: 52,
        cursor: readOnly ? 'default' : 'pointer',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.15s',
        '&:hover': readOnly ? {} : { borderColor: 'primary.main', backgroundColor: '#f5f5f5' },
      }}
    >
      <Typography variant="caption" fontWeight={600} textAlign="center" lineHeight={1.2}>
        {label}
      </Typography>
      <Typography variant="caption" color="text.secondary">x{multiplier}</Typography>
      {hasBet && (
        <Chip label={`💰${currentBet}`} size="small" color="primary"
          sx={{ mt: 0.5, height: 18, fontSize: '0.65rem' }} />
      )}
    </Box>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function BetBoard({ player, onPlaceBet, onRemoveBet, readOnly = false }) {
  const [dialog, setDialog] = useState(null); // { betKey, label, multiplier } | null

  const bets  = player?.currentBets || {};
  const coins = player?.coins ?? 0;

  const openDialog  = (betKey, label, multiplier) => setDialog({ betKey, label, multiplier });
  const closeDialog = () => setDialog(null);

  const handleConfirm = (amount) => { onPlaceBet(dialog.betKey, amount); closeDialog(); };
  const handleRemove  = ()       => { onRemoveBet(dialog.betKey);        closeDialog(); };

  return (
    <Box>
      {/* ── Colour bets ──────────────────────────────────────────────────── */}
      <Typography variant="subtitle2" fontWeight={700} mb={0.5} color="text.secondary">
        顏色投注
      </Typography>
      <Grid container spacing={1} mb={2}>
        {COLOR_BETS.map(cb => (
          <Grid item xs={6} sm={3} key={cb.key}>
            <Box
              onClick={readOnly ? undefined : () => openDialog(cb.key, cb.label, cb.multiplier)}
              sx={{
                background: cb.color, color: cb.textColor,
                borderRadius: 1, p: 1, minHeight: 62,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                cursor: readOnly ? 'default' : 'pointer',
                border: bets[cb.key] > 0 ? '3px solid #fff' : '3px solid transparent',
                boxShadow: bets[cb.key] > 0 ? '0 0 0 3px #1976d2' : 'none',
                transition: 'all 0.15s',
              }}
            >
              <Typography variant="body2" fontWeight={700} textAlign="center" lineHeight={1.3}>
                {cb.label}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.85 }}>{cb.sublabel}</Typography>
              {bets[cb.key] > 0 && (
                <Chip label={`💰${bets[cb.key]}`} size="small"
                  sx={{ mt: 0.5, height: 18, fontSize: '0.65rem', background: 'rgba(255,255,255,0.9)' }} />
              )}
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* ── Per-horse bets ───────────────────────────────────────────────── */}
      <Typography variant="subtitle2" fontWeight={700} mb={0.5} color="text.secondary">
        單馬投注
      </Typography>

      {/* Column headers */}
      <Grid container spacing={0.5} mb={0.5} alignItems="center">
        <Grid item xs={2} />
        {HORSE_BET_TYPES.map(bt => (
          <Grid item xs key={bt.key}>
            <Box textAlign="center">
              <Typography variant="caption" fontWeight={700} display="block">{bt.label}</Typography>
              <Typography variant="caption" color="text.secondary">{bt.sublabel}</Typography>
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* One row per horse */}
      {HORSES.map(horse => (
        <Grid container spacing={0.5} key={horse.id} alignItems="center" mb={0.5}>
          <Grid item xs={2}>
            <Box display="flex" alignItems="center" gap={0.5} px={0.5}>
              <HorseAvatar horseId={horse.id} size={26} />
              <Typography variant="caption" fontWeight={700} sx={{ color: horse.bg }}>
                {horse.id}
              </Typography>
            </Box>
          </Grid>
          {HORSE_BET_TYPES.map(bt => {
            const betKey = makeBetKey(bt.key, horse.id);
            const typeLabels = { show: '名次', place: '位置', win: '獨贏' };
            return (
              <Grid item xs key={bt.key}>
                <BetCell
                  betKey={betKey}
                  label={`#${horse.id} ${typeLabels[bt.key]}`}
                  multiplier={bt.multiplier}
                  currentBet={bets[betKey] || 0}
                  coins={coins}
                  onOpen={openDialog}
                  readOnly={readOnly}
                />
              </Grid>
            );
          })}
        </Grid>
      ))}

      {/* ── Dialog ───────────────────────────────────────────────────────── */}
      {!readOnly && dialog && (
        <BetDialog
          open={!!dialog}
          onClose={closeDialog}
          onConfirm={handleConfirm}
          onRemove={handleRemove}
          cellLabel={dialog.label}
          multiplier={dialog.multiplier}
          currentBet={bets[dialog.betKey] || 0}
          maxAmount={coins}
        />
      )}
    </Box>
  );
}
