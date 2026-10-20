// @vitest-environment jsdom
import { it, expect } from 'vitest'
import { fireEvent, render } from '@testing-library/react'
import App from './App'

it('H02 shows home first and character only after reveal', () => {
  render(<App />)

  const scene = () => document.querySelector('.scene img')
  const h02Character = () => document.querySelector('img[src$="/assets/h02/character-reveal.jpg"]')

  for (let i = 0; i < 3; i++) {
    const choice = document.querySelectorAll('.option')[0]
    expect(choice).not.toBeNull()
    fireEvent.click(choice!)
  }

  const nextFromH01 = document.querySelector('.primary-button')
  expect(nextFromH01).not.toBeNull()
  fireEvent.click(nextFromH01!)

  expect(scene()?.getAttribute('src')).toContain('/assets/h02/home.jpg')
  expect(h02Character()).toBeNull()

  for (let i = 0; i < 3; i++) {
    const choice = document.querySelectorAll('.option')[0]
    expect(choice).not.toBeNull()
    fireEvent.click(choice!)
    if (i < 2) expect(h02Character()).toBeNull()
  }

  expect(h02Character()).not.toBeNull()
})
