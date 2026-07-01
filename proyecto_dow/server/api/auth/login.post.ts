import bcrypt from "bcryptjs";

export default defineEventHandler(async (event) => {
  const { email, password } = await readBody(event)

  if (!email || !password) {
    throw createError({ statusCode: 401, message: "Acceso Denegado, Intente nuevamente" })
  }

  const usuario = await prisma.usuario.findUnique({
    where: { email },
  })
  if (!usuario) {
    throw createError({ statusCode: 401, message: "Acceso Denegado, Intente nuevamente" })
  }

  if (usuario.rol !== 'Staff'){
    throw createError({ statusCode: 401, message: "Acceso Denegado, Intente nuevamente" })
  }
  
  const passwordValido = await bcrypt.compare(password, usuario.password);
  if (!passwordValido) {
    throw createError({ statusCode: 401, message: "Acceso Denegado, Intente nuevamente" })
  }

  await setUserSession(event, {
    user: {
      email: usuario.email,
      password: usuario.password,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      rol: usuario.rol,
    }
  });

  return { ok: true }
});
