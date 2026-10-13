import type { GameAction, GameState, Home } from './types'

export function createInitialState(): GameState {
  return { phase: 'pregunta', homeIndex: 0, questionIndex: 0, answers: {} }
}

export function transition(state: GameState, action: GameAction, homes: readonly Home[]): GameState {
  if (action.type === 'NUEVA_PARTIDA') {
    return state.phase === 'resultado' ? createInitialState() : state
  }

  if (action.type === 'SIGUIENTE') {
    if (state.phase !== 'revelacion' || state.homeIndex >= homes.length - 1) return state
    return { ...state, phase: 'pregunta', homeIndex: state.homeIndex + 1, questionIndex: 0 }
  }

  if (action.type === 'VER_RESULTADO') {
    if (state.phase !== 'revelacion' || state.homeIndex !== homes.length - 1) return state
    return { ...state, phase: 'resultado' }
  }

  if (state.phase !== 'pregunta') return state
  const question = homes[state.homeIndex]?.questions[state.questionIndex]
  if (!question || state.answers[question.id]) return state
  if (!question.options.some((option) => option.id === action.optionId)) return state

  const answers = { ...state.answers, [question.id]: action.optionId }
  return state.questionIndex === 2
    ? { ...state, answers, phase: 'revelacion' }
    : { ...state, answers, questionIndex: state.questionIndex + 1 }
}
