import type { AnswerMap, Home } from '../game/types'
import { scoreHome } from '../game/scoring'

interface ResultViewProps {
  total: number
  homes: readonly Home[]
  answers: AnswerMap
  onRestart: () => void
}

export default function ResultView({ total, homes, answers, onRestart }: ResultViewProps) {
  const scoreOffset = 326.7 * (1 - total / 30)

  return (
    <main className="result-screen" aria-labelledby="result-heading">
      <section className="result-summary">
        <span className="game-kicker">Partida completa</span>
        <h1 id="result-heading" tabIndex={-1}>Resultado final</h1>
        <p className="result-subtitle">Cinco hogares explorados. ¿Qué tan bien leíste sus pistas?</p>
        <div className="result-score-layout">
          <div className="result-ring" role="progressbar" aria-label="Puntaje total de la partida" aria-valuemin={0} aria-valuemax={30} aria-valuenow={total}>
            <svg viewBox="0 0 120 120" aria-hidden="true">
              <circle className="result-ring__track" cx="60" cy="60" r="52" />
              <circle className="result-ring__value" cx="60" cy="60" r="52" style={{ strokeDashoffset: scoreOffset }} />
            </svg>
            <span aria-hidden="true"><strong>{total}</strong><small>de 30</small></span>
          </div>
          <div className="result-score-copy">
            <strong>{total >= 24 ? '¡Leíste un montón de pistas!' : total >= 15 ? 'Buen ojo para los detalles.' : 'Cada hogar es una nueva oportunidad.'}</strong>
            <span>Tu puntaje se calcula con las respuestas exactas y plausibles de cada ronda.</span>
          </div>
        </div>
      </section>

      <section className="completed-section" aria-labelledby="completed-heading">
        <div className="section-heading">
          <span className="section-number">05 / 05</span>
          <h2 id="completed-heading">Hogares completados</h2>
        </div>
        <ol className="completed-homes">
          {homes.map((home, index) => (
            <li className="completed-home" key={home.id}>
              <span className="completed-home__number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
              <span className="completed-home__identity"><strong>{home.profileName}</strong><small>{home.title}</small></span>
              <span className="completed-home__score">{scoreHome(homes, answers, home.id)} <small>/ 6</small></span>
            </li>
          ))}
        </ol>
      </section>

      <button className="primary-button result-restart" type="button" onClick={onRestart}>
        Jugar otra vez <span aria-hidden="true">↻</span>
      </button>
    </main>
  )
}
