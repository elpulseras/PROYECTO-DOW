import bcrypt from "bcryptjs";

export default defineEventHandler(async (event) => {
  // extraer los datos que se ingresaron en el formulario
  const { email, password, nombre, apellido, rol } = await readBody(event);

  //crear el hash del password
  const hash = await bcrypt.hash(password, 12);

  // insertar el usuario en la BD
  const usuario = await prisma.usuario.create({
    data: {
      email,
      password: hash,
      nombre,
      apellido,
      rol,
    },
  });

  return {
    ok: true,
    usuario,
  };
});
