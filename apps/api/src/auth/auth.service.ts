import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from '../prisma/prisma.service'
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async login(email: string, password: string): Promise<string> {
    const admin = await this.prisma.adminUser.findUnique({
      where: { email }
    })

    if (!admin) throw new UnauthorizedException('Credenciais inválidas')

    const valid = await bcrypt.compare(password, admin.passwordHash)
    if (!valid) throw new UnauthorizedException('Credenciais inválidas')

    return this.jwt.sign({ email: admin.email })
  }
}
