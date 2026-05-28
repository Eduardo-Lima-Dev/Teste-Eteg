import { PrismaClient } from '../src/generated/prisma/client'
import * as bcrypt from 'bcrypt'
import { PrismaPg } from '@prisma/adapter-pg'
import 'dotenv/config'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })


const RAINBOW_COLORS = [
  { name: 'Vermelho', hexCode: '#FF0000' },
  { name: 'Laranja',  hexCode: '#FF7F00' },
  { name: 'Amarelo',  hexCode: '#FFFF00' },
  { name: 'Verde',    hexCode: '#00FF00' },
  { name: 'Azul',     hexCode: '#0000FF' },
  { name: 'Anil',     hexCode: '#4B0082' },
  { name: 'Violeta',  hexCode: '#8B00FF' },
]


async function main() {
  for (const color of RAINBOW_COLORS) {
  await prisma.color.upsert({
    where: { name: color.name },
    update: {},
    create: color,
  })
}


  const adminEmail = process.env.ADMIN_EMAIL
  const adminPassword = process.env.ADMIN_PASSWORD

  if (!adminEmail || !adminPassword) {
    throw new Error('Variáveis de ambiente ADMIN_EMAIL e ADMIN_PASSWORD são obrigatórias.')
  }

  const passwordHash = await bcrypt.hash(adminPassword, 10)

  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {},
    create: { email: adminEmail, passwordHash },
  })

  console.log('Seed concluído.')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
