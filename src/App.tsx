import { useEffect, useReducer, useState } from 'react'
import { homes } from './game/content'
import { createInitialState, transition } from './game/machine'
import { scoreGame } from './game/scoring'
import QuestionView from './ui/QuestionView'
import RevealView from './ui/RevealView'
import ResultView from './ui/ResultView'
import Scene from './ui/Scene'
import HomeView from './ui/HomeView'

function SiteHeader() {
  return (
    <header className="site-header">
      <span className="brand">WhoLives<span>Here?</span></span>
      <span className="edition">Edición 0.1</span>
    </header>
  )
}

export default function App() {
  const [showIntro, setShowIntro] = useState(true)
  const [state, dispatch] = useReducer(
    (current: ReturnType<typeof createInitialState>, action: Parameters<typeof transition>[1]) =>
      transition(current, action, homes),
    undefined,
    createInitialState,
  )

  useEffect(() => {
    if (showIntro) return
    const headingId = state.phase === 'pregunta'
      ? 'question-heading'
      : state.phase === 'revelacion' ? 'reveal-heading' : 'result-heading'
    document.getElementById(headingId)?.focus()
  }, [showIntro, state.phase, state.homeIndex, state.questionIndex])

  const startNewGame = () => {
    dispatch({ type: 'NUEVA_PARTIDA' })
    setShowIntro(true)
  }

  if (showIntro) return <div className="app-shell"><SiteHeader /><HomeView home={homes[0]} onStart={() => setShowIntro(false)} /></div>
  if (state.phase === 'resultado') return <div className="app-shell"><SiteHeader /><ResultView total={scoreGame(homes, state.answers)} homes={homes} answers={state.answers} onRestart={startNewGame} /></div>

  const home = homes[state.homeIndex]
  return (
    <div className="app-shell">
      <SiteHeader />
      <main className={`game-layout${state.phase === 'revelacion' ? ' game-layout--reveal' : ''}`}>
        <section className="scene-column" aria-label="Hogar ilustrado">
          <div className="round-meta">
            <span className="round-label">Hogar {state.homeIndex + 1} de {homes.length}</span>
            <div className="home-progress" role="progressbar" aria-label="Progreso de hogares" aria-valuemin={0} aria-valuemax={homes.length} aria-valuenow={state.homeIndex + 1}>
              <span style={{ width: `${((state.homeIndex + 1) / homes.length) * 100}%` }} />
            </div>
          </div>
          <Scene src={home.imageSrc} alt={home.imageAlt} title={home.title} showTitle={state.phase === 'revelacion'} />
          {state.phase === 'pregunta' && <p className="scene-note">Mirá con atención: cada objeto puede contar una historia.</p>}
        </section>
        {state.phase === 'pregunta'
          ? <QuestionView key={home.questions[state.questionIndex].id} question={home.questions[state.questionIndex]} questionNumber={state.questionIndex + 1} onAnswer={(optionId) => dispatch({ type: 'RESPONDER', optionId })} />
          : <RevealView home={home} homes={homes} answers={state.answers} isLast={state.homeIndex === homes.length - 1} onNext={() => dispatch({ type: state.homeIndex === homes.length - 1 ? 'VER_RESULTADO' : 'SIGUIENTE' })} />}
      </main>
    </div>
  )
}
