// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'
import { homes } from './game/content'

afterEach(() => {
  cleanup()
  vi.unstubAllEnvs()
})

async function answerHome(user: ReturnType<typeof userEvent.setup>, homeIndex: number, points: readonly (0 | 1 | 2)[]) {
  const startButton = screen.queryByRole('button', { name: /empezar a jugar/i })
  if (startButton) await user.click(startButton)
  const home = homes[homeIndex]
  for (let questionIndex = 0; questionIndex < 3; questionIndex += 1) {
    const option = home.questions[questionIndex].options.find((item) => item.points === points[questionIndex])!
    await user.click(screen.getByRole('button', { name: option.label }))
    if (questionIndex < 2) await screen.findByText(`Pregunta ${questionIndex + 2} de 3`)
    else await screen.findByRole('status', { name: /puntuación de la ronda/i })
  }
}

describe('partida jugable', () => {
  it('presenta el misterio antes de empezar sin revelar identidades', async () => {
    const user = userEvent.setup()
    render(<App />)

    expect(screen.getByRole('heading', { name: /20 hogares,?\s*20 misterios/i })).toBeTruthy()
    expect(screen.getByText(/60 preguntas.*120 puntos/i)).toBeTruthy()
    expect(screen.getByRole('button', { name: /empezar a jugar/i })).toBeTruthy()
    expect(screen.queryByText('Vera')).toBeNull()
    expect(screen.queryByText('Pregunta 1 de 3')).toBeNull()

    await user.click(screen.getByRole('button', { name: /empezar a jugar/i }))
    expect(screen.getByText('Hogar 1 de 20')).toBeTruthy()
    expect(screen.getByText('Pregunta 1 de 3')).toBeTruthy()
    expect(document.activeElement).toBe(screen.getByRole('heading', { name: '¿Qué suele reparar quien vive aquí?' }))
    expect(screen.getByRole('progressbar', { name: 'Progreso de hogares' }).getAttribute('aria-valuemax')).toBe('20')
    expect(screen.getByRole('progressbar', { name: 'Progreso de hogares' }).getAttribute('aria-valuenow')).toBe('1')
    expect(screen.getByRole('img', { name: 'Progreso: pregunta 1 de 3' })).toBeTruthy()
  })

  it('amplía la vivienda en un diálogo accesible y lo cierra con Escape', async () => {
    const user = userEvent.setup()
    vi.stubEnv('BASE_URL', '/WhoLivesHere/')
    render(<App />)
    await user.click(screen.getByRole('button', { name: /empezar a jugar/i }))
    const openButton = screen.getByRole('button', { name: 'Ampliar imagen de la vivienda' })

    await user.click(openButton)
    const dialog = screen.getByRole('dialog', { name: 'Vivienda ampliada' })
    expect(within(dialog).getByRole('img', { name: /rincón azul/i }).getAttribute('src')).toBe('/WhoLivesHere/homes/h01.svg')
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(document.activeElement).toBe(openButton)
  })

  it('muestra una pregunta a la vez sin puntuar antes de revelar', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /empezar a jugar/i }))
    expect(screen.getByText('Hogar 1 de 20')).toBeTruthy()
    expect(screen.getByText('Pregunta 1 de 3')).toBeTruthy()
    expect(screen.getByRole('group', { name: /opciones/i }).querySelectorAll('button')).toHaveLength(3)
    expect(screen.queryByText('Vera')).toBeNull()
    expect(screen.queryByRole('status', { name: /puntuación de la ronda/i })).toBeNull()
    await user.click(screen.getByRole('button', { name: 'Bicicletas' }))
    await screen.findByText('Pregunta 2 de 3')
    expect(screen.getByText('Pregunta 2 de 3')).toBeTruthy()
    expect(screen.getByRole('img', { name: 'Progreso: pregunta 2 de 3' })).toBeTruthy()
    expect(screen.queryByText('Vera')).toBeNull()
    expect(screen.queryByRole('status', { name: /puntuación de la ronda/i })).toBeNull()
  })

  it('mantiene en secreto el nombre del hogar hasta la revelaci\u00f3n', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /empezar a jugar/i }))

    expect(screen.queryByText('El taller azul')).toBeNull()
    expect(screen.getByRole('button', { name: 'Ampliar imagen de la vivienda' })).toBeTruthy()

    await answerHome(user, 0, [2, 2, 2])
    expect(screen.getByText('El taller azul')).toBeTruthy()
  })

  it('revela después de tres respuestas y recién entonces habilita avanzar', async () => {
    const user = userEvent.setup()
    render(<App />)
    expect(screen.queryByRole('button', { name: 'Siguiente hogar' })).toBeNull()
    await answerHome(user, 0, [2, 2, 2])
    expect(screen.getByText('Vera')).toBeTruthy()
    expect(screen.getByRole('status', { name: 'Puntuación de la ronda: 6 de 6' })).toBeTruthy()
    expect(screen.getByText(/bicicleta a medio reparar/i)).toBeTruthy()
    await user.click(screen.getByRole('button', { name: 'Siguiente hogar' }))
    expect(screen.getByText('Hogar 2 de 20')).toBeTruthy()
    expect(screen.getByText('Pregunta 1 de 3')).toBeTruthy()
  })

  it('muestra el retrato de Vera solo en la revelacion y conserva la escena SVG si falla', async () => {
    const user = userEvent.setup()
    vi.stubEnv('BASE_URL', '/WhoLivesHere/')
    render(<App />)
    await user.click(screen.getByRole('button', { name: /empezar a jugar/i }))
    const scene = screen.getByRole('img', { name: /rincón azul/i })

    expect(screen.queryByRole('img', { name: /retrato ilustrado de vera/i })).toBeNull()
    await user.click(screen.getByRole('button', { name: 'Bicicletas' }))
    await screen.findByText('Pregunta 2 de 3')
    expect(screen.queryByRole('img', { name: /retrato ilustrado de vera/i })).toBeNull()
    await user.click(screen.getByRole('button', { name: 'Recorrer murales en bicicleta' }))
    await screen.findByText('Pregunta 3 de 3')
    expect(screen.queryByRole('img', { name: /retrato ilustrado de vera/i })).toBeNull()
    await user.click(screen.getByRole('button', { name: 'Para recordar los colores de los murales visitados' }))
    await screen.findByRole('heading', { name: 'Vera' })

    const portrait = screen.getByRole('img', { name: /retrato ilustrado de vera/i })
    expect(portrait.getAttribute('src')).toBe('/WhoLivesHere/characters/vera-reveal.webp')
    const hero = screen.getByRole('region', { name: 'Perfil de Vera' })
    expect(within(hero).getByRole('heading', { name: 'Vera' })).toBeTruthy()
    expect(within(hero).getByRole('img', { name: /retrato ilustrado de vera/i })).toBe(portrait)
    expect(within(hero).getByText(/me gusta recuperar bicicletas/i)).toBeTruthy()
    fireEvent.error(portrait)
    expect(screen.queryByRole('img', { name: /retrato ilustrado de vera/i })).toBeNull()
    expect(scene.getAttribute('src')).toBe('/WhoLivesHere/homes/h01.svg')
    expect(screen.getAllByRole('img', { name: /en un rincón azul/i })).toHaveLength(2)
  })

  it('recorre los veinte hogares y termina con 120 puntos', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /empezar a jugar/i }))
    for (let index = 0; index < 20; index += 1) {
      expect(screen.getByText('Hogar ' + (index + 1) + ' de 20')).toBeTruthy()
      await answerHome(user, index, [2, 2, 2])
      expect(screen.getByRole('status', { name: 'Puntuación de la ronda: 6 de 6' })).toBeTruthy()
      await user.click(screen.getByRole('button', { name: index === 19 ? 'Ver resultado final' : 'Siguiente hogar' }))
    }
    expect(screen.getByRole('heading', { name: 'Resultado final' })).toBeTruthy()
    expect(screen.getByRole('progressbar', { name: 'Puntaje total de la partida' }).getAttribute('aria-valuenow')).toBe('120')
    expect(screen.getByRole('progressbar', { name: 'Puntaje total de la partida' }).getAttribute('aria-valuemax')).toBe('120')
    expect(screen.getByRole('heading', { name: /hogares completados/i })).toBeTruthy()
    for (const home of homes) {
      expect(screen.getByText(home.profileName)).toBeTruthy()
      expect(screen.getByText(home.title)).toBeTruthy()
    }
    await user.click(screen.getByRole('button', { name: 'Jugar otra vez' }))
    expect(screen.getByRole('button', { name: /empezar a jugar/i })).toBeTruthy()
    await user.click(screen.getByRole('button', { name: /empezar a jugar/i }))
    expect(screen.getByText('Hogar 1 de 20')).toBeTruthy()
    expect(screen.getByText('Pregunta 1 de 3')).toBeTruthy()
  }, 30000)

  it('suma una mezcla conocida de 2/1/0 sin repetir preguntas', async () => {
    const user = userEvent.setup()
    render(<App />)
    for (let index = 0; index < 20; index += 1) {
      await answerHome(user, index, [2, 1, 0])
      expect(screen.getByRole('status', { name: 'Puntuación de la ronda: 3 de 6' })).toBeTruthy()
      await user.click(screen.getByRole('button', { name: index === 19 ? 'Ver resultado final' : 'Siguiente hogar' }))
    }
    expect(screen.getByRole('progressbar', { name: 'Puntaje total de la partida' }).getAttribute('aria-valuenow')).toBe('60')
  }, 30000)

  it('empieza de cero tras montar de nuevo la aplicación', async () => {
    const user = userEvent.setup()
    const view = render(<App />)
    await user.click(screen.getByRole('button', { name: /empezar a jugar/i }))
    await user.click(screen.getByRole('button', { name: 'Bicicletas' }))
    view.unmount()
    render(<App />)
    expect(screen.getByRole('button', { name: /empezar a jugar/i })).toBeTruthy()
    await user.click(screen.getByRole('button', { name: /empezar a jugar/i }))
    expect(screen.getByText('Hogar 1 de 20')).toBeTruthy()
    expect(screen.getByText('Pregunta 1 de 3')).toBeTruthy()
  })

  it('tras avanzar sitúa el foco en el contenido nuevo y conserva la imagen', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /empezar a jugar/i }))
    const scene = screen.getByRole('img', { name: /rincón azul/i })
    expect(scene.getAttribute('alt')?.length).toBeGreaterThan(20)
    await user.click(screen.getByRole('button', { name: 'Bicicletas' }))
    await screen.findByText('Pregunta 2 de 3')
    await waitFor(() => expect(document.activeElement).toBe(screen.getByRole('heading', { name: '¿Qué plan reúne mejor las pistas?' })))
    await user.click(screen.getByRole('button', { name: 'Recorrer murales en bicicleta' }))
    await screen.findByText('Pregunta 3 de 3')
    await user.click(screen.getByRole('button', { name: 'Para recordar los colores de los murales visitados' }))
    await screen.findByRole('heading', { name: 'Vera' })
    await waitFor(() => expect(document.activeElement).toBe(screen.getByRole('heading', { name: 'Vera' })))
    expect(screen.getByRole('img', { name: /rincón azul/i })).toBe(scene)
  })

  it('un segundo clic en el botón anterior no responde la pregunta siguiente', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /empezar a jugar/i }))
    const oldButton = screen.getByRole('button', { name: 'Bicicletas' })
    await user.click(oldButton)
    expect(oldButton.hasAttribute('disabled')).toBe(true)
    await user.click(oldButton)
    await screen.findByText('Pregunta 2 de 3')
    expect(screen.getByText('Pregunta 2 de 3')).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Recorrer murales en bicicleta' })).toBeTruthy()
  })

  it('permite terminar y reiniciar con teclado', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.tab()
    expect(document.activeElement).toBe(screen.getByRole('button', { name: /empezar a jugar/i }))
    await user.keyboard('{Enter}')
    expect(document.activeElement).toBe(screen.getByRole('heading', { name: '¿Qué suele reparar quien vive aquí?' }))
    for (let homeIndex = 0; homeIndex < 20; homeIndex += 1) {
      for (let questionIndex = 0; questionIndex < 3; questionIndex += 1) {
        const firstOption = homes[homeIndex].questions[questionIndex].options[0]
        await user.tab()
        expect(document.activeElement).toBe(screen.getByRole('button', { name: firstOption.label }))
        await user.keyboard('{Enter}')
        if (questionIndex < 2) await screen.findByText(`Pregunta ${questionIndex + 2} de 3`)
        else await screen.findByRole('heading', { name: homes[homeIndex].profileName })
      }
      expect(document.activeElement).toBe(screen.getByRole('heading', { name: homes[homeIndex].profileName }))
      await user.tab()
      await user.keyboard('{Enter}')
    }
    expect(document.activeElement).toBe(screen.getByRole('heading', { name: 'Resultado final' }))
    await user.tab()
    await user.keyboard('{Enter}')
    expect(screen.getByRole('button', { name: /empezar a jugar/i })).toBeTruthy()
  }, 30000)
})
