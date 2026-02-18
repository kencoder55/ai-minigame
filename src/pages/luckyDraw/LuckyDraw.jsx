import { useState, useEffect, useCallback, useRef } from 'react'
import styles from './LuckyDraw.module.css'

/* ── Confetti helper ── */
function spawnConfetti(container, count = 15) {
  const colors = ['#c0392b', '#d4a84b', '#f0d78c', '#e74c3c', '#f39c12', '#27ae60', '#2980b9']
  for (let i = 0; i < count; i++) {
    const piece = document.createElement('div')
    piece.className = styles.confettiPiece
    const size = 6 + Math.random() * 8
    piece.style.width = size + 'px'
    piece.style.height = size + 'px'
    piece.style.left = (10 + Math.random() * 80) + '%'
    piece.style.background = colors[Math.floor(Math.random() * colors.length)]
    piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px'
    piece.style.animationDuration = (1 + Math.random() * 1.5) + 's'
    piece.style.animationDelay = (Math.random() * 0.4) + 's'
    container.appendChild(piece)
    setTimeout(() => { if (piece.parentNode) piece.parentNode.removeChild(piece) }, 3000)
  }
}

export default function LuckyDraw() {
  /* ── Dark mode ── */
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const apply = (e) => document.documentElement.classList.toggle('dark', e.matches)
    apply(mq)
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  /* ── State ── */
  const [screen, setScreen] = useState('setup') // 'setup' | 'game'
  const [maxDraws, setMaxDraws] = useState(15)
  const [pool, setPool] = useState([])
  const [drawn, setDrawn] = useState([])
  const [currentNum, setCurrentNum] = useState(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [cardState, setCardState] = useState('idle') // 'idle' | 'shuffling'
  const [showModal, setShowModal] = useState(false)
  const [justDrawnNum, setJustDrawnNum] = useState(null)

  const confettiRef = useRef(null)

  /* ── Start game ── */
  const startGame = useCallback(() => {
    const nums = []
    for (let i = 1; i <= maxDraws; i++) nums.push(i)
    setPool(nums)
    setDrawn([])
    setCurrentNum(null)
    setIsAnimating(false)
    setCardState('idle')
    setShowModal(false)
    setJustDrawnNum(null)
    setScreen('game')
  }, [maxDraws])

  /* ── Draw ── */
  const draw = useCallback(() => {
    if (isAnimating || pool.length === 0) return
    setIsAnimating(true)

    const idx = Math.floor(Math.random() * pool.length)
    const num = pool[idx]

    // Trigger shuffle animation
    setCardState('idle')
    // Force reflow before setting shuffling
    requestAnimationFrame(() => {
      setCurrentNum(num)
      setCardState('shuffling')
    })

    setTimeout(() => {
      const newPool = [...pool]
      newPool.splice(idx, 1)
      setPool(newPool)
      setDrawn((prev) => [...prev, num])
      setJustDrawnNum(num)

      if (confettiRef.current) spawnConfetti(confettiRef.current)

      // Check completion
      if (newPool.length === 0) {
        setTimeout(() => {
          setShowModal(true)
          if (confettiRef.current) spawnConfetti(confettiRef.current, 40)
        }, 600)
      }

      setIsAnimating(false)
    }, 900)
  }, [isAnimating, pool])

  /* ── Restart → back to setup ── */
  const restart = useCallback(() => {
    setShowModal(false)
    setScreen('setup')
  }, [])

  const drawnCount = drawn.length
  const totalTarget = maxDraws
  const remaining = maxDraws - drawnCount
  const progress = maxDraws > 0 ? (drawnCount / maxDraws) * 100 : 0
  const allDone = pool.length === 0 && drawnCount > 0

  /* ── Dropdown options 8-99 ── */
  const options = []
  for (let i = 8; i <= 99; i++) options.push(i)

  return (
    <div className={styles.body}>
      <div className={styles.appContainer}>
        {/* Header */}
        <div className={styles.header}>
          <h1>幸運抽獎</h1>
          <p className={styles.subtitle}>LUCKY DRAW</p>
        </div>

        {/* ── Setup Screen ── */}
        {screen === 'setup' && (
          <div className={styles.setupScreen}>
            <div className={styles.setupCard}>
              <span className={styles.setupIcon}>🎴</span>
              <p className={styles.setupLabel}>設定抽獎數量</p>
              <p className={styles.setupHint}>選擇號碼範圍，從中逐一抽出所有號碼</p>
              <div className={styles.setupSelectWrapper}>
                <select
                  className={styles.setupSelect}
                  value={maxDraws}
                  onChange={(e) => setMaxDraws(parseInt(e.target.value, 10))}
                >
                  {options.map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
              <br />
              <button className={styles.startBtn} onClick={startGame}>
                開　始
              </button>
            </div>
          </div>
        )}

        {/* ── Game Screen ── */}
        {screen === 'game' && (
          <div className={styles.gameScreen}>
            {/* Stats pill */}
            <div className={styles.statsPill}>
              <span>已抽 <strong>{drawnCount}</strong> / <strong>{totalTarget}</strong></span>
              <span className={styles.divider} />
              <span>剩餘 <strong>{remaining}</strong></span>
            </div>

            {/* Progress bar */}
            <div className={styles.progressTrack}>
              <div className={styles.progressFill} style={{ width: progress + '%' }} />
            </div>

            {/* Card */}
            <div className={styles.cardStage}>
              <div
                className={
                  styles.card +
                  (cardState === 'shuffling' ? ' ' + styles.shuffling : '')
                }
              >
                <div className={`${styles.cardFace} ${styles.cardBack}`}>
                  <div className={styles.cardBackPattern}>
                    <span className={styles.cardBackIcon}>?</span>
                  </div>
                </div>
                <div className={`${styles.cardFace} ${styles.cardFront}`}>
                  <div className={styles.ornamentTop} />
                  <div className={styles.ornamentBottom} />
                  <span className={`${styles.corner} ${styles.cornerTl}`}>
                    {currentNum ?? '—'}
                  </span>
                  <span className={`${styles.corner} ${styles.cornerBr}`}>
                    {currentNum ?? '—'}
                  </span>
                  <div className={styles.cardNumber}>{currentNum ?? '—'}</div>
                  <div className={styles.cardLabel}>LUCKY NUMBER</div>
                </div>
              </div>
            </div>

            {/* Buttons */}
            {!allDone && (
              <button
                className={styles.drawBtn}
                onClick={draw}
                disabled={isAnimating}
              >
                抽　獎
              </button>
            )}
            {allDone && (
              <button className={styles.restartBtn} onClick={restart}>
                重新開始
              </button>
            )}

            {/* Number pool */}
            <div className={styles.poolSection}>
              <div className={styles.poolTitle}>號碼池 · Number Pool</div>
              <div className={styles.poolGrid}>
                {Array.from({ length: maxDraws }, (_, i) => i + 1).map((n) => {
                  const isDrawn = drawn.includes(n)
                  const isJust = n === justDrawnNum
                  return (
                    <div
                      key={n}
                      className={
                        styles.poolNum +
                        (isDrawn ? ' ' + styles.poolNumDrawn : '') +
                        (isJust ? ' ' + styles.poolNumJustDrawn : '')
                      }
                    >
                      {n}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* History */}
            {drawn.length > 0 && (
              <div className={styles.historySection}>
                <div className={styles.historyTitle}>抽出順序 · Draw Order</div>
                <div className={styles.historyList}>
                  {drawn.map((n, i) => (
                    <div key={i} className={styles.historyChip}>{n}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Completion modal */}
      {showModal && (
        <div className={`${styles.modalOverlay} ${styles.modalVisible}`}>
          <div className={styles.modalBox}>
            <div className={styles.modalIcon}>🎊</div>
            <h2>全部抽完！</h2>
            <p>已完成 {maxDraws} 次抽獎！</p>
            <button className={styles.modalRestartBtn} onClick={restart}>
              重新開始
            </button>
          </div>
        </div>
      )}

      <div className={styles.confettiContainer} ref={confettiRef} />
    </div>
  )
}
