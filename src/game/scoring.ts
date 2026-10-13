import type { AnswerMap, Home, Points } from './types'

export interface ScoreResult {
  points: Points
  explanation: string
}

export function gradeAnswer(homes: readonly Home[], questionId: string, optionId: string): ScoreResult | null {
  for (const home of homes) {
    const question = home.questions.find((item) => item.id === questionId)
    if (!question) continue
    const option = question.options.find((item) => item.id === optionId)
    return option ? { points: option.points, explanation: option.explanation } : null
  }
  return null
}

export function scoreHome(homes: readonly Home[], answers: AnswerMap, homeId: string): number {
  const home = homes.find((item) => item.id === homeId)
  if (!home) return 0
  return home.questions.reduce((total, question) => {
    const optionId = answers[question.id]
    if (!optionId) return total
    return total + (gradeAnswer(homes, question.id, optionId)?.points ?? 0)
  }, 0)
}

export function scoreGame(homes: readonly Home[], answers: AnswerMap): number {
  return homes.reduce((total, home) => total + scoreHome(homes, answers, home.id), 0)
}
