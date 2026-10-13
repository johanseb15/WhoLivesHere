// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'
import { homes } from './game/content'

afterEach(cleanup)

async function answerHome(user: ReturnType<typeof userEvent.setup>, homeIndex: number, points: readonly (0 | 1 | 2)[]) {
  const home = homes[homeIndex]
  for (let questionIndex = 0; questionIndex < 3; questionIndex += 1) {
    const option = home.questions[questionIndex].options.find((item) => item.points === points[questionIndex])!
    await user.click(screen.getByRole('button', { name: option.label }))
  }
}

describe('partida jugable', () => {
  it('muestra una pregunta a la vez sin puntuar antes de revelar', async () => {
    const user = userEvent.setup()
    render(<App />)
    expect(screen.getByText('Hogar 1 de 5')).toBeTruthy()
    expect(screen.getByText('Pregunta 1 de 3')).toBeTruthy()
    expect(screen.getByRole('group', { name: /opciones/i }).querySelectorAll('button')).toHaveLength(3)
    expect(screen.queryByText('Vera')).toBeNull()
    expect(screen.queryByText('6 / 6')).toBeNull()
    await user.click(screen.getByRole('button', { name: 'Bicicletas' }))
    expect(screen.getByText('Pregunta 2 de 3')).toBeTruthy()
    expect(screen.queryByText('Vera')).toBeNull()
    expect(screen.queryByText('6 / 6')).toBeNull()
  })

  it('revela después de tres respuestas y recién entonces habilita avanzar', async () => {
    const user = userEvent.setup()
    render(<App />)
    expect(screen.queryByRole('button', { name: 'Siguiente hogar' })).toBeNull()
    await answerHome(user, 0, [2, 2, 2])
    expect(screen.getByText('Vera')).toBeTruthy()
    expect(screen.getByText('6 / 6')).toBeTruthy()
    expect(screen.getByText(/bicicleta a medio reparar/i)).toBeTruthy()
    await user.click(screen.getByRole('button', { name: 'Siguiente hogar' }))
    expect(screen.getByText('Hogar 2 de 5')).toBeTruthy()
    expect(screen.getByText('Pregunta 1 de 3')).toBeTruthy()
  })

  it('recorre los cinco hogares y termina con 30 puntos', async () => {
    const user = userEvent.setup()
    render(<App />)
    for (let index = 0; index < 5; index += 1) {
      expect(screen.getByText('Hogar ' + (index + 1) + ' de 5')).toBeTruthy()
      await answerHome(user, index, [2, 2, 2])
      expect(screen.getByText('6 / 6')).toBeTruthy()
      await user.click(screen.getByRole('button', { name: index === 4 ? 'Ver resultado final' : 'Siguiente hogar' }))
    }
    expect(screen.getByRole('heading', { name: 'Resultado final' })).toBeTruthy()
    expect(screen.getByText('30 / 30')).toBeTruthy()
    await user.click(screen.getByRole('button', { name: 'Nueva partida' }))
    expect(screen.getByText('Hogar 1 de 5')).toBeTruthy()
    expect(screen.getByText('Pregunta 1 de 3')).toBeTruthy()
  })

  it('suma una mezcla conocida de 2/1/0 sin repetir preguntas', async () => {
    const user = userEvent.setup()
    render(<App />)
    for (let index = 0; index < 5; index += 1) {
      await answerHome(user, index, [2, 1, 0])
      expect(screen.getByText('3 / 6')).toBeTruthy()
      await user.click(screen.getByRole('button', { name: index === 4 ? 'Ver resultado final' : 'Siguiente hogar' }))
    }
    expect(screen.getByText('15 / 30')).toBeTruthy()
  })

  it('empieza de cero tras montar de nuevo la aplicación', async () => {
    const user = userEvent.setup()
    const view = render(<App />)
    await user.click(screen.getByRole('button', { name: 'Bicicletas' }))
    view.unmount()
    render(<App />)
    expect(screen.getByText('Hogar 1 de 5')).toBeTruthy()
    expect(screen.getByText('Pregunta 1 de 3')).toBeTruthy()
  })

  it('tras avanzar sitúa el foco en el contenido nuevo y conserva la imagen', async () => {
    const user = userEvent.setup()
    render(<App />)
    const scene = screen.getByRole('img')
    expect(scene.getAttribute('alt')?.length).toBeGreaterThan(20)
    await user.click(screen.getByRole('button', { name: 'Bicicletas' }))
    expect(document.activeElement).toBe(screen.getByRole('heading', { name: '¿Qué plan reúne mejor las pistas?' }))
    await user.click(screen.getByRole('button', { name: 'Recorrer murales en bicicleta' }))
    await user.click(screen.getByRole('button', { name: 'Para recordar los colores de los murales visitados' }))
    expect(document.activeElement).toBe(screen.getByRole('heading', { name: 'Vera' }))
    expect(screen.getByRole('img')).toBe(scene)
  })

  it('un segundo clic en el botón anterior no responde la pregunta siguiente', async () => {
    const user = userEvent.setup()
    render(<App />)
    const oldButton = screen.getByRole('button', { name: 'Bicicletas' })
    await user.click(oldButton)
    expect(oldButton.hasAttribute('disabled')).toBe(true)
    await user.click(oldButton)
    expect(screen.getByText('Pregunta 2 de 3')).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Recorrer murales en bicicleta' })).toBeTruthy()
  })

  it('permite terminar y reiniciar con teclado', async () => {
    const user = userEvent.setup()
    render(<App />)
    for (let homeIndex = 0; homeIndex < 5; homeIndex += 1) {
      for (let questionIndex = 0; questionIndex < 3; questionIndex += 1) {
        const firstOption = homes[homeIndex].questions[questionIndex].options[0]
        await user.tab()
        expect(document.activeElement).toBe(screen.getByRole('button', { name: firstOption.label }))
        await user.keyboard('{Enter}')
      }
      expect(document.activeElement).toBe(screen.getByRole('heading', { name: homes[homeIndex].profileName }))
      await user.tab()
      await user.keyboard('{Enter}')
    }
    expect(document.activeElement).toBe(screen.getByRole('heading', { name: 'Resultado final' }))
    await user.tab()
    await user.keyboard('{Enter}')
    expect(document.activeElement).toBe(screen.getByRole('heading', { name: '¿Qué suele reparar quien vive aquí?' }))
  })
})
