import { useState } from 'react'

interface RevealPortraitProps {
  portrait?: { src: string; alt: string }
  fallback?: { src: string; alt: string }
}

export default function RevealPortrait({ portrait, fallback }: RevealPortraitProps) {
  const [failed, setFailed] = useState(false)

  if (!portrait) return null

  const assetUrl = (src: string) => `${import.meta.env.BASE_URL}${src.replace(/^\/+/, '')}`

  return (
    <figure className={`reveal-portrait${failed ? ' reveal-portrait--fallback' : ''}`}>
      {failed
        ? fallback && <img src={assetUrl(fallback.src)} alt={fallback.alt} />
        : <img src={assetUrl(portrait.src)} alt={portrait.alt} onError={() => setFailed(true)} />}
    </figure>
  )
}
