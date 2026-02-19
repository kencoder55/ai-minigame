/**
 * StartPhase — Game setup screen.
 * Host chooses turn count, player count, and player names,
 * then presses "開始落注" to move to the Bet phase.
 *
 * Props:
 *   configureGame : (maxTurns, players) => void
 *   goToBet       : () => void
 */

import React, { useState } from 'react';
import {
    Box, Button, Card, CardContent, Typography,
    TextField, Select, MenuItem, FormControl, InputLabel,
    Divider, Stack,
    Grid,
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { MAX_TURNS, MIN_TURNS, MAX_PLAYERS, MIN_PLAYERS } from '../constants';

export default function StartPhase({ configureGame, goToBet }) {
    const [numTurns, setNumTurns] = useState(3);
    const [numPlayers, setNumPlayers] = useState(2);
    const [playerNames, setPlayerNames] = useState(['玩家1', '玩家2']);

    // Grow / shrink name array when player count changes
    const handlePlayerCount = (count) => {
        setNumPlayers(count);
        setPlayerNames(prev => {
            const next = [...prev];
            while (next.length < count) next.push(`玩家${next.length + 1}`);
            return next.slice(0, count);
        });
    };

    const handleStart = () => {
        const players = playerNames.slice(0, numPlayers).map((name, i) => ({
            name: name.trim() || `玩家${i + 1}`,
        }));
        configureGame(numTurns, players);
        goToBet();
    };

    return (
        <Box
            minHeight="100vh"
            display="flex" alignItems="center" justifyContent="center"
            sx={{ background: 'linear-gradient(160deg,#1b5e20 0%,#4caf50 100%)', p: 2 }}
        >
            <Card sx={{ maxWidth: 480, width: '100%', borderRadius: 3, boxShadow: 6 }}>
                <CardContent sx={{ p: 4 }}>
                    {/* Header */}
                    <Box textAlign="center" mb={3}>
                        <EmojiEventsIcon sx={{ fontSize: 56, color: '#F9A825' }} />
                        <Typography variant="h4" fontWeight={900} mt={1}>迷你賽馬</Typography>
                    </Box>

                    <Divider sx={{ mb: 3 }} />

                    <Grid container spacing={3} mb={2} alignItems="center">
                        <Grid item size={6}>
                            <FormControl fullWidth>
                                <InputLabel>賽事回合數</InputLabel>
                                <Select value={numTurns} label="賽事回合數" onChange={e => setNumTurns(e.target.value)}>
                                    {Array.from({ length: MAX_TURNS - MIN_TURNS + 1 }, (_, i) => i + MIN_TURNS).map(n => (
                                        <MenuItem key={n} value={n}>{n} 回合</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item  size={6}>
                            <FormControl fullWidth>
                                <InputLabel>玩家人數</InputLabel>
                                <Select value={numPlayers} label="玩家人數" onChange={e => handlePlayerCount(e.target.value)}>
                                    {Array.from({ length: MAX_PLAYERS - MIN_PLAYERS + 1 }, (_, i) => i + MIN_PLAYERS).map(n => (
                                        <MenuItem key={n} value={n}>{n} 位玩家</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>


                    <Stack spacing={2.5}>

                        {/* Player names */}
                        <Box>
                            <Typography variant="subtitle2" fontWeight={600} color="text.secondary" mb={1}>
                                玩家名稱
                            </Typography>

                            {playerNames.slice(0, numPlayers).map((name, i) => (
                                <Grid container spacing={2} mb={1} alignItems="center">
                                    <Grid item size={4}>
                                        <Typography color="text.secondary">
                                            玩家 {i + 1}
                                        </Typography>
                                    </Grid>
                                    <Grid item size={8}>
                                        <TextField
                                            size="small" fullWidth
                                            onChange={e => {
                                                const next = [...playerNames];
                                                next[i] = e.target.value;
                                                setPlayerNames(next);
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            ))}

        
                        </Box>

                        {/* Start button */}
                        <Button
                            variant="contained" size="large" fullWidth
                            onClick={handleStart}
                            sx={{
                                mt: 1, py: 1.5, fontWeight: 800, fontSize: '1.1rem',
                                background: 'linear-gradient(90deg,#F9A825,#FF6F00)',
                                '&:hover': { background: 'linear-gradient(90deg,#FF6F00,#F9A825)' },
                            }}
                        >
                            🏇 開始遊戲
                        </Button>
                    </Stack>
                </CardContent>
            </Card>
        </Box>
    );
}
