import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateCustomerDto } from './dto/create-customer.dto'
import { Prisma } from '../generated/prisma/client'

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  async findAll(search?: string) {
    return this.prisma.customer.findMany({
      where: search
        ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' }},
            { cpf: { contains: search }},
            { email: { contains: search, mode: 'insensitive' }}
          ],
        }
      : undefined,
    include: { color: true },
    orderBy: { createdAt: 'desc' } 
    })
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
