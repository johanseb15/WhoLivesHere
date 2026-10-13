// @vitest-environment jsdom
import { afterEach, expect, it, vi } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import Scene from './Scene'

afterEach(() => {
  cleanup()
  vi.unstubAllEnvs()
})

it('sirve una escena local bajo la ruta de GitHub Pages', () => {
  vi.stubEnv('BASE_URL', '/WhoLivesHere/')
  render(<Scene src="/homes/h01.svg" alt="Taller ilustrado" title="Taller" />)
  expect(screen.getByRole('img').getAttribute('src')).toBe('/WhoLivesHere/homes/h01.svg')
})
