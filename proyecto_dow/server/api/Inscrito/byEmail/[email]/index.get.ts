export default defineEventHandler(async (event) => {
    const email = getRouterParam(event, 'email')

    const inscripciones = await prisma.inscrito.findMany({
        where: { email },
        include: { evento: true }
    })

    return inscripciones
})