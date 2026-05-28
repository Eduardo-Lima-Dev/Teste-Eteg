import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PrismaModule } from './prisma/prisma.module'
import { CustomersModule } from './customers/customers.module'
import { ColorsModule } from './colors/colors.module'
import { AuthModule } from './auth/auth.module'
import { HealthModule } from './health/health.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    CustomersModule,
    ColorsModule,
    AuthModule,
    HealthModule,
  ],
})
export class AppModule {}
