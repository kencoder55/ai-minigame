import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import styles from './MathPuzzle.module.css'

/* ── Math engine ── */
const OPS = ['+', '-', '*', '/']

function opDisplay(o) {
  return o === '*' ? '×' : o === '/' ? '÷' : o === '-' ? '−' : o
}

function calc(a, op, b) {
  switch (op) {
    case '+': return a + b
    case '-': return a - b
    case '*': return a * b
    case '/': return b === 0 ? NaN : a / b
    default: return NaN
  }
}

function permutations(arr) {
  if (arr.length <= 1) return [arr.slice()]
  const res = []
  for (let i = 0; i < arr.length; i++) {
    const rest = arr.slice(0, i).concat(arr.slice(i + 1))
    permutations(rest).forEach(p => res.push([arr[i]].concat(p)))
  }
  return res
}

function findSolutions(nums) {
  const solutions = {}
  const perms = permutations(nums)
  for (const p of perms) {
    for (const o1 of OPS) for (const o2 of OPS) for (const o3 of OPS) {
      const trees = [
        { v: calc(calc(calc(p[0], o1, p[1]), o2, p[2]), o3, p[3]), s: `((${p[0]} ${opDisplay(o1)} ${p[1]}) ${opDisplay(o2)} ${p[2]}) ${opDisplay(o3)} ${p[3]}` },
        { v: calc(calc(p[0], o1, calc(p[1], o2, p[2])), o3, p[3]), s: `(${p[0]} ${opDisplay(o1)} (${p[1]} ${opDisplay(o2)} ${p[2]})) ${opDisplay(o3)} ${p[3]}` },
        { v: calc(calc(p[0], o1, p[1]), o2, calc(p[2], o3, p[3])), s: `(${p[0]} ${opDisplay(o1)} ${p[1]}) ${opDisplay(o2)} (${p[2]} ${opDisplay(o3)} ${p[3]})` },
        { v: calc(p[0], o1, calc(calc(p[1], o2, p[2]), o3, p[3])), s: `${p[0]} ${opDisplay(o1)} ((${p[1]} ${opDisplay(o2)} ${p[2]}) ${opDisplay(o3)} ${p[3]})` },
        { v: calc(p[0], o1, calc(p[1], o2, calc(p[2], o3, p[3]))), s: `${p[0]} ${opDisplay(o1)} (${p[1]} ${opDisplay(o2)} (${p[2]} ${opDisplay(o3)} ${p[3]}))` },
      ]
      for (const tree of trees) {
        const r = tree.v
        if (isFinite(r) && r > 0 && r <= 100 && Math.abs(r - Math.round(r)) < 1e-9) {
          const key = Math.round(r)
          if (!solutions[key]) solutions[key] = tree.s
        }
      }
    }
  }
  return solutions
}

function generatePuzzle() {
  for (let attempt = 0; attempt < 50; attempt++) {
    const nums = Array.from({ length: 4 }, () => Math.floor(Math.random() * 9) + 1)
    const sols = findSolutions(nums)
    const keys = Object.keys(sols).map(Number)
    const preferred = keys.filter(k => k >= 5 && k <= 80)
    const pool = preferred.length > 0 ? preferred : keys
    if (pool.length === 0) continue
    const target = pool[Math.floor(Math.random() * pool.length)]
    return { numbers: nums, target, solution: sols[target] }
  }
  return { numbers: [2, 3, 5, 7], target: 17, solution: '(2 + 5) × 3 − 7' }
}

function formatTime(s) {
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${m < 10 ? '0' : ''}${m}:${sec < 10 ? '0' : ''}${sec}`
}

/* ── Particle component ── */
function Particles({ trigger }) {
  const [particles, setParticles] = useState([])

  useEffect(() => {
    if (!trigger) return
    const colors = ['#fbbf24', '#38bdf8', '#4ade80', '#f87171', '#c084fc', '#fb923c']
    const newParticles = Array.from({ length: 28 }, (_, i) => ({
      id: i,
      left: 40 + Math.random() * 20,
      dx: (Math.random() - 0.5) * 260,
      dy: -(80 + Math.random() * 180),
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 0.3,
      size: 4 + Math.random() * 6,
    }))
    setParticles(newParticles)
    const t = setTimeout(() => setParticles([]), 2000)
    return () => clearTimeout(t)
  }, [trigger])

  return (
    <div className={styles.celebrate} aria-hidden="true">
      {particles.map(p => (
        <div
          key={p.id}
          className={styles.particle}
          style={{
            left: `${p.left}%`,
            '--dx': `${p.dx}px`,
            '--dy': `${p.dy}px`,
            backgroundColor: p.color,
            animationDelay: `${p.delay}s`,
            width: `${p.size}px`,
            height: `${p.size}px`,
          }}
        />
      ))}
    </div>
  )
}

/* ── Main component ── */
export default function MathPuzzle() {
  const [puzzle, setPuzzle] = useState(() => generatePuzzle())
  const [expression, setExpression] = useState('')
  const [feedback, setFeedback] = useState({ type: '', msg: '' })
  const [solved, setSolved] = useState(false)
  const [gaveUp, setGaveUp] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [timerActive, setTimerActive] = useState(true)
  const [celebrate, setCelebrate] = useState(0)
  const [showSolution, setShowSolution] = useState(false)
  const [streak, setStreak] = useState(0)
  const [bestTime, setBestTime] = useState(null)
  const [cardAnim, setCardAnim] = useState(0)

  const startTimeRef = useRef(Date.now())
  const timerRef = useRef(null)
  const locked = solved || gaveUp

  /* ── Timer ── */
  useEffect(() => {
    if (!timerActive) {
      clearInterval(timerRef.current)
      return
    }
    startTimeRef.current = Date.now() - elapsed * 1000
    timerRef.current = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000))
    }, 250)
    return () => clearInterval(timerRef.current)
  }, [timerActive]) // eslint-disable-line react-hooks/exhaustive-deps

  /* ── New game ── */
  const startNewGame = useCallback(() => {
    const p = generatePuzzle()
    setPuzzle(p)
    setExpression('')
    setFeedback({ type: '', msg: '' })
    setSolved(false)
    setGaveUp(false)
    setShowSolution(false)
    setElapsed(0)
    startTimeRef.current = Date.now()
    setTimerActive(true)
    setCardAnim(n => n + 1)
  }, [])

  /* ── Input helpers ── */
  const insertChar = (ch) => {
    if (locked) return
    setExpression(v => v + ch)
  }
  const backspace = () => {
    if (locked) return
    setExpression(v => v.slice(0, -1))
  }
  const clearInput = () => {
    if (locked) return
    setExpression('')
    setFeedback({ type: '', msg: '' })
  }

  /* ── Check answer ── */
  const checkAnswer = () => {
    if (locked) return
    const raw = expression.trim()
    if (!raw) { setFeedback({ type: 'error', msg: '請輸入算式' }); return }

    const expr = raw
      .replace(/×/g, '*').replace(/÷/g, '/')
      .replace(/−/g, '-')

    if (!/^[\d\s+\-*/().]+$/.test(expr)) {
      setFeedback({ type: 'error', msg: '算式包含無效字符' }); return
    }

    const numTokens = expr.match(/\d+/g)
    if (!numTokens || numTokens.length !== 4) {
      setFeedback({ type: 'error', msg: '請恰好使用 4 個數字' }); return
    }
    const used = numTokens.map(Number).sort((a, b) => a - b)
    const given = [...puzzle.numbers].sort((a, b) => a - b)
    if (used.join(',') !== given.join(',')) {
      setFeedback({ type: 'error', msg: '請使用提供的 4 個數字，每個只用一次' }); return
    }

    let result
    try { result = new Function('return (' + expr + ')')() }
    catch { setFeedback({ type: 'error', msg: '算式格式錯誤，請檢查括號' }); return }

    if (!isFinite(result)) {
      setFeedback({ type: 'error', msg: '計算錯誤（可能除以零）' }); return
    }

    if (Math.abs(result - puzzle.target) < 1e-6) {
      setSolved(true)
      setTimerActive(false)
      setStreak(s => s + 1)
      setBestTime(b => (b === null || elapsed < b ? elapsed : b))
      setFeedback({ type: 'success', msg: `🎉 正確！用時 ${formatTime(elapsed)}` })
      setCelebrate(n => n + 1)
    } else {
      const display = Math.round(result * 10000) / 10000
      setFeedback({ type: 'error', msg: `算式結果為 ${display}，目標是 ${puzzle.target}` })
    }
  }

  /* ── Give up ── */
  const giveUp = () => {
    if (locked) return
    setGaveUp(true)
    setTimerActive(false)
    setStreak(0)
    setFeedback({ type: 'info', msg: '已放棄，以下是其中一種解法：' })
    setShowSolution(true)
  }

  /* ── Derive which card indices are consumed by the current expression ── */
  const usedCardIndices = useMemo(() => {
    const digits = (expression.match(/\d/g) || []).map(Number)
    const countMap = {}
    for (const d of digits) countMap[d] = (countMap[d] || 0) + 1
    const used = new Set()
    for (let i = 0; i < puzzle.numbers.length; i++) {
      const n = puzzle.numbers[i]
      if (countMap[n] > 0) {
        used.add(i)
        countMap[n]--
      }
    }
    return used
  }, [expression, puzzle.numbers])

  /* ── Keyboard support ── */
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); checkAnswer() }
  }

  const cardKey = `card-${cardAnim}`

  return (
    <div className={styles.body}>
      <div className={styles.app}>
        <Link to="/" className={styles.backLink}>← 返回</Link>

        <header className={styles.header}>
          <h1 className={styles.title}>數算解謎</h1>
          <div className={styles.subtitle}>用四個數字，算出目標</div>
        </header>

        {/* Timer */}
        <div className={styles.timerBar}>
          <span className={styles.timerIcon}>⏱</span>
          <span className={styles.timer}>{formatTime(elapsed)}</span>
        </div>

        {/* Target */}
        <div className={styles.targetSection}>
          <div className={styles.targetLabel}>目標</div>
          <div className={`${styles.targetNumber} ${solved ? styles.celebrate_target : ''}`}>
            {puzzle.target}
          </div>
          <Particles trigger={celebrate} />
        </div>

        {/* Number cards */}
        <div className={styles.numbersSection}>
          {puzzle.numbers.map((n, i) => (
            <button
              key={`${cardKey}-${i}`}
              className={`${styles.numberCard} ${styles.animIn} ${usedCardIndices.has(i) ? styles.cardUsed : ''}`}
              style={{ animationDelay: `${0.05 + i * 0.07}s` }}
              onClick={() => insertChar(String(n))}
              disabled={locked}
            >
              {n}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className={styles.inputSection}>
          <input
            type="text"
            className={`${styles.expression} ${locked ? styles.locked : ''}`}
            placeholder="使用按鍵輸入算式..."
            value={expression}
            onChange={() => {}}
            onKeyDown={handleKeyDown}
            readOnly
          />
          <div className={styles.hint}>點按下方按鍵組合算式</div>

          {/* Keypad */}
          <div className={styles.keypad}>
            {['1','2','3'].map(d => (
              <button key={d} className={`${styles.kbtn} ${styles.num}`} onClick={() => insertChar(d)} disabled={locked || !puzzle.numbers.includes(Number(d))}>{d}</button>
            ))}
            <button className={`${styles.kbtn} ${styles.op}`} onClick={() => insertChar('+')}>+</button>
            <button className={`${styles.kbtn} ${styles.op}`} onClick={() => insertChar('−')}>−</button>
            {['4','5','6'].map(d => (
              <button key={d} className={`${styles.kbtn} ${styles.num}`} onClick={() => insertChar(d)} disabled={locked || !puzzle.numbers.includes(Number(d))}>{d}</button>
            ))}
            <button className={`${styles.kbtn} ${styles.op}`} onClick={() => insertChar('×')}>×</button>
            <button className={`${styles.kbtn} ${styles.op}`} onClick={() => insertChar('÷')}>÷</button>
            {['7','8','9'].map(d => (
              <button key={d} className={`${styles.kbtn} ${styles.num}`} onClick={() => insertChar(d)} disabled={locked || !puzzle.numbers.includes(Number(d))}>{d}</button>
            ))}
            <button className={styles.kbtn} onClick={() => insertChar('(')}>(</button>
            <button className={styles.kbtn} onClick={() => insertChar(')')}>)</button>
            <button className={`${styles.kbtn} ${styles.act} ${styles.w2}`} onClick={backspace}>⌫</button>
            <button className={`${styles.kbtn} ${styles.act} ${styles.w3}`} onClick={clearInput}>清除</button>
          </div>
        </div>

        {/* Feedback */}
        {feedback.msg && (
          <div className={`${styles.feedback} ${styles[feedback.type]} ${styles.feedbackAnim}`}>
            {feedback.msg}
          </div>
        )}

        {/* Solution */}
        {showSolution && (
          <div className={styles.solution}>
            {puzzle.solution} = {puzzle.target}
          </div>
        )}

        {/* Actions */}
        <div className={styles.actions}>
          <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={checkAnswer} disabled={locked}>
            提交答案
          </button>
          <div className={styles.actionRow}>
            <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={giveUp} disabled={locked}>
              放棄
            </button>
            <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={startNewGame}>
              新遊戲
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statIcon}>🔥</span> 連勝
            <span className={styles.statVal}>{streak}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statIcon}>⚡</span> 最快
            <span className={styles.statVal}>{bestTime !== null ? formatTime(bestTime) : '--'}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
