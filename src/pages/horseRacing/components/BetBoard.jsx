/**
 * BetBoard — Casino-style green felt betting board.
 *
 * Visual design inspired by the physical horse racing bet board:
 *   • Dark green felt background with yellow border grid lines
 *   • Top row: 4 colour-group bet boxes (Blue / Yellow / Red / Black)
 *   • Column headers: SHOW | PLACE | WIN (white, bold)
 *   • Horse rows: large yellow multiplier text, horse avatar on the right
 *   • Coin-style tokens show placed bets
 *
 * Props:
 *   player      : { id, coins, currentBets }
 *   onPlaceBet  : (betKey, amount) => void
 *   onRemoveBet : (betKey) => void
 *   readOnly    : boolean
 */

import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { COLOR_BETS, HORSE_BET_TYPES, HORSES, makeBetKey } from '../constants';
import HorseAvatar from './HorseAvatar';
import BetDialog from './BetDialog';

// ─── Design tokens ────────────────────────────────────────────────────────────

const FELT_GREEN = '#1a6b35';
const FELT_DARK  = '#155229';
const BORDER     = '2px solid #f5c518';  // yellow grid lines
const HEADER_BG  = '#0d3d1f';

// ─── Coin token for placed bets ───────────────────────────────────────────────

function CoinToken({ amount }) {
  return (
    <Box sx={{
      width: 28, height: 28, borderRadius: '50%',
      background: 'radial-gradient(circle at 35% 35%, #ffe57f, #e6a800)',
      border: '2px solid #c8860a',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: '0 2px 4px rgba(0,0,0,0.5)',
      position: 'absolute', top: -10, right: -10, zIndex: 3,
    }}>
      <Typography sx={{ fontSize: '0.6rem', fontWeight: 900, color: '#7a4f00', lineHeight: 1 }}>
        {amount}
      </Typography>
    </Box>
  );
}

// ─── Single bet cell ──────────────────────────────────────────────────────────

function BetCell({ betKey, multiplier, currentBet, onOpen, readOnly, dimmed }) {
  const hasBet = currentBet > 0;
  return (
    <Box
      onClick={readOnly ? undefined : () => onOpen(betKey, multiplier)}
      sx={{
        position: 'relative',
        flex: 1,
        minHeight: 52,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: readOnly ? 'default' : 'pointer',
        background: hasBet ? 'rgba(245,197,24,0.18)' : (dimmed ? FELT_DARK : FELT_GREEN),
        borderRight: BORDER,
        transition: 'background 0.15s',
        '&:hover': readOnly ? {} : { background: 'rgba(255,255,255,0.1)' },
      }}
    >
      <Typography sx={{
        fontSize: '1.25rem', fontWeight: 900,
        color: hasBet ? '#ffe57f' : '#f5c518',
        textShadow: '0 1px 4px rgba(0,0,0,0.8)',
        letterSpacing: '0.02em',
      }}>
        {multiplier}x
      </Typography>
      {hasBet && <CoinToken amount={currentBet} />}
    </Box>
  );
}

// ─── Column header cell ───────────────────────────────────────────────────────

function HeaderCell({ label, sublabel, borderRight = true }) {
  return (
    <Box sx={{
      flex: 1, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      py: 0.75,
      borderRight: borderRight ? BORDER : 'none',
      background: HEADER_BG,
    }}>
      <Typography sx={{
        fontSize: '0.85rem', fontWeight: 900, color: '#fff',
        textTransform: 'uppercase', letterSpacing: '0.06em', lineHeight: 1.1,
      }}>
        {label}
      </Typography>
      {sublabel && (
        <Typography sx={{ fontSize: '0.58rem', color: 'rgba(255,255,255,0.55)', mt: 0.2 }}>
          {sublabel}
        </Typography>
      )}
    </Box>
  );
}

// ─── Main BetBoard ────────────────────────────────────────────────────────────

export default function BetBoard({ player, onPlaceBet, onRemoveBet, readOnly = false }) {
  const [dialog, setDialog] = useState(null); // { betKey, multiplier } | null

  const bets  = player?.currentBets || {};
  const coins = player?.coins ?? 0;

  const openDialog  = (betKey, multiplier) => setDialog({ betKey, multiplier });
  const closeDialog = () => setDialog(null);

  const handleConfirm = (amount) => { onPlaceBet(dialog.betKey, amount); closeDialog(); };
  const handleRemove  = ()       => { onRemoveBet(dialog.betKey);         closeDialog(); };

  // Build human-readable label for the dialog title
  const dialogLabel = (() => {
    if (!dialog) return '';
    const cb = COLOR_BETS.find(b => b.key === dialog.betKey);
    if (cb) return cb.label;
    for (const bt of HORSE_BET_TYPES) {
      const prefix = `${bt.key}_`;
      if (dialog.betKey.startsWith(prefix)) {
        return `#${dialog.betKey.replace(prefix, '')} ${bt.label}`;
      }
    }
    return dialog.betKey;
  })();

  return (
    <Box sx={{
      border: '3px solid #f5c518',
      borderRadius: 2,
      overflow: 'hidden',
      background: FELT_GREEN,
      userSelect: 'none',
    }}>

      {/* ── Row 1: Colour bet boxes ─────────────────────────────────────── */}
      <Box sx={{ display: 'flex', borderBottom: BORDER }}>
        {COLOR_BETS.map((cb, i) => (
          <Box
            key={cb.key}
            onClick={readOnly ? undefined : () => openDialog(cb.key, cb.multiplier)}
            sx={{
              position: 'relative',
              flex: 1,
              background: cb.color,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              py: 1, px: 0.5, minHeight: 64,
              borderRight: i < COLOR_BETS.length - 1 ? BORDER : 'none',
              cursor: readOnly ? 'default' : 'pointer',
              transition: 'filter 0.15s',
              '&:hover': readOnly ? {} : { filter: 'brightness(1.15)' },
              outline: bets[cb.key] > 0 ? '3px solid #f5c518' : 'none',
              outlineOffset: -3,
            }}
          >
            <Typography sx={{
              fontSize: '0.65rem', fontWeight: 900, color: cb.textColor,
              textAlign: 'center', lineHeight: 1.25, textTransform: 'uppercase',
            }}>
              {cb.label}
            </Typography>
            <Typography sx={{
              fontSize: '1.2rem', fontWeight: 900, color: cb.textColor,
              textShadow: '0 1px 3px rgba(0,0,0,0.35)',
            }}>
              {cb.multiplier}x
            </Typography>
            {bets[cb.key] > 0 && <CoinToken amount={bets[cb.key]} />}
          </Box>
        ))}
      </Box>

      {/* ── Row 2: Column headers ───────────────────────────────────────── */}
      <Box sx={{ display: 'flex', borderBottom: BORDER }}>
        <HeaderCell label="SHOW"  sublabel="1st – 3rd" />
        <HeaderCell label="PLACE" sublabel="1st – 2nd" />
        <HeaderCell label="WIN"   sublabel="1st only" borderRight={false} />
        {/* spacer matching horse-avatar column */}
        <Box sx={{ width: 52, flexShrink: 0, background: HEADER_BG, borderLeft: BORDER }} />
      </Box>

      {/* ── Rows 3–9: One row per horse ────────────────────────────────── */}
      {HORSES.map((horse, rowIndex) => {
        const dimmed = rowIndex % 2 === 1;
        return (
          <Box
            key={horse.id}
            sx={{
              display: 'flex', alignItems: 'stretch',
              borderBottom: rowIndex < HORSES.length - 1 ? BORDER : 'none',
              background: dimmed ? FELT_DARK : FELT_GREEN,
            }}
          >
            <BetCell
              betKey={makeBetKey('show', horse.id)}
              multiplier={HORSE_BET_TYPES[0].multiplier}
              currentBet={bets[makeBetKey('show', horse.id)] || 0}
              onOpen={openDialog} readOnly={readOnly} dimmed={dimmed}
            />
            <BetCell
              betKey={makeBetKey('place', horse.id)}
              multiplier={HORSE_BET_TYPES[1].multiplier}
              currentBet={bets[makeBetKey('place', horse.id)] || 0}
              onOpen={openDialog} readOnly={readOnly} dimmed={dimmed}
            />
            <BetCell
              betKey={makeBetKey('win', horse.id)}
              multiplier={HORSE_BET_TYPES[2].multiplier}
              currentBet={bets[makeBetKey('win', horse.id)] || 0}
              onOpen={openDialog} readOnly={readOnly} dimmed={dimmed}
            />
            {/* Horse avatar */}
            <Box sx={{
              width: 52, flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: horse.bg,
              borderLeft: BORDER,
            }}>
              <HorseAvatar horseId={horse.id} size={30} />
            </Box>
          </Box>
        );
      })}

      {/* ── Row: Footer column labels ───────────────────────────────────── */}
      <Box sx={{ display: 'flex', borderTop: BORDER }}>
        <HeaderCell label="SHOW"  sublabel="" />
        <HeaderCell label="PLACE" sublabel="" />
        <HeaderCell label="WIN"   sublabel="" borderRight={false} />
        <Box sx={{ width: 52, flexShrink: 0, background: HEADER_BG, borderLeft: BORDER }} />
      </Box>

      {/* ── Bet Dialog ──────────────────────────────────────────────────── */}
      {!readOnly && dialog && (
        <BetDialog
          open={!!dialog}
          onClose={closeDialog}
          onConfirm={handleConfirm}
          onRemove={handleRemove}
          cellLabel={dialogLabel}
          multiplier={dialog.multiplier}
          currentBet={bets[dialog.betKey] || 0}
          maxAmount={coins}
        />
      )}
    </Box>
  );
}
