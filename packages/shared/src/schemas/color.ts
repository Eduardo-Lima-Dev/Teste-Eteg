import { z } from 'zod'

export const createColorSchema = z.object({
    name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
    hexCode: z
        .string()
        .regex(/^#[0-9A-Fa-f]{6}$/, 'Hex deve estar no formato #RRGGBB'),
})

export type CreateColorInput = z.infer<typeof createColorSchema>

export const colorResponseSchema = z.object({
    id: z.number(),
    name: z.string(),
    hexCode: z.string(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
})

export type ColorResponse = z.infer<typeof colorResponseSchema>