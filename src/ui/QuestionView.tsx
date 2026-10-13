import type { Question } from '../game/types'

interface QuestionViewProps {
  question: Question
  questionNumber: number
  onAnswer: (optionId: string) => void
}

export default function QuestionView({ question, questionNumber, onAnswer }: QuestionViewProps) {
  return (
    <section className="question-panel" aria-labelledby="question-heading">
      <p className="eyebrow">Pregunta {questionNumber} de 3</p>
      <h2 id="question-heading" tabIndex={-1}>{question.prompt}</h2>
      <fieldset className="options">
        <legend>Opciones</legend>
        {question.options.map((option, index) => (
          <button className="option" type="button" key={option.id} onClick={(event) => {
            event.currentTarget.disabled = true
            onAnswer(option.id)
          }}>
            <span className="option-letter" aria-hidden="true">{String.fromCharCode(65 + index)}</span>
            <span>{option.label}</span>
            <span className="option-arrow" aria-hidden="true">↗</span>
          </button>
        ))}
      </fieldset>
      <p className="hint">Observá los detalles. Algunas pistas admiten más de una idea.</p>
    </section>
  )
}
