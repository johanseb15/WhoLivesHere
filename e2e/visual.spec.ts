import { expect, test, type Page } from '@playwright/test'
import { homes } from '../src/game/content'

const widths = [320, 390, 768, 1440] as const
const height = 900

test.beforeEach(async ({ page }) => {
  // Remote fonts would make the reference depend on network access and cache state.
  await page.route(/^https:\/\/fonts\.(googleapis|gstatic)\.com\//, (route) => route.abort())
})

async function assertNoClippedText(page: Page) {
  const problems = await page.evaluate(() => {
    const elements = [...document.querySelectorAll<HTMLElement>('body *')]
    return elements.flatMap((element) => {
      const ownText = [...element.childNodes].some((node) => node.nodeType === Node.TEXT_NODE && node.textContent?.trim())
      if (!ownText || element.closest('.sr-only, [aria-hidden="true"], .options legend')) return []
      const style = getComputedStyle(element)
      if (style.display === 'none' || style.visibility === 'hidden') return []
      const box = element.getBoundingClientRect()
      if (box.width === 0 || box.height === 0) return []
      const clippedX = ['hidden', 'clip'].includes(style.overflowX) && element.scrollWidth > element.clientWidth + 1
      const clippedY = ['hidden', 'clip'].includes(style.overflowY) && element.scrollHeight > element.clientHeight + 1
      if (!clippedX && !clippedY) return []
      return [`${element.tagName.toLowerCase()}.${String(element.className).replaceAll(' ', '.')} (${element.textContent.trim().slice(0, 60)})`]
    })
  })
  expect(problems, 'visible text clipped by a container').toEqual([])
}

async function assertLayout(page: Page) {
  const overflow = await page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth)
  expect(overflow, 'horizontal page overflow').toBeLessThanOrEqual(1)
  await assertNoClippedText(page)
}

async function screenshot(page: Page, name: string, width: number) {
  await page.evaluate(() => document.fonts.ready)
  await expect.poll(() => page.locator('img').evaluateAll((images) => images.every((image) => image.complete && image.naturalWidth > 0))).toBe(true)
  await assertLayout(page)
  await expect(page).toHaveScreenshot(`${name}-${width}.png`, { fullPage: true, animations: 'disabled' })
}

for (const width of widths) {
  test(`four screens at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height })
    await page.goto('/')
    await page.evaluate(() => document.fonts.ready)
    await expect(page.getByRole('heading', { name: /20 hogares,?\s*20 misterios/i })).toBeVisible()
    await screenshot(page, 'home', width)

    await page.getByRole('button', { name: /empezar a jugar/i }).click()
    await expect(page.getByText('Hogar 1 de 20')).toBeVisible()
    await expect(page.getByRole('img', { name: 'Progreso: pregunta 1 de 3' })).toBeVisible()
    await screenshot(page, 'game', width)

    for (let question = 0; question < 3; question += 1) {
      await assertLayout(page)
      const option = homes[0].questions[question].options.find((item) => item.points === 2)!
      const button = page.getByRole('button', { name: option.label, exact: true })
      await button.click()
      await expect(button).toHaveAttribute('aria-pressed', 'true')
      await expect(button).toBeDisabled()
      if (question < 2) {
        await expect(page.getByText(`Pregunta ${question + 2} de 3`)).toBeVisible()
        await expect(page.getByRole('img', { name: `Progreso: pregunta ${question + 2} de 3` })).toBeVisible()
      }
    }

    await expect(page.getByRole('heading', { name: homes[0].profileName })).toBeVisible()
    await expect(page.getByRole('status', { name: 'Puntuación de la ronda: 6 de 6' })).toBeVisible()
    await screenshot(page, 'reveal', width)

    for (let homeIndex = 1; homeIndex < homes.length; homeIndex += 1) {
      await page.getByRole('button', { name: 'Siguiente hogar' }).click()
      await expect(page.getByText(`Hogar ${homeIndex + 1} de 20`)).toBeVisible()
      await expect(page.getByRole('progressbar', { name: 'Progreso de hogares' })).toHaveAttribute('aria-valuenow', String(homeIndex + 1))
      await expect.poll(() => page.locator('.scene > img').evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true)
      for (let question = 0; question < 3; question += 1) {
        await assertLayout(page)
        const option = homes[homeIndex].questions[question].options.find((item) => item.points === 2)!
        await page.getByRole('button', { name: option.label, exact: true }).click()
        if (question < 2) await expect(page.getByText(`Pregunta ${question + 2} de 3`)).toBeVisible()
      }
      await expect(page.getByRole('heading', { name: homes[homeIndex].profileName })).toBeVisible()
      await expect(page.getByRole('status', { name: 'Puntuación de la ronda: 6 de 6' })).toBeVisible()
      await assertLayout(page)
    }

    await page.getByRole('button', { name: 'Ver resultado final' }).click()
    await expect(page.getByRole('heading', { name: 'Resultado final' })).toBeVisible()
    await expect(page.getByRole('progressbar', { name: 'Puntaje total de la partida' })).toHaveAttribute('aria-valuenow', '120')
    await expect(page.locator('.completed-home')).toHaveCount(20)
    await screenshot(page, 'result', width)

    await page.getByRole('button', { name: 'Jugar otra vez' }).click()
    await expect(page.getByRole('button', { name: /empezar a jugar/i })).toBeVisible()
  })
}
