import { expect, test } from '@playwright/test'
import { homes } from '../src/game/content'

test('la partida de 20 hogares conserva lectura y progreso a 320 px', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 900 })
  await page.route(/^https:\/\/fonts\.(googleapis|gstatic)\.com\//, (route) => route.abort())
  await page.goto('/')
  await page.evaluate(() => document.fonts.ready)
  await expect.poll(() => page.locator('img').evaluateAll((images) => images.every((image) => image.complete && image.naturalWidth > 0))).toBe(true)
  await expect(page.getByRole('heading', { name: /20 hogares,?\s*20 misterios/i })).toBeVisible()
  await page.getByRole('button', { name: 'Empezar a jugar' }).click()

  for (let homeIndex = 0; homeIndex < homes.length; homeIndex += 1) {
    const progress = page.getByRole('progressbar', { name: 'Progreso de hogares' })
    await expect(progress).toHaveAttribute('aria-valuenow', String(homeIndex + 1))
    await expect(progress).toHaveAttribute('aria-valuemax', '20')
    await expect(progress.locator('span')).toHaveCount(1)
    expect(await page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth)).toBeLessThanOrEqual(1)
    for (const question of homes[homeIndex].questions) {
      const exact = question.options.find((option) => option.points === 2)!
      await page.getByRole('button', { name: exact.label, exact: true }).click()
      await expect(page.getByRole('heading', { name: question.prompt })).toHaveCount(0)
    }
    await expect(page.getByRole('heading', { name: homes[homeIndex].profileName })).toBeVisible()
    if (homeIndex === 5) {
      const hero = page.getByRole('region', { name: 'Perfil de Alma' })
      const image = hero.getByRole('img', { name: homes[5].imageAlt })
      await expect(image).toBeVisible()
      const emptyHeight = await hero.locator('.reveal-stage').evaluate((stage) => {
        const img = stage.querySelector('img')!
        const box = img.getBoundingClientRect()
        const paintedHeight = Math.min(box.height, box.width * img.naturalHeight / img.naturalWidth)
        return stage.getBoundingClientRect().height - paintedHeight
      })
      expect(emptyHeight, 'espacio vacío alrededor de la escena en revelación').toBeLessThan(30)
    }
    expect(await page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth)).toBeLessThanOrEqual(1)
    await page.getByRole('button', { name: homeIndex === 19 ? 'Ver resultado final' : 'Siguiente hogar' }).click()
  }

  const result = page.getByRole('progressbar', { name: 'Puntaje total de la partida' })
  await expect(result).toHaveAttribute('aria-valuenow', '120')
  await expect(result).toHaveAttribute('aria-valuemax', '120')
  await expect(page.locator('.completed-home')).toHaveCount(20)
  expect(await page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth)).toBeLessThanOrEqual(1)
})
