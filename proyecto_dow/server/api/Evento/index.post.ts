import { writeFile } from 'fs/promises'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  // 1. Leer FormData (porque viene con imagen)
  const formData = await readFormData(event)

  const titulo = formData.get('titulo') as string
  const fecha = formData.get('fecha') as string
  const hora = formData.get('hora') as string
  const lugar = formData.get('lugar') as string
  const valor = formData.get('valor') as string
  const imagenArchivo = formData.get('imagen') as File | null

  // 2. Validar campos obligatorios
  if (!titulo?.trim() || !fecha?.trim() || !hora?.trim() || !lugar?.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Todos los campos obligatorios deben estar completados.'
    })
  }

  // 3. Manejar la imagen
  let nombreImagen = 'default.jpg'
  if (imagenArchivo && imagenArchivo.size > 0) {
    const buffer = Buffer.from(await imagenArchivo.arrayBuffer())
    const extension = imagenArchivo.name.split('.').pop()
    nombreImagen = `evento_${Date.now()}.${extension}`
    const ruta = join(process.cwd(), 'public', 'uploads', nombreImagen)
    await writeFile(ruta, buffer)
  }

  // 4. Combinar fecha y hora
  const fechaHora = new Date(`${fecha}T${hora}:00`)

  // 5. Insertar en BD
  const evento = await prisma.evento.create({
    data: {
      titulo: titulo.trim(),
      fecha: fechaHora,
      lugar: lugar.trim(),
      valor: Number(valor) || 0,
      imagen: nombreImagen
    }
  })

  return { ok: true, evento }
})