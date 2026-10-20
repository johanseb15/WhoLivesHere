import { describe, expect, it } from 'vitest'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { homes } from './content'

const expectedAnswers = [
  ['H01-Q1', 'Bicicletas', 'Muebles'],
  ['H01-Q2', 'Recorrer murales en bicicleta', 'Pasear en bicicleta por el barrio'],
  ['H01-Q3', 'Para recordar los colores de los murales visitados', 'Para elegir pintura para su casa'],
  ['H02-Q1', 'Hierbas aromáticas', 'Flores'],
  ['H02-Q2', 'Para preparar infusiones', 'Para usarlas como condimento'],
  ['H02-Q3', 'Intercambia semillas', 'Regala mezclas de té'],
  ['H03-Q1', 'Una función de teatro de sombras', 'Adornos para una habitación'],
  ['H03-Q2', 'Una aventura bajo el mar', 'Un viaje por un río'],
  ['H03-Q3', 'Para invitar a una función en el patio', 'Para invitar a una función dentro de casa'],
  ['H04-Q1', 'Sonidos de distintos lugares', 'Melodías que compone'],
  ['H04-Q2', 'Dibuja lo que le sugieren esos sonidos', 'Escribe notas sobre el paseo'],
  ['H04-Q3', 'Para enviar postales inspiradas en sonidos', 'Para archivar notas de sus paseos'],
  ['H05-Q1', 'Tela de paraguas', 'Bolsas de tela'],
  ['H05-Q2', 'Probar cometas', 'Secar telas al aire'],
  ['H05-Q3', 'Para comparar cómo vuela cada diseño', 'Para ordenar sus diseños favoritos'],
] as const

describe('contenido aprobado', () => {
  it('contiene veinte hogares con tres preguntas y tres opciones cada uno', () => {
    expect(homes.map((home) => home.id)).toEqual(Array.from({ length: 20 }, (_, index) => `H${String(index + 1).padStart(2, '0')}`))
    expect(homes.flatMap((home) => home.questions)).toHaveLength(60)
    expect(homes.flatMap((home) => home.questions.flatMap((question) => question.options))).toHaveLength(180)
  })

  it('mantiene los tipos, identificadores y la distribución 2/1/0', () => {
    const optionIds = new Set<string>()
    for (const home of homes) {
      expect(home.questions.map((question) => question.kind)).toEqual(['concreta', 'interpretativa', 'sorpresa'])
      expect(home.imageSrc).toBe(`/homes/${home.id.toLowerCase()}.svg`)
      expect(home.imageAlt.trim().length).toBeGreaterThan(20)
      expect(home.imageAlt.toLowerCase()).not.toContain(home.profileName.toLowerCase())
      for (const question of home.questions) {
        expect(question.options.map((option) => option.points).sort()).toEqual([0, 1, 2])
        expect(question.prompt.trim()).not.toBe('')
        for (const option of question.options) {
          expect(optionIds.has(option.id)).toBe(false)
          optionIds.add(option.id)
          expect(option.label.trim()).not.toBe('')
          expect(option.explanation.trim()).not.toBe('')
        }
      }
    }
    expect(optionIds.size).toBe(180)
  })

  it.each(expectedAnswers)('%s conserva la respuesta exacta y la alternativa plausible', (questionId, exact, plausible) => {
    const question = homes.flatMap((home) => home.questions).find((item) => item.id === questionId)
    expect(question?.options.find((option) => option.points === 2)?.label).toBe(exact)
    expect(question?.options.find((option) => option.points === 1)?.label).toBe(plausible)
  })

  it('reparte las respuestas exactas entre las tres posiciones de toda la partida', () => {
    const positions = homes.flatMap((home) => home.questions.map((question) =>
      question.options.findIndex((option) => option.points === 2)))
    expect(positions.filter((position) => position === 0)).toHaveLength(20)
    expect(positions.filter((position) => position === 1)).toHaveLength(20)
    expect(positions.filter((position) => position === 2)).toHaveLength(20)
  })

  it('sirve veinte ilustraciones SVG locales sin recursos remotos', () => {
    for (const home of homes) {
      const file = resolve('public', home.imageSrc.slice(1))
      expect(existsSync(file), home.id + ' necesita ilustración').toBe(true)
      const svg = readFileSync(file, 'utf8')
      expect(svg).toContain('<svg')
      expect(svg.length).toBeGreaterThan(1000)
      expect(svg).not.toMatch(/(?:href|src)=["'](?:https?:)?\/\//i)
    }
  })

  it('describe la pista de las notas dentro de un sobre sin revelar la respuesta', () => {
    const home = homes.find((item) => item.id === 'H04')
    expect(home?.imageAlt).toMatch(/sobre.*hojas de notas/i)
    expect(home?.imageAlt).not.toMatch(/archivar|postales inspiradas en sonidos/i)
  })
})
