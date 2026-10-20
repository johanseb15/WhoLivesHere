import type { Home } from './types'

const portraits = {
  H01: { file: 'character-reveal.png', alt: 'Retrato 3D estilizado de Vera con pañuelo amarillo y delantal azul' },
  H02: { file: 'character-reveal.jpg', alt: 'Retrato 3D estilizado de Gael' },
  H03: { file: 'character-reveal.png', alt: 'Retrato 3D estilizado de Leo' },
  H04: { file: 'character-reveal.jpg', alt: 'Retrato 3D estilizado de Noa' },
  H05: { file: 'character-reveal.png', alt: 'Retrato 3D estilizado de Teo' },
} as const

export function withApprovedArt(baseHomes: readonly Home[]): readonly Home[] {
  return baseHomes.map((home) => {
    const portrait = portraits[home.id as keyof typeof portraits]

    if (!portrait) {
      throw new Error(`Faltan recursos aprobados para ${home.id}`)
    }

    const dir = `/assets/${home.id.toLowerCase()}`

    return {
      ...home,
      imageSrc: `${dir}/home.jpg`,
      revealPortrait: {
        src: `${dir}/${portrait.file}`,
        alt: portrait.alt,
      },
    }
  })
}
