import { configDefaults, defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/WhoLivesHere/' : '/',
  plugins: [react()],
  test: { exclude: [...configDefaults.exclude, 'e2e/**'] },
}))
