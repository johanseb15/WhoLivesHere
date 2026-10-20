import { describe, expect, it } from 'vitest'
import { homes } from './content'
import { createInitialState, transition } from './machine'
import type { GameState } from './types'

function answer(state: GameState, optionId: string): GameState {
  return transition(state, { type: 'RESPONDER', optionId }, homes)
}

function finishHome(state: GameState): GameState {
  for (let index = state.questionIndex; index < 3; index += 1) {
    state = answer(state, homes[state.homeIndex].questions[index].options[0].id)
  }
  return state
}

describe('máquina de juego', () => {
  it('inicia en H01-Q1 sin respuestas', () => {
    expect(createInitialState()).toEqual({
      phase: 'pregunta', homeIndex: 0, questionIndex: 0, answers: {},
    })
  })

  it('registra una respuesta y avanza una sola pregunta', () => {
    const next = answer(createInitialState(), 'H01-Q1-bicicletas')
    expect(next.phase).toBe('pregunta')
    expect(next.questionIndex).toBe(1)
    expect(next.answers).toEqual({ 'H01-Q1': 'H01-Q1-bicicletas' })
    expect(next).not.toHaveProperty('score')
  })

  it('revela solo después de la tercera respuesta y entonces permite el siguiente hogar', () => {
    const revealed = finishHome(createInitialState())
    expect(revealed.phase).toBe('revelacion')
    expect(Object.keys(revealed.answers)).toHaveLength(3)
    const next = transition(revealed, { type: 'SIGUIENTE' }, homes)
    expect(next).toMatchObject({ phase: 'pregunta', homeIndex: 1, questionIndex: 0 })
  })

  it('completa veinte hogares, muestra resultado y reinicia', () => {
    let state = createInitialState()
    for (let homeIndex = 0; homeIndex < homes.length; homeIndex += 1) {
      state = finishHome(state)
      expect(state).toMatchObject({ phase: 'revelacion', homeIndex })
      if (homeIndex < homes.length - 1) state = transition(state, { type: 'SIGUIENTE' }, homes)
    }
    expect(Object.keys(state.answers)).toHaveLength(60)
    expect(transition(state, { type: 'SIGUIENTE' }, homes)).toBe(state)
    state = transition(state, { type: 'VER_RESULTADO' }, homes)
    expect(state.phase).toBe('resultado')
    expect(transition(state, { type: 'NUEVA_PARTIDA' }, homes)).toEqual(createInitialState())
  })

  it('ignora el doble clic tardío y opciones de otra pregunta u hogar', () => {
    const current = answer(createInitialState(), 'H01-Q1-bicicletas')
    expect(answer(current, 'H01-Q1-bicicletas')).toBe(current)
    expect(answer(current, 'H02-Q1-hierbas')).toBe(current)
    expect(answer(current, 'desconocida')).toBe(current)
    expect(Object.keys(current.answers)).toHaveLength(1)
  })

  it('ignora eventos fuera de fase', () => {
    const start = createInitialState()
    expect(transition(start, { type: 'SIGUIENTE' }, homes)).toBe(start)
    expect(transition(start, { type: 'VER_RESULTADO' }, homes)).toBe(start)
    expect(transition(start, { type: 'NUEVA_PARTIDA' }, homes)).toBe(start)
    const revealed = finishHome(start)
    expect(answer(revealed, 'H02-Q1-hierbas')).toBe(revealed)
  })
})
