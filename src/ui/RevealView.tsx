import type { AnswerMap, Home } from '../game/types'
import { gradeAnswer, scoreHome } from '../game/scoring'
import RevealPortrait from './RevealPortrait'

interface RevealViewProps {
  home: Home
  answers: AnswerMap
  homes: readonly Home[]
  isLast: boolean
  onNext: () => void
}

export default function RevealView({ home, answers, homes, isLast, onNext }: RevealViewProps) {
  const roundScore = scoreHome(homes, answers, home.id)

  return (
    <section className="reveal-panel" aria-labelledby="reveal-heading">
      <section className="reveal-hero" aria-label={`Perfil de ${home.profileName}`}>
        <div className={`reveal-stage${home.revealPortrait ? '' : ' reveal-stage--scene'}`}>
          <div className="reveal-stage__glow" aria-hidden="true" />
          <RevealPortrait key={home.id} portrait={home.revealPortrait} fallback={{ src: home.imageSrc, alt: home.imageAlt }} />
        </div>
        <div className="reveal-identity">
          <p className="eyebrow">Aquí vive</p>
          <div className="reveal-title-row">
            <h2 id="reveal-heading" tabIndex={-1}>{home.profileName}</h2>
            <div className="score-card" role="status" aria-label={`Puntuación de la ronda: ${roundScore} de 6`}>
              <span>Tu puntuación</span>
              <strong>{roundScore} <small>/ 6</small></strong>
            </div>
          </div>
          <p className="profile-quote">“{home.profile}”</p>
        </div>
      </section>
      <p className="reveal-copy">{home.reveal}</p>
      <ol className="answer-review">
        {home.questions.map((question) => {
          const selected = question.options.find((option) => option.id === answers[question.id])
          const grade = selected ? gradeAnswer(homes, question.id, selected.id) : null
          const gradeLabel = grade?.points === 2 ? 'Acierto' : grade?.points === 1 ? 'Parcial' : 'Sin apoyo'
          return (
            <li className={`answer-review__item answer-review__item--${grade?.points ?? 0}`} key={question.id}>
              <p className="review-question">{question.prompt}</p>
              <p className="review-choice"><span>{selected?.label}</span><strong>{grade?.points} <small>/ 2</small></strong></p>
              <span className="review-grade">{gradeLabel}</span>
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
