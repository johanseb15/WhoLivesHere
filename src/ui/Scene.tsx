import { useEffect, useRef, useState } from 'react'

interface SceneProps {
  src: string
  alt: string
  title: string
  showTitle?: boolean
}

export default function Scene({ src, alt, title, showTitle = true }: SceneProps) {
  const [isOpen, setIsOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const imageSrc = `${import.meta.env.BASE_URL}${src.replace(/^\/+/, '')}`
  const dialogTitle = showTitle ? `${title} ampliado` : 'Vivienda ampliada'
  const dialogTitleId = `scene-dialog-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`

  useEffect(() => {
    if (!isOpen) return
    const dialog = dialogRef.current
    if (!dialog) return
    if (typeof dialog.showModal === 'function') dialog.showModal()
    else dialog.setAttribute('open', '')
    closeRef.current?.focus()

    return () => {
      if (dialog.open && typeof dialog.close === 'function') dialog.close()
      triggerRef.current?.focus()
    }
  }, [isOpen])

  const closeViewer = () => setIsOpen(false)

  return (
    <>
      <figure className="scene">
        <img src={imageSrc} alt={alt} />
        <button ref={triggerRef} className="scene-zoom" type="button" onClick={() => setIsOpen(true)} aria-label="Ampliar imagen de la vivienda">
          <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <circle cx="10.5" cy="10.5" r="6.5" /><path d="m20 20-4.8-4.8M10.5 8v5M8 10.5h5" />
          </svg>
          Ampliar
        </button>
        {showTitle && <figcaption>{title}</figcaption>}
      </figure>
      {isOpen && (
        <dialog
          ref={dialogRef}
          className="scene-viewer"
          aria-labelledby={dialogTitleId}
          onCancel={(event) => { event.preventDefault(); closeViewer() }}
          onKeyDown={(event) => { if (event.key === 'Escape') { event.preventDefault(); closeViewer() } }}
          onClick={(event) => { if (event.target === event.currentTarget) closeViewer() }}
        >
          <div className="scene-viewer__bar">
            <h2 id={dialogTitleId}>{dialogTitle}</h2>
            <button ref={closeRef} className="button-quiet" type="button" onClick={closeViewer}>Cerrar</button>
          </div>
          <div className="scene-viewer__image"><img src={imageSrc} alt={alt} /></div>
        </dialog>
      )}
    </>
  )
}
