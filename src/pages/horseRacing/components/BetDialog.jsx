/**
 * BetDialog — Modal popup to enter/change a bet amount for one board cell.
 *
 * Props:
 *   open       : boolean
 *   onClose    : () => void
 *   onConfirm  : (amount: number) => void
 *   onRemove   : () => void
 *   cellLabel  : string    description of the bet
 *   maxAmount  : number    player's available coins (excl. current stake)
 *   currentBet : number    already-placed amount on this cell (0 if none)
 *   multiplier : number    display only
 */

import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Typography, Box, Chip,
} from '@mui/material';

export default function BetDialog({
  open, onClose, onConfirm, onRemove,
  cellLabel, maxAmount, currentBet = 0, multiplier,
}) {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  // Sync when dialog opens
  useEffect(() => {
    if (open) { setValue(currentBet || ''); setError(''); }
  }, [open, currentBet]);

  const available = maxAmount + currentBet; // coins available if this bet is refunded first

  const handleConfirm = () => {
    const amt = parseInt(value, 10);
    if (!value || isNaN(amt) || amt <= 0) { setError('請輸入有效金額'); return; }
    if (amt > available)                  { setError(`最多可投 ${available} 金幣`); return; }
    onConfirm(amt);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>投注</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" mb={1}>{cellLabel}</Typography>
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <Chip label={`賠率 x${multiplier}`} color="primary" size="small" />
          <Chip label={`可用 ${available} 金幣`} variant="outlined" size="small" />
        </Box>
        <TextField
          autoFocus fullWidth
          label="投注金額"
          type="number"
          value={value}
          onChange={e => { setValue(e.target.value); setError(''); }}
          onKeyDown={e => e.key === 'Enter' && handleConfirm()}
          inputProps={{ min: 1, max: available }}
          error={!!error}
          helperText={error}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        {currentBet > 0 && (
          <Button color="error" onClick={onRemove} sx={{ mr: 'auto' }}>取消投注</Button>
        )}
        <Button onClick={onClose}>返回</Button>
        <Button variant="contained" onClick={handleConfirm}>確認</Button>
      </DialogActions>
    </Dialog>
  );
}
