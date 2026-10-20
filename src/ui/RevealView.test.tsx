// @vitest-environment jsdom
import { afterEach, expect, it } from 'vitest'
import { cleanup, render, screen, within } from '@testing-library/react'
import { homes } from '../game/content'
import RevealView from './RevealView'

afterEach(cleanup)

it('muestra la escena SVG en la revelación cuando el retrato sigue pendiente', () => {
  const home = homes[5]
  render(<RevealView home={home} homes={homes} answers={{}} isLast={false} onNext={() => {}} />)
  const hero = screen.getByRole('region', { name: `Perfil de ${home.profileName}` })
  const image = within(hero).getByRole('img', { name: home.imageAlt })
  expect(image.getAttribute('src')).toBe('/homes/h06.svg')
  expect(within(hero).getByRole('heading', { name: home.profileName })).toBeTruthy()
})
