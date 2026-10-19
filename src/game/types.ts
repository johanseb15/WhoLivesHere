export type Points = 0 | 1 | 2

export interface Option {
  id: string
  label: string
  points: Points
  explanation: string
}

export interface Question {
  id: string
  kind: 'concreta' | 'interpretativa' | 'sorpresa'
  prompt: string
  options: readonly Option[]
}

export interface Home {
  id: string
  title: string
  imageSrc: string
  imageAlt: string
  revealPortrait?: { src: string; alt: string }
  profileName: string
  profile: string
  reveal: string
  questions: readonly Question[]
}

export type AnswerMap = Readonly<Record<string, string>>

export interface GameState {
  phase: 'pregunta' | 'revelacion' | 'resultado'
  homeIndex: number
  questionIndex: number
  answers: AnswerMap
}

export type GameAction =
  | { type: 'RESPONDER'; optionId: string }
  | { type: 'SIGUIENTE' }
  | { type: 'VER_RESULTADO' }
  | { type: 'NUEVA_PARTIDA' }
