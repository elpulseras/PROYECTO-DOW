export default defineEventHandler(async (event) => {
    const id = Number(getRouterParam(event, 'id'))

    const evento = await prisma.evento.findUnique({
        where: { id },
        include: {
            inscritos: true
        }
    })

    return evento
})