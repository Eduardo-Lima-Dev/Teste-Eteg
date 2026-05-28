import { createZodDto } from 'nestjs-zod'
import { createCustomerSchema } from '@teste-eteg/shared'

export class CreateCustomerDto extends createZodDto(createCustomerSchema) {}
