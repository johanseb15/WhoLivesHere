import { useEffect, useReducer, useRef } from 'react'
import { homes } from './game/content'
import { createInitialState, transition } from './game/machine'
import { scoreGame } from './game/scoring'
import QuestionView from './ui/QuestionView'
import RevealView from './ui/RevealView'
import ResultView from './ui/ResultView'
import Scene from './ui/Scene'

export default function App() {
  const didMount = useRef(false)
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

  if (state.phase === 'resultado') {
    return (
      <div className="app-shell">
        <header className="site-header"><span className="brand">WhoLivesHere<span className="brand-mark">?</span></span><span className="edition">Edición 0.1</span></header>
        <ResultView total={scoreGame(homes, state.answers)} onRestart={() => dispatch({ type: 'NUEVA_PARTIDA' })} />
      </div>
    )
  }

  const home = homes[state.homeIndex]
  return (
    <div className="app-shell">
      <header className="site-header">
        <span className="brand">WhoLivesHere<span className="brand-mark">?</span></span>
        <span className="edition">Edición 0.1</span>
      </header>
      <main className="game-layout">
        <section className="scene-column" aria-label="Hogar ilustrado">
          <div className="round-meta">
            <span className="round-label">Hogar {state.homeIndex + 1} de 5</span>
            <span className="round-dots" aria-hidden="true">
              {homes.map((item, index) => <span key={item.id} className={index <= state.homeIndex ? 'active' : ''} />)}
            </span>
          </div>
          <Scene src={home.imageSrc} alt={home.imageAlt} title={home.title} />
          <p className="scene-note">Mirá con atención: cada objeto puede contar una historia.</p>
        </section>
        {state.phase === 'pregunta'
          ? <QuestionView question={home.questions[state.questionIndex]} questionNumber={state.questionIndex + 1} onAnswer={(optionId) => dispatch({ type: 'RESPONDER', optionId })} />
          : <RevealView home={home} homes={homes} answers={state.answers} isLast={state.homeIndex === homes.length - 1} onNext={() => dispatch({ type: state.homeIndex === homes.length - 1 ? 'VER_RESULTADO' : 'SIGUIENTE' })} />}
      </main>
    </div>
  )
}
