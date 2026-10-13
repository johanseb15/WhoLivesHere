import type { AnswerMap, Home } from '../game/types'
import { gradeAnswer, scoreHome } from '../game/scoring'

interface RevealViewProps {
  home: Home
  answers: AnswerMap
  homes: readonly Home[]
  isLast: boolean
  onNext: () => void
}

export default function RevealView({ home, answers, homes, isLast, onNext }: RevealViewProps) {
  return (
    <section className="reveal-panel" aria-labelledby="reveal-heading">
      <p className="eyebrow">El perfil de este hogar</p>
      <h2 id="reveal-heading" tabIndex={-1}>{home.profileName}</h2>
      <p className="profile-quote">“{home.profile}”</p>
      <p className="reveal-copy">{home.reveal}</p>
      <div className="score-card" aria-label="Puntuación de la ronda">
        <span>Tu puntuación</span>
        <strong>{scoreHome(homes, answers, home.id)} / 6</strong>
      </div>
      <ol className="answer-review">
        {home.questions.map((question) => {
          const selected = question.options.find((option) => option.id === answers[question.id])
          const grade = selected ? gradeAnswer(homes, question.id, selected.id) : null
          return (
            <li key={question.id}>
              <p className="review-question">{question.prompt}</p>
              <p className="review-choice">{selected?.label} <strong>{grade?.points} / 2</strong></p>
              <p className="review-explanation">{grade?.explanation}</p>
            </li>
          )
        })}
      </ol>
      <button className="primary-button" type="button" onClick={onNext}>
        {isLast ? 'Ver resultado final' : 'Siguiente hogar'} <span aria-hidden="true">→</span>
      </button>
    </section>
  )
}
