import { Link } from 'react-router-dom'
import styles from './Home.module.css'

const games = [
  {
    path: '/luckydraw',
    icon: '🧧',
    title: '幸運抽獎',
    desc: '翻開卡牌，看看今天的運氣如何？\n多種驚喜獎項等你來拿！',
  },
  {
    path: '/horseracing',
    icon: '🏇',
    title: '迷你賽馬',
    desc: '7匹馬、4種顏色、投注競猜！\n1至5位玩家同場競技，誰能贏得最多金幣？',
  },
  {
    path: '/mathpuzzle',
    icon: '🔢',
    title: '數算解謎',
    desc: '用四個數字，加減乘除，算出目標數！\n考驗你的數學直覺與反應能力！',
  },
]

export default function Home() {
  return (
    <div className={styles.body}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1>Vibe Minigames</h1>
          <p>精選趣味小遊戲，帶給你每日好心情</p>
        </header>

        <div className={styles.gamesGrid}>
          {games.map((g) => (
            <Link key={g.path} to={g.path} className={styles.gameCard}>
              <div className={styles.gameIcon}>{g.icon}</div>
              <h2 className={styles.gameTitle}>{g.title}</h2>
              <p className={styles.gameDesc}>
                {g.desc.split('\n').map((line, i) => (
                  <span key={i}>
                    {line}
                    {i < g.desc.split('\n').length - 1 && <br />}
                  </span>
                ))}
              </p>
              <div className={styles.playBtn}>立即開始遊戲</div>
            </Link>
          ))}
        </div>
      </div>

      <footer className={styles.footer}>
        &copy; 2026 Kencoder Studio. All rights reserved.
      </footer>
    </div>
  )
}
