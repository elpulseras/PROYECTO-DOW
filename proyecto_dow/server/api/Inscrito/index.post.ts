export default defineEventHandler(async (event) => {
  const { email, nombre, apellido, eventoId } = await readBody(event)

  if (!email?.trim() || !nombre?.trim() || !apellido?.trim() || !eventoId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Todos los campos son obligatorios.'
    })
  }

  const yaInscrito = await prisma.inscrito.findFirst({
    where: {
      email: email.trim(),
      eventoId: Number(eventoId)
    }
  })

  if (yaInscrito) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Ya estás inscrito en este evento.'
    })
  }

  const inscrito = await prisma.inscrito.create({
    data: {
      email: email.trim(),
      nombre: nombre.trim(),
      apellido: apellido.trim(),
      eventoId: Number(eventoId)
    }
  })

  return { ok: true, inscrito }
})