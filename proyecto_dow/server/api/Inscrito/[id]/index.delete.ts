export default defineEventHandler(async (event) => {
    const params = event.context.params
    const idParam = params?.id
    const id = Number(idParam)

    if (!idParam || isNaN(id)) {
        throw createError({ statusCode: 400, message: `ID inválido: ${idParam}` })
    }

    await prisma.inscrito.delete({
        where: { id }
    })

    return { ok: true }
})