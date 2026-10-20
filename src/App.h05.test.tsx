// @vitest-environment jsdom
import { afterEach, expect, it } from 'vitest'
import { cleanup, fireEvent, render } from '@testing-library/react'
import App from './App'

afterEach(cleanup)

it('H05 hides character until all three questions are answered', () => {
  render(<App />)
  const character = () => document.querySelector('img[src$="/assets/h05/character-reveal.png"]')
  const answer = () => {
    const option = document.querySelector<HTMLButtonElement>('.option')
    expect(option).not.toBeNull()
    fireEvent.click(option!)
  }
  for (let home = 0; home < 4; home++) {
    expect(character()).toBeNull()
    for (let q = 0; q < 3; q++) answer()
    expect(character()).toBeNull()
    const next = document.querySelector<HTMLButtonElement>('.primary-button')
    expect(next).not.toBeNull()
    fireEvent.click(next!)
  }
  const scene = document.querySelector('.scene img')
  expect(scene?.getAttribute('src')).toContain('/assets/h05/home.jpg')
  expect(character()).toBeNull()
  for (let q = 0; q < 3; q++) {
    answer()
    if (q < 2) expect(character()).toBeNull()
  }
  expect(character()).not.toBeNull()
})
