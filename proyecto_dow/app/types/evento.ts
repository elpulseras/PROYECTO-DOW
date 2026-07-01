export interface Evento {
    id: number
    titulo: string
    fecha: Date
    lugar: string
    imagen: string
    valor: number
    _count: {
        inscritos: number
    }
}