import { describe, expect, it } from 'vitest'
import { homes } from './content'
import { gradeAnswer, scoreGame, scoreHome } from './scoring'

describe('motor de puntuación', () => {
  it('califica 2/1/0 según la opción estable y devuelve la explicación', () => {
    expect(gradeAnswer(homes, 'H01-Q1', 'H01-Q1-bicicletas')).toMatchObject({ points: 2 })
    expect(gradeAnswer(homes, 'H01-Q1', 'H01-Q1-muebles')).toMatchObject({ points: 1 })
    expect(gradeAnswer(homes, 'H01-Q1', 'H01-Q1-lamparas')).toMatchObject({ points: 0 })
    expect(gradeAnswer(homes, 'H05-Q3', 'H05-Q3-comparar')).toMatchObject({ points: 2 })
    expect(gradeAnswer(homes, 'H01-Q1', 'H01-Q1-muebles')?.explanation).toContain('banquito')
  })

  it('rechaza preguntas y opciones desconocidas o ajenas', () => {
    expect(gradeAnswer(homes, 'inexistente', 'H01-Q1-bicicletas')).toBeNull()
    expect(gradeAnswer(homes, 'H01-Q1', 'inexistente')).toBeNull()
    expect(gradeAnswer(homes, 'H01-Q1', 'H02-Q1-hierbas')).toBeNull()
  })

  it('suma solo respuestas válidas del hogar indicado', () => {
    const answers = {
      'H01-Q1': 'H01-Q1-bicicletas',
      'H01-Q2': 'H01-Q2-paseo',
      'H01-Q3': 'H01-Q3-piezas',
      'H02-Q1': 'H02-Q1-hierbas',
    }
    expect(scoreHome(homes, answers, 'H01')).toBe(3)
    expect(scoreHome(homes, answers, 'desconocido')).toBe(0)
  })

  it('alcanza 30 con quince respuestas exactas y 0 con quince incorrectas', () => {
    const exact = Object.fromEntries(homes.flatMap((home) =>
      home.questions.map((question) => [question.id, question.options.find((option) => option.points === 2)!.id])))
    const wrong = Object.fromEntries(homes.flatMap((home) =>
      home.questions.map((question) => [question.id, question.options.find((option) => option.points === 0)!.id])))
    expect(scoreGame(homes, exact)).toBe(30)
    expect(scoreGame(homes, wrong)).toBe(0)
  })

  it('no suma entradas manipuladas o de otra pregunta', () => {
    const answers = {
      'H01-Q1': 'H02-Q1-hierbas',
      'H01-Q2': 'H01-Q2-murales',
      inventada: 'H01-Q1-bicicletas',
    }
    expect(scoreHome(homes, answers, 'H01')).toBe(2)
    expect(scoreGame(homes, answers)).toBe(2)
  })

  it('mantiene puntos y explicaciones si cambia el orden visual', () => {
    const reordered = homes.map((home) => ({
      ...home,
      questions: home.questions.map((question) => ({
        ...question,
        options: [...question.options].reverse(),
      })),
    }))
    expect(gradeAnswer(reordered, 'H02-Q3', 'H02-Q3-te')).toEqual(
      gradeAnswer(homes, 'H02-Q3', 'H02-Q3-te'),
    )
  })
})
