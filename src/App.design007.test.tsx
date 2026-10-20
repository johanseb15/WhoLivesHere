// @vitest-environment jsdom
import { afterEach, expect, it } from 'vitest'
import { cleanup, fireEvent, render } from '@testing-library/react'
import App from './App'

afterEach(cleanup)

it('Design 007 keeps answers keyboard-first and enables compact reveal review', () => {
  render(<App />)
  expect(document.querySelectorAll('.option')).toHaveLength(3)
  expect(document.querySelectorAll('.question-panel button')).toHaveLength(3)
  expect(document.querySelector('.options-scroll-hint')).not.toBeNull()
  expect(document.querySelector('.reveal-scene-toggle')).toBeNull()
  expect(document.querySelector('.character-reveal')).toBeNull()

  for (let q = 0; q < 3; q += 1) {
    const option = document.querySelector<HTMLButtonElement>('.option')
    expect(option).not.toBeNull()
    fireEvent.click(option!)
  }
  expect(document.querySelector('.character-reveal')).not.toBeNull()
  const toggle = document.querySelector<HTMLButtonElement>('.reveal-scene-toggle')
  expect(toggle).not.toBeNull()
  expect(toggle?.getAttribute('aria-expanded')).toBe('false')
  expect(document.querySelectorAll('.scene img')).toHaveLength(1)
  fireEvent.click(toggle!)
  expect(toggle?.getAttribute('aria-expanded')).toBe('true')
  expect(document.querySelector('.primary-scene.scene-expanded .scene img')).not.toBeNull()

  const score = document.querySelector('.score-card')
  const action = document.querySelector<HTMLButtonElement>('.primary-button')
  const review = document.querySelector('.answer-review')
  expect(score && action && review).toBeTruthy()
  expect(Boolean(score!.compareDocumentPosition(action!) & Node.DOCUMENT_POSITION_FOLLOWING)).toBe(true)
  expect(Boolean(action!.compareDocumentPosition(review!) & Node.DOCUMENT_POSITION_FOLLOWING)).toBe(true)
  fireEvent.click(action!)
  expect(document.querySelector('.reveal-scene-toggle')).toBeNull()
  expect(document.querySelectorAll('.option')).toHaveLength(3)
})
