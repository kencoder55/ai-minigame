import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import LuckyDraw from './pages/luckyDraw/LuckyDraw'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/luckydraw" element={<LuckyDraw />} />
      </Routes>
    </BrowserRouter>
  )
}
