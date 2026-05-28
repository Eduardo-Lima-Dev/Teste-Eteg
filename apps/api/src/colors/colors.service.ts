import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateColorDto } from './dto/create-color.dto'
import { Prisma, PrismaClient } from '../generated/prisma/client'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client'

@Injectable()
export class ColorsService {
  constructor(private prisma: PrismaService) {}

  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit
    const [data, total] = await this.prisma.$transaction([
      this.prisma.color.findMany({skip, take: limit, orderBy: { name: 'asc' }}),
      this.prisma.color.count()
    ])
    return { data, total, page, limit }
  }

  async findOne(id: number) {
    const color = await this.prisma.color.findUnique({ where: { id } })
    if (!color) throw new NotFoundException('Corr não encontrada')
      return color
  }

  async create(dto: CreateColorDto) {
    try {
      return await this.prisma.color.create({ data: dto })
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        throw new ConflictException('Cor já cadastrada')
      }
      throw e
    }
  }

  async remove(id: number) {
    const color = await this.prisma.color.findUnique({ where: { id }})
    if (!color) throw new NotFoundException('Cor não encontrada')

    const inUse = await this.prisma.customer.count({ where: { id }})
    if (inUse > 0) throw new ConflictException('Cor está em uso por clientes')

    return this.prisma.color.delete({ where: { id }})
  }
}
