interface ResultViewProps {
  total: number
  onRestart: () => void
}

export default function ResultView({ total, onRestart }: ResultViewProps) {
  return (
    <main className="result-panel" aria-labelledby="result-heading">
      <p className="eyebrow">Cinco hogares, quince pistas</p>
      <h1 id="result-heading" tabIndex={-1}>Resultado final</h1>
      <p className="result-score">{total} / 30</p>
      <p>Ya conocés a quienes viven aquí. ¿Qué descubrirías en otra partida?</p>
      <button className="primary-button" type="button" onClick={onRestart}>Nueva partida <span aria-hidden="true">↗</span></button>
    </main>
  )
}
