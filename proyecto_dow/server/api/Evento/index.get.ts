export default defineEventHandler(async () => {
  return await prisma.evento.findMany({
    orderBy: { fecha: 'asc' },
    include: {
      _count: {
        select: { inscritos: true }
      }
    }
  })
})