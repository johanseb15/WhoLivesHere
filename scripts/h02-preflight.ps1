$ErrorActionPreference = 'Stop'
$root = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$asset = Join-Path $root 'public\assets\h02\home-candidate.jpg'
$app = Join-Path $root 'src\App.tsx'
$reveal = Join-Path $root 'src\ui\RevealView.tsx'
$content = Join-Path $root 'src\game\content.ts'
$plan = Join-Path $root 'docs\sprints\ADEL-H02-sprint.md'
foreach ($file in @($asset,$app,$reveal,$content,$plan)) {
  if (!(Test-Path -LiteralPath $file -PathType Leaf)) { throw 'BLOCKED: required local project file missing' }
}
if ((Get-Item $asset).Length -lt 25000) { throw 'BLOCKED: candidate image unusually small' }
$head = [System.IO.File]::ReadAllBytes($asset)
if ($head[0] -ne 255 -or $head[1] -ne 216) { throw 'BLOCKED: candidate is not JPG' }
$appText = Get-Content $app -Raw -Encoding UTF8
$revealText = Get-Content $reveal -Raw -Encoding UTF8
$contentText = Get-Content $content -Raw -Encoding UTF8
if (!$contentText.Contains("id: 'H02'")) { throw 'BLOCKED: H02 not found in dataset' }
if (!$appText.Contains('character-reveal.png')) { throw 'BLOCKED: H01 previously-integrated baseline not found' }
Write-Output 'H02_IMAGE: STAGED_CANDIDATE'
Write-Output 'H01_BASELINE: DETECTED'
$prompt = @"
You are a local code review assistant. This is an ADEL brownfield React TypeScript project. The game contains hidden puzzles; do not quote or infer any questions, profiles or answers. No file modifications. Plan the minimal technical integration of an H02 home JPG while preserving the H01 home/reveal images, all 20 levels, state machine, scoring, keyboard navigation, tests and responsive layout. This JPG is only a candidate; visual clue approval is pending. A matching 3D character PNG is not available, so do NOT claim the sprint is complete or invent the missing asset. Find likely files to modify; test ideas for home image display and character hidden before reveal; identify risks. Respond with at most 160 words. Source App.tsx:\n$($appText.Substring(0,[Math]::Min($appText.Length,8000)))\nSource RevealView.tsx:\n$($revealText.Substring(0,[Math]::Min($revealText.Length,4500)))
"@
$payload = @{ model='qwen2.5-coder:7b'; prompt=$prompt; stream=$false; options=@{ num_predict=240; num_ctx=4096; temperature=0 } } | ConvertTo-Json -Depth 6
try {
  $result = Invoke-RestMethod -Uri 'http://127.0.0.1:11434/api/generate' -Method Post -ContentType 'application/json' -Body ([System.Text.Encoding]::UTF8.GetBytes($payload)) -TimeoutSec 180
  if ([string]::IsNullOrWhiteSpace($result.response)) { throw 'No response from local model' }
  $planPath = Join-Path $env:TEMP 'wholiveshere_h02_ollama_review.txt'
  [System.IO.File]::WriteAllText($planPath, $result.response, (New-Object System.Text.UTF8Encoding($false)))
  Write-Output 'OLLAMA_LOCAL_REVIEW: PASS'
  Write-Output 'OLLAMA_TOKENS_BILLED_TO_CODEX: 0'
} catch {
  Write-Output 'OLLAMA_LOCAL_REVIEW: BLOCKED'
  Write-Output 'REASON: local Ollama endpoint/model unavailable or timed out'
  return
}
Write-Output 'H02_PHOTO_CLUE_GATE: PENDING_VISUAL_APPROVAL'
Write-Output 'H02_CHARACTER_ASSET: PENDING'
Write-Output 'CODEX_EXECUTION: NOT_STARTED (wait for asset gate)'
Write-Output 'CHANGES_TO_EXISTING_SOURCE: NONE'
Write-Output 'COMMIT_DEPLOY: NOT_PERFORMED'
