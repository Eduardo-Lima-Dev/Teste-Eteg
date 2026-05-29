import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateCustomerDto } from './dto/create-customer.dto'
import { Prisma } from '../generated/prisma/client'

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  async findAll(search?: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit
    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { cpf: { contains: search } },
            { email: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : undefined

    const [data, total] = await this.prisma.$transaction([
      this.prisma.customer.findMany({
        where,
        skip,
        take: limit,
        include: { color: true },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.customer.count({ where }),
    ])

    return { data, total, page, limit }
  }

  async findOne(id: number) {
    const customer = await this.prisma.customer.findUnique({ 
      where: { id },
      include: { color: true }
    })
    if (!customer) throw new NotFoundException('Cliente não encontrado')
    return customer
  }

  async create(dto: CreateCustomerDto) {
    try {
      return await this.prisma.customer.create({
        data: dto,
        include: { color: true }
      })
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        const field = (e.meta?.target as string[])?.[0]
        throw new ConflictException(
          field === 'cpf' ? 'CPF já cadastrado' : 'E-mail já cadastrado'
        )
      }
      throw e
    }
  }
}
