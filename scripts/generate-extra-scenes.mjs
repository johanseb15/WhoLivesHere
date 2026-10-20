import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const output = resolve(dirname(fileURLToPath(import.meta.url)), '../public/homes')
const scenes = [
  ['h06', '#dce9ed', '#43677a', ['🔭', '🌙', '📷', '📅', '☁️', '🔴']],
  ['h07', '#f2e3d6', '#805b69', ['✉️', '🐦', '🗺️', '🔍', '🪶', '🖼️']],
  ['h08', '#d8ebea', '#3a7381', ['🐚', '📏', '📓', '🕒', '🦀', 'tank']],
  ['h09', '#f5e2cc', '#ad6349', ['🍪', '⚖️', '🍊', '🫙', '🥄', '📖']],
  ['h10', '#eee1eb', '#875c81', ['🧵', '🪡', '🧦', '🌸', '🧥', '🔘']],
  ['h11', '#e5e8cd', '#69784d', ['📚', '🚪', '🗺️', '✏️', '📇', '🔦']],
  ['h12', '#f2e8d8', '#90765c', ['🪴', '🌼', '🕰️', '💡', '📄', '🖼️']],
  ['h13', '#e5e9ed', '#607589', ['🧸', '🛞', '🔧', '📷', '🧩', '🎁']],
  ['h14', '#f3e1e6', '#a56375', ['🌷', '✂️', '🌱', '🌧️', '💐', '💧']],
  ['h15', '#e8e0d1', '#785d42', ['☕', '🚲', '🗺️', '🌿', '📓', '🏷️']],
  ['h16', '#ebe3d6', '#96724d', ['🥁', '🍳', '🥄', '🎙️', '🎧', '🎼']],
  ['h17', '#e4ead7', '#6c825d', ['🍂', '🔍', '🌳', '🗺️', '🎨', '📷']],
  ['h18', '#e5e3f2', '#6e668e', ['🧩', '✉️', '🗺️', '🗝️', '🚪', '⭐']],
  ['h19', '#ddeaf3', '#5c779d', ['☁️', '📷', '🪁', '🌧️', '🗓️', 'gauge']],
  ['h20', '#e1e9ed', '#547385', ['lighthouse', '💡', '🗺️', '⛵', '📷', '📓']],
]

function icon(id, symbol, index, x, y) {
  const center = x + 76
  if (symbol === 'lighthouse') return `<path d="M${center - 23} ${y + 91}l9-59h28l9 59z" fill="#fff1db" stroke="#476878" stroke-width="4"/><path d="M${center - 19} ${y + 63}h38" stroke="#cf745c" stroke-width="13"/><path d="M${center - 24} ${y + 32}h48l-12-12h-24z" fill="#476878"/><circle cx="${center}" cy="${y + 39}" r="7" fill="#ffd576"/><path d="M${center + 12} ${y + 38}l43-19v37z" fill="#ffd576" opacity=".55"/>`
  if (symbol === 'tank') return `<path d="M${center - 48} ${y + 29}h96l-8 63h-80z" fill="#d8f4ef" stroke="#537d84" stroke-width="5"/><path d="M${center - 44} ${y + 38}h88" stroke="#84bfc4" stroke-width="4"/><path d="M${center - 43} ${y + 75}h84" stroke="#84bfc4" stroke-width="4" stroke-dasharray="4 7"/>`
  if (symbol === 'gauge') return `<path d="M${center - 24} ${y + 24}h48l-8 68h-32z" fill="#d7ebf2" stroke="#537d9d" stroke-width="5"/><path d="M${center - 18} ${y + 64}h36v24h-36z" fill="#6daac8" opacity=".65"/><path d="M${center + 10} ${y + 39}h10M${center + 8} ${y + 50}h10M${center + 6} ${y + 61}h10" stroke="#537d9d" stroke-width="3"/>`
  if (id === 'h06' && index === 5) return `<path d="M${center - 30} ${y + 84}h60M${center} ${y + 84}v-20" stroke="#687286" stroke-width="6"/><circle cx="${center}" cy="${y + 47}" r="23" fill="#e74458"/><circle cx="${center - 7}" cy="${y + 40}" r="7" fill="#ffabb1"/>`
  return `<text x="${center}" y="${y + 85}" text-anchor="middle" font-family="Segoe UI Emoji, Apple Color Emoji, Noto Color Emoji, sans-serif" font-size="64">${symbol}</text>`
}

for (const [id, wall, ink, objects] of scenes) {
  const cards = objects.map((symbol, index) => {
    const col = index % 3
    const row = Math.floor(index / 3)
    const x = 74 + col * 222
    const y = 158 + row * 154
    const rotation = [-5, 4, -3, 3, -4, 5][index]
    return `<g transform="rotate(${rotation} ${x + 75} ${y + 65})">
      <rect x="${x}" y="${y}" width="153" height="132" rx="13" fill="#fffdf6" stroke="${ink}" stroke-opacity=".32" stroke-width="3"/>
      <rect x="${x + 10}" y="${y + 10}" width="133" height="90" rx="8" fill="${wall}" opacity=".72"/>
      ${icon(id, symbol, index, x, y)}
      ${id === 'h09' && index === 3 ? `<text x="${x + 120}" y="${y + 52}" font-size="22" font-family="Arial" fill="${ink}">1·2·3</text>` : ''}
      ${id === 'h18' && index === 1 ? `<text x="${x + 112}" y="${y + 64}" font-size="20" font-family="Arial" fill="${ink}">1·2·3</text>` : ''}
      <path d="M${x + 28} ${y + 113}h97" stroke="${ink}" stroke-opacity=".32" stroke-width="5" stroke-linecap="round"/>
    </g>`
  }).join('\n')
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" role="img">
  <defs>
    <linearGradient id="wall" x2="0" y2="1"><stop stop-color="${wall}"/><stop offset="1" stop-color="#fff8ea"/></linearGradient>
    <linearGradient id="table" x2="0" y2="1"><stop stop-color="${ink}"/><stop offset="1" stop-color="#3a4347"/></linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="9" stdDeviation="8" flood-color="#24353b" flood-opacity=".16"/></filter>
  </defs>
  <rect width="800" height="600" fill="url(#wall)"/>
  <path d="M0 0h800v60H0z" fill="${ink}" opacity=".16"/>
  <path d="M18 37h764M18 520h764" stroke="${ink}" stroke-opacity=".32" stroke-width="3"/>
  <path d="M0 523h800v77H0z" fill="url(#table)"/>
  <path d="M0 519h800" stroke="#fff5df" stroke-opacity=".7" stroke-width="13"/>
  <path d="M31 114q0-45 45-45h648q45 0 45 45v348q0 45-45 45H76q-45 0-45-45z" fill="#fff9ed" stroke="${ink}" stroke-width="8" filter="url(#shadow)"/>
  <path d="M50 119h700" stroke="${ink}" stroke-opacity=".2" stroke-width="3"/>
  <circle cx="98" cy="103" r="8" fill="${ink}"/><circle cx="400" cy="103" r="8" fill="${ink}"/><circle cx="702" cy="103" r="8" fill="${ink}"/>
  <path d="M87 118l26 24M389 118l26 24M691 118l26 24" stroke="${ink}" stroke-opacity=".25" stroke-width="4"/>
  <g filter="url(#shadow)">${cards}</g>
  <path d="M75 481h650" stroke="${ink}" stroke-opacity=".2" stroke-width="4" stroke-linecap="round"/>
  <circle cx="82" cy="557" r="8" fill="#ffe2a7" opacity=".65"/><circle cx="121" cy="562" r="5" fill="#ffe2a7" opacity=".65"/>
  <path d="M618 560q29-27 62 0t63 0" stroke="#ffe2a7" stroke-opacity=".55" stroke-width="5" fill="none"/>
</svg>\n`
  writeFileSync(resolve(output, `${id}.svg`), svg, 'utf8')
}
