import { useEffect, useRef, useState } from 'react'
import type { Question } from '../game/types'

interface QuestionViewProps {
  question: Question
  questionNumber: number
  onAnswer: (optionId: string) => void
}

export default function QuestionView({ question, questionNumber, onAnswer }: QuestionViewProps) {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null)
  const selectionLocked = useRef(false)
  const advanceTimer = useRef<number | null>(null)

  useEffect(() => () => {
    if (advanceTimer.current !== null) window.clearTimeout(advanceTimer.current)
  }, [])

  const selectOption = (optionId: string) => {
    if (selectionLocked.current) return
    selectionLocked.current = true
    setSelectedOptionId(optionId)
    advanceTimer.current = window.setTimeout(() => onAnswer(optionId), 220)
  }

  return (
    <section className="question-panel" aria-labelledby="question-heading">
      <div className="question-progress">
        <p className="eyebrow">Pregunta {questionNumber} de 3</p>
        <div className="question-progress__pips" role="img" aria-label={`Progreso: pregunta ${questionNumber} de 3`}>
          {[1, 2, 3].map((step) => <span key={step} className={step <= questionNumber ? 'active' : ''} />)}
        </div>
      </div>
      <h2 id="question-heading" tabIndex={-1}>{question.prompt}</h2>
      <fieldset className="options">
        <legend>Opciones</legend>
        {question.options.map((option, index) => (
          <button className={`option${selectedOptionId === option.id ? ' is-selected' : ''}`} type="button" key={option.id}
            disabled={selectedOptionId !== null} aria-pressed={selectedOptionId === option.id}
            onClick={() => selectOption(option.id)}>
            <span className="option-letter" aria-hidden="true">{String.fromCharCode(65 + index)}</span>
            <span className="option-label">{option.label}</span>
          </button>
        ))}
      </fieldset>
      <span className="sr-only" role="status">{selectedOptionId === null ? '' : `Respuesta seleccionada: ${question.options.find((option) => option.id === selectedOptionId)?.label}`}</span>
      <p className="hint">Observá los detalles. Algunas pistas admiten más de una idea.</p>
    </section>
  )
}
