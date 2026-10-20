import { useEffect, useReducer, useRef, useState } from 'react'
import { homes } from './game/content'
import { createInitialState, transition } from './game/machine'
import { scoreGame } from './game/scoring'
import QuestionView from './ui/QuestionView'
import RevealView from './ui/RevealView'
import ResultView from './ui/ResultView'
import Scene from './ui/Scene'

export default function App() {
  const didMount = useRef(false)
  const [sceneExpanded, setSceneExpanded] = useState(false)
  const [state, dispatch] = useReducer(
    (current: ReturnType<typeof createInitialState>, action: Parameters<typeof transition>[1]) =>
      transition(current, action, homes),
    undefined,
    createInitialState,
  )

  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true
      return
    }
    const headingId = state.phase === 'pregunta'
      ? 'question-heading'
      : state.phase === 'revelacion' ? 'reveal-heading' : 'result-heading'
    document.getElementById(headingId)?.focus()
  }, [state.phase, state.homeIndex, state.questionIndex])

  const home = homes[state.homeIndex]
  const sceneSrc = state.homeIndex === 0 ? "/assets/h01/home.jpg" : state.homeIndex === 1 ? "/assets/h02/home.jpg" : state.homeIndex === 2 ? "/assets/h03/home.jpg" : state.homeIndex === 3 ? "/assets/h04/home.jpg" : state.homeIndex === 4 ? "/assets/h05/home.jpg" : home.imageSrc
  const status = state.phase === 'resultado'
    ? 'Partida completada'
    : state.phase === 'revelacion'
      ? `Hogar ${state.homeIndex + 1} de ${homes.length} completado`
      : `Hogar ${state.homeIndex + 1} de ${homes.length}. Pregunta ${state.questionIndex + 1} de ${home.questions.length}`
  return (
    <div className="app-shell">
      <header className="site-header">
        <span className="brand">WhoLivesHere<span className="brand-mark">?</span></span>
        <span className="edition">20 hogares</span>
      </header>
      <div className="sr-only" role="status" aria-atomic="true">{status}</div>
      {state.phase === 'resultado'
        ? <ResultView total={scoreGame(homes, state.answers)} maxScore={homes.length * 6} homeCount={homes.length} onRestart={() => dispatch({ type: 'NUEVA_PARTIDA' })} />
        : <main className="game-layout">
        <section className="scene-column" aria-label="Hogar ilustrado">
          <div className="round-meta">
            <span className="round-label">Hogar {state.homeIndex + 1} de {homes.length}</span>
            <span className="round-progress" role="progressbar" aria-label="Progreso de hogares" aria-valuemin={0} aria-valuemax={homes.length} aria-valuenow={state.homeIndex + 1}>
              <span style={{ width: `${((state.homeIndex + 1) / homes.length) * 100}%` }} />
            </span>
          </div>
          {state.phase === 'revelacion' && (
            <button className="reveal-scene-toggle" type="button"
              aria-controls="scene-photo" aria-expanded={sceneExpanded}
              onClick={() => setSceneExpanded((previous) => !previous)}>
              {sceneExpanded ? 'Ocultar escena' : 'Volver a ver la escena'}
            </button>
          )}
          <div id="scene-photo" className={`primary-scene${sceneExpanded ? " scene-expanded" : ""}`}>
            <Scene src={sceneSrc} alt={home.imageAlt} title={home.title} />
          </div>
          <p className="scene-note">Mirá con atención: cada objeto puede contar una historia.</p>
        </section>
        {state.phase === 'pregunta'
          ? <QuestionView question={home.questions[state.questionIndex]} questionNumber={state.questionIndex + 1} onAnswer={(optionId) => dispatch({ type: 'RESPONDER', optionId })} />
          : <RevealView characterSrc={state.homeIndex === 0 ? "/assets/h01/character-reveal.png" : state.homeIndex === 1 ? "/assets/h02/character-reveal.jpg" : state.homeIndex === 2 ? "/assets/h03/character-reveal.png" : state.homeIndex === 3 ? "/assets/h04/character-reveal.jpg" : state.homeIndex === 4 ? "/assets/h05/character-reveal.png" : undefined} home={home} homes={homes} answers={state.answers} isLast={state.homeIndex === homes.length - 1} onNext={() => { setSceneExpanded(false); dispatch({ type: state.homeIndex === homes.length - 1 ? 'VER_RESULTADO' : 'SIGUIENTE' }) }} />}
      </main>}
    </div>
  )
}
