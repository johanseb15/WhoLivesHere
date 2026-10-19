// @vitest-environment jsdom
import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, expect, it, vi } from 'vitest'
import { homes } from '../game/content'
import QuestionView from './QuestionView'

afterEach(() => vi.useRealTimers())

it('muestra la selección antes de avanzar y acepta una sola respuesta', () => {
  vi.useFakeTimers()
  const onAnswer = vi.fn()
  render(<QuestionView question={homes[0].questions[0]} questionNumber={1} onAnswer={onAnswer} />)

  const selected = screen.getByRole('button', { name: 'Bicicletas' })
  const other = screen.getByRole('button', { name: 'Muebles' })
  fireEvent.click(selected)

  expect(selected.classList.contains('is-selected')).toBe(true)
  expect(selected.getAttribute('aria-pressed')).toBe('true')
  expect(screen.getByRole('status').textContent).toContain('Bicicletas')
  expect(selected.hasAttribute('disabled')).toBe(true)
  expect(other.hasAttribute('disabled')).toBe(true)
  fireEvent.click(other)
  expect(onAnswer).not.toHaveBeenCalled()

  act(() => vi.advanceTimersByTime(219))
  expect(onAnswer).not.toHaveBeenCalled()
  act(() => vi.advanceTimersByTime(1))
  expect(onAnswer).toHaveBeenCalledExactlyOnceWith(homes[0].questions[0].options[0].id)
})
