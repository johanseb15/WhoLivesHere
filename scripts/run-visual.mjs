import { spawn } from 'node:child_process'
import { setTimeout as delay } from 'node:timers/promises'

const url = 'http://127.0.0.1:5173/'
try {
  await fetch(url, { signal: AbortSignal.timeout(500) })
  throw new Error('Port 5173 is already serving a site; stop it before visual QA')
} catch (error) {
  if (error.message?.includes('already serving')) throw error
}

const server = spawn(process.execPath, [
  'node_modules/vite/bin/vite.js', '--host', '127.0.0.1', '--port', '5173', '--strictPort',
], { stdio: 'inherit', windowsHide: true })

let runner
const stop = () => {
  runner?.kill()
  server.kill()
}
process.once('SIGINT', stop)
process.once('SIGTERM', stop)

try {
  let ready = false
  for (let attempt = 0; attempt < 100; attempt += 1) {
    if (server.exitCode !== null) throw new Error(`Vite exited with code ${server.exitCode}`)
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(1000) })
      if (response.ok) { ready = true; break }
    } catch { /* Vite is still starting. */ }
    await delay(100)
  }
  if (!ready) throw new Error('Vite did not become ready within 10 seconds')

  runner = spawn(process.execPath, [
    'node_modules/@playwright/test/cli.js', 'test', ...process.argv.slice(2),
  ], { stdio: 'inherit', windowsHide: true })
  const code = await new Promise((resolve, reject) => {
    runner.once('error', reject)
    runner.once('exit', (exitCode) => resolve(exitCode ?? 1))
  })
  process.exitCode = code
} catch (error) {
  console.error(error)
  process.exitCode = 1
} finally {
  stop()
}
