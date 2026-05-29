import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateColorDto } from './dto/create-color.dto'
import { Prisma } from '../generated/prisma/client'

@Injectable()
export class ColorsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.color.findMany({ orderBy: { name: 'asc' } })
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
