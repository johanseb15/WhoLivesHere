import type { Home } from '../game/types'

interface HomeViewProps {
  home: Home
  onStart: () => void
}

const steps = [
  ['01', 'Mirá el hogar', 'Cada detalle puede ser una pista.'],
  ['02', 'Respondé 3 preguntas', 'Sin puntos hasta revelar el perfil.'],
  ['03', 'Descubrí quién vive ahí', 'Después, seguí con otro hogar.'],
] as const

export default function HomeView({ home, onStart }: HomeViewProps) {
  const sceneSrc = `${import.meta.env.BASE_URL}${home.imageSrc.replace(/^\/+/, '')}`

  return (
    <main className="start-screen" aria-labelledby="start-heading">
      <div className="start-copy">
        <span className="game-kicker">Juego de deducción visual</span>
        <h1 id="start-heading">20 hogares,<br /><span>20 misterios.</span></h1>
        <p className="start-description">Observá los detalles, armá tus teorías y descubrí quién vive en cada lugar.</p>
        <ol className="start-steps">
          {steps.map(([number, title, description]) => (
            <li className="start-step" key={number}>
              <span className="start-step__number" aria-hidden="true">{number}</span>
              <span><strong>{title}</strong><small>{description}</small></span>
            </li>
          ))}
        </ol>
        <button className="primary-button start-button" type="button" onClick={onStart}>
          Empezar a jugar <span aria-hidden="true">→</span>
        </button>
        <p className="start-note">60 preguntas · Sin reloj · Hasta 120 puntos</p>
      </div>

      <div className="mystery-card" aria-hidden="true">
        <img className="mystery-card__scene" src={sceneSrc} alt="" />
        <div className="mystery-card__shade" />
        <span className="mystery-card__question mystery-card__question--one">?</span>
        <span className="mystery-card__question mystery-card__question--two">?</span>
        <div className="mystery-card__label">
          <span>HOGAR 01</span>
          <strong>¿Quién vive aquí?</strong>
        </div>
        <div className="mystery-card__seal"><span>20</span><small>HOGARES</small></div>
      </div>
    </main>
  )
}
