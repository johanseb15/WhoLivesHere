// @vitest-environment jsdom
import { afterEach, expect, it } from 'vitest'
import { cleanup, fireEvent, render } from '@testing-library/react'
import App from './App'

afterEach(cleanup)

function selectOption() {
  const option = document.querySelector<HTMLButtonElement>('.option')
  expect(option).not.toBeNull()
  fireEvent.click(option!)
}

function reachHome(previousHomes: number) {
  for (let i = 0; i < previousHomes; i++) {
    for (let q = 0; q < 3; q++) selectOption()
    const next = document.querySelector<HTMLButtonElement>('.primary-button')
    expect(next).not.toBeNull()
    fireEvent.click(next!)
  }
}

function verifyHome(previousHomes: number, image: string, characterImage: string) {
  render(<App />)
  reachHome(previousHomes)
  const scene = document.querySelector('.scene img')
  expect(scene?.getAttribute('src')).toContain(image)
  const character = () => document.querySelector(`img[src$="${characterImage}"]`)
  expect(character()).toBeNull()
  for (let q = 0; q < 3; q++) {
    selectOption()
    if (q < 2) expect(character()).toBeNull()
  }
  expect(character()).not.toBeNull()
}

it('H03 home is shown while character remains concealed until reveal', () => {
  verifyHome(2, '/assets/h03/home.jpg', '/assets/h03/character-reveal.png')
})

it('H04 home is shown while character remains concealed until reveal', () => {
  verifyHome(3, '/assets/h04/home.jpg', '/assets/h04/character-reveal.jpg')
})
