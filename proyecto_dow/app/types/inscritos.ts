import type { Evento } from './evento'

export interface Inscrito {
    id: number
    email: string
    nombre: string
    apellido: string
    eventoId: number
    evento: Evento
}