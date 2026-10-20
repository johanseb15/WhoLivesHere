// @vitest-environment jsdom
import { it, expect } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import App from './App'

it('H01 shows home first and character only after reveal', async () => {
  render(<App />)

  const scene = document.querySelector('.scene img')
  expect(scene?.getAttribute('src')).toContain('/assets/h01/home.jpg')

  const character = () =>
    document.querySelector('img[src$="/assets/h01/character-reveal.png"]')

  expect(character()).toBeNull()

  for (let i = 0; i < 3; i++) {
    const choice = screen.getAllByRole('button')[0]
    expect(choice).not.toBeNull()
    fireEvent.click(choice!)
    if (i < 2) expect(character()).toBeNull()
  }

  expect(character()).not.toBeNull()
})
