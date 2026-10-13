interface SceneProps {
  src: string
  alt: string
  title: string
}

export default function Scene({ src, alt, title }: SceneProps) {
  return (
    <figure className="scene">
      <img src={`${import.meta.env.BASE_URL}${src.replace(/^\/+/, '')}`} alt={alt} />
      <figcaption>{title}</figcaption>
    </figure>
  )
}
