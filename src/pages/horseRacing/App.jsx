import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import LuckyDraw from './pages/luckyDraw/LuckyDraw'
import HorseRacing from './pages/horseRacing/HorseRacing'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/luckydraw" element={<LuckyDraw />} />
        <Route path="/horseracing" element={<HorseRacing />} />
      </Routes>
    </BrowserRouter>
  )
}
