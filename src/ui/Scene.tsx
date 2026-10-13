interface SceneProps {
  src: string
  alt: string
  title: string
}

export default function Scene({ src, alt, title }: SceneProps) {
  return (
    <figure className="scene">
      <img src={src} alt={alt} />
      <figcaption>{title}</figcaption>
    </figure>
  )
}
