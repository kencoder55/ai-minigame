import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import LuckyDraw from './pages/luckyDraw/LuckyDraw'
import HorseRacing from './pages/horseRacing/HorseRacing'
import MathPuzzle from './pages/mathPuzzle/MathPuzzle'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/luckydraw" element={<LuckyDraw />} />
        <Route path="/horseracing" element={<HorseRacing />} />
        <Route path="/mathpuzzle" element={<MathPuzzle />} />
      </Routes>
    </BrowserRouter>
  )
}
