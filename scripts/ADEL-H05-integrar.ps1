$ErrorActionPreference = 'Stop'
if (-not (Test-Path '.\src\App.tsx') -or -not (Test-Path '.\package.json')) {
    throw 'BLOCKED: ejecutar desde la carpeta raiz de WhoLivesHere.'
}

@'
from pathlib import Path
import json
import shutil
import subprocess
import sys
import tempfile

root = Path.cwd()
app_path = root / 'src' / 'App.tsx'
test_path = root / 'src' / 'App.h05.test.tsx'

for relative, signature in [
    ('public/assets/h05/home.jpg', b'\xff\xd8\xff'),
    ('public/assets/h05/character-reveal.png', b'\x89PNG\r\n\x1a\n')
]:
    path = root / relative
    if not path.is_file() or path.stat().st_size < 10000:
        sys.exit('BLOCKED_ASSET: ' + relative)
    if path.read_bytes()[:len(signature)] != signature:
        sys.exit('BLOCKED_FORMAT: ' + relative)
print('H05_ASSETS: VERIFIED')

# Exact source from the validated ADEL H03+H04 integration.
old_scene = '<Scene src={state.homeIndex === 0 ? "/assets/h01/home.png" : state.homeIndex === 1 ? "/assets/h02/home.jpg" : state.homeIndex === 2 ? "/assets/h03/home.jpg" : state.homeIndex === 3 ? "/assets/h04/home.jpg" : home.imageSrc} alt={home.imageAlt} title={home.title} />'
new_scene = '<Scene src={state.homeIndex === 0 ? "/assets/h01/home.png" : state.homeIndex === 1 ? "/assets/h02/home.jpg" : state.homeIndex === 2 ? "/assets/h03/home.jpg" : state.homeIndex === 3 ? "/assets/h04/home.jpg" : state.homeIndex === 4 ? "/assets/h05/home.jpg" : home.imageSrc} alt={home.imageAlt} title={home.title} />'
old_reveal = '<RevealView characterSrc={state.homeIndex === 0 ? "/assets/h01/character-reveal.png" : state.homeIndex === 1 ? "/assets/h02/character-reveal.jpg" : state.homeIndex === 2 ? "/assets/h03/character-reveal.png" : state.homeIndex === 3 ? "/assets/h04/character-reveal.jpg" : undefined} home={home}'
new_reveal = '<RevealView characterSrc={state.homeIndex === 0 ? "/assets/h01/character-reveal.png" : state.homeIndex === 1 ? "/assets/h02/character-reveal.jpg" : state.homeIndex === 2 ? "/assets/h03/character-reveal.png" : state.homeIndex === 3 ? "/assets/h04/character-reveal.jpg" : state.homeIndex === 4 ? "/assets/h05/character-reveal.png" : undefined} home={home}'

app = app_path.read_text(encoding='utf-8-sig')
if app.count(old_scene) != 1 or app.count(old_reveal) != 1:
    sys.exit('BLOCKED_SOURCE: App.tsx no coincide con H03/H04 aprobado; fuente sin modificar.')
if test_path.exists():
    sys.exit('BLOCKED_TEST: ya existe App.h05.test.tsx; fuente sin modificar.')

new_test = '''// @vitest-environment jsdom
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
'''

test_path.write_text(new_test, encoding='utf-8')
red_report = Path(tempfile.gettempdir()) / 'wholiveshere_h05_red.json'
red_report.unlink(missing_ok=True)
try:
    red = subprocess.run(
        ['pnpm.cmd', 'exec', 'vitest', 'run', 'src/App.h05.test.tsx',
         '--reporter=json', '--outputFile=' + str(red_report)],
        cwd=root, capture_output=True, text=True, errors='replace', timeout=180
    )
except (OSError, subprocess.TimeoutExpired) as exc:
    sys.exit('BLOCKED_TDD_RED: ' + type(exc).__name__ + ' - App.tsx intacto.')

if red.returncode == 0 or not red_report.is_file():
    sys.exit('BLOCKED_TDD_RED: resultado inesperado; App.tsx intacto.')

report = json.loads(red_report.read_text(encoding='utf-8-sig'))
messages = '\n'.join(
    msg for suite in report.get('testResults', [])
    for test in suite.get('assertionResults', [])
    for msg in test.get('failureMessages', [])
)
if report.get('numFailedTests') != 1 or '/assets/h05/home.jpg' not in messages:
    sys.exit('BLOCKED_TDD_RED: fallo no esperado; App.tsx intacto.')
print('TDD_RED: PASS')

backup_dir = Path(tempfile.mkdtemp(prefix='wholiveshere_h05_backup_'))
shutil.copy2(app_path, backup_dir / 'App.tsx')
app_path.write_text(app.replace(old_scene, new_scene, 1).replace(old_reveal, new_reveal, 1), encoding='utf-8')
print('H05_INTEGRATION: APPLIED')
print('APP_BACKUP: CREATED')

final_report = Path(tempfile.gettempdir()) / 'wholiveshere_h05_final.json'
final_report.unlink(missing_ok=True)
checks = [
    ('TESTS', ['pnpm.cmd', 'exec', 'vitest', 'run', '--reporter=json', '--outputFile=' + str(final_report)]),
    ('TYPECHECK', ['pnpm.cmd', 'exec', 'tsc', '--noEmit']),
    ('BUILD', ['pnpm.cmd', 'run', 'build'])
]
all_ok = True
for label, cmd in checks:
    try:
        result = subprocess.run(cmd, cwd=root, capture_output=True,
                                text=True, errors='replace', timeout=180)
        passed = (result.returncode == 0)
        print(label + ': ' + ('PASS' if passed else 'FAIL'))
        all_ok = all_ok and passed
        if label == 'TESTS' and final_report.is_file():
            data = json.loads(final_report.read_text(encoding='utf-8-sig'))
            print('TEST_COUNT: ' + str(data.get('numTotalTests', '?')))
            print('TEST_FAILED: ' + str(data.get('numFailedTests', '?')))
            if not passed:
                for suite in data.get('testResults', []):
                    if suite.get('status') == 'failed':
                        print('FAIL_FILE: ' + Path(suite.get('name', '')).name)
    except (OSError, subprocess.TimeoutExpired) as exc:
        print(label + ': ERROR ' + type(exc).__name__)
        all_ok = False

print('ADEL_H05_GATE: ' + ('PASS' if all_ok else 'FAIL'))
print('CODEX_TOKENS: 0')
print('COMMIT_DEPLOY: NOT_PERFORMED')
'@ | py -3 -

if ($LASTEXITCODE -ne 0) {
    throw 'SPRINT BLOCKED: revisar el ultimo mensaje. No iniciar Codex.'
}
