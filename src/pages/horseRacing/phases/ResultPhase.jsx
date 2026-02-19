/**
 * ResultPhase — Final standings screen.
 *   Top    : players ranked by coins
 *   Middle : per-turn history
 *   Bottom : "開始新遊戲" restart button
 *
 * Props:
 *   state   : game state
 *   restart : () => void
 */

import React from 'react';
import {
  Box, Button, Card, CardContent, Typography,
  Table, TableBody, TableCell, TableHead, TableRow,
  Chip, Divider,
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

const MEDALS = ['🥇', '🥈', '🥉'];

export default function ResultPhase({ state, restart }) {
  const { players, turnHistory, maxTurns } = state;

  // Sort players by coins descending
  const ranked = [...players].sort((a, b) => b.coins - a.coins);

  return (
    <Box
      minHeight="100vh"
      sx={{ background: 'linear-gradient(160deg,#1a1a2e 0%,#16213e 100%)', pb: 6, pt: 4 }}
    >
      {/* Trophy header */}
      <Box textAlign="center" mb={4}>
        <EmojiEventsIcon sx={{ fontSize: 72, color: '#F9A825' }} />
        <Typography variant="h3" fontWeight={900} color="white" mt={1}>最終結果</Typography>
        <Typography variant="body1" color="rgba(255,255,255,0.6)">
          {maxTurns} 回合賽事結束
        </Typography>
      </Box>

      <Box maxWidth={500} mx="auto" px={2}>
        {/* Player ranking cards */}
        <Box display="flex" flexDirection="column" gap={2} mb={4}>
          {ranked.map((player, index) => (
            <Card
              key={player.id}
              elevation={index === 0 ? 8 : 2}
              sx={{
                borderRadius: 3,
                border: index === 0 ? '2px solid #F9A825' : '1px solid rgba(255,255,255,0.1)',
                background: index === 0
                  ? 'linear-gradient(135deg,#1b5e20,#2e7d32)'
                  : 'rgba(255,255,255,0.05)',
                transform: index === 0 ? 'scale(1.03)' : 'none',
              }}
            >
              <CardContent sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography sx={{ fontSize: '2.2rem', minWidth: 40, textAlign: 'center' }}>
                  {MEDALS[index] ?? `${index + 1}`}
                </Typography>
                <Box flex={1}>
                  <Typography variant="h6" fontWeight={800}
                    color={index === 0 ? 'white' : 'rgba(255,255,255,0.85)'}>
                    {player.name}
                  </Typography>
                  <Typography variant="body2"
                    color={index === 0 ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.45)'}>
                    第 {index + 1} 名
                  </Typography>
                </Box>
                <Box textAlign="right">
                  <Typography variant="h5" fontWeight={900}
                    color={index === 0 ? '#FDD835' : 'rgba(255,255,255,0.8)'}>
                    💰 {player.coins}
                  </Typography>
                  <Typography variant="caption" color="rgba(255,255,255,0.4)">金幣</Typography>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Turn history */}
        {turnHistory.length > 0 && (
          <Card sx={{
            mb: 4, borderRadius: 3,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={700} color="rgba(255,255,255,0.8)" mb={1.5}>
                回合紀錄
              </Typography>
              {turnHistory.map(h => (
                <Box key={h.turn} mb={1.5}>
                  <Typography variant="caption" color="rgba(255,255,255,0.5)">
                    第 {h.turn} 回合 — 冠軍: #{h.finalRanking[0]}號
                  </Typography>
                  <Box display="flex" gap={1} flexWrap="wrap" mt={0.25}>
                    {h.playerSnapshots.map(ps => (
                      <Chip key={ps.id}
                        label={`${ps.name}: ${ps.lastEarned > 0 ? `+${ps.lastEarned}` : '無贏'}`}
                        size="small"
                        sx={{
                          background: ps.lastEarned > 0 ? 'rgba(76,175,80,0.3)' : 'rgba(255,255,255,0.08)',
                          color: 'rgba(255,255,255,0.8)',
                          fontSize: '0.65rem',
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Restart */}
        <Button
          variant="contained" size="large" fullWidth
          onClick={restart}
          sx={{
            py: 2, fontWeight: 800, fontSize: '1.15rem', borderRadius: 3,
            background: 'linear-gradient(90deg,#F9A825,#FF6F00)',
            '&:hover': { background: 'linear-gradient(90deg,#FF6F00,#F9A825)' },
          }}
        >
          🏇 開始新遊戲
        </Button>
      </Box>
    </Box>
  );
}
