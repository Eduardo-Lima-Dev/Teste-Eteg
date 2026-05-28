import { createZodDto } from 'nestjs-zod'
import { createColorSchema } from '@teste-eteg/shared'

export class CreateColorDto extends createZodDto(createColorSchema) {}
