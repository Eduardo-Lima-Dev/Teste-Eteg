import { z } from 'zod'
import { isValidCpf } from '../lib/cpf'

export const createCustomerSchema = z.object({
    name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
    cpf: z
        .string()
        .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF deve estar no formato XXX.XXX.XXX-XX')
        .refine(isValidCpf, 'CPF inválido'),
    email: z.string().email('E-mail inválido'),
    colorId: z.number().int().positive('Selecione uma cor'),
    observations: z.string().max(500, 'Observações devem ter no máximo 500 caracteres').optional(),
})

export type CreateCustomerInput = z.infer<typeof createCustomerSchema>

export const customerResponseSchema = z.object({
    id: z.number(),
    name: z.string(),
    cpf: z.string(),
    email: z.string(),
    observations: z.string().nullable(),
    createdAt: z.string().datetime(),
    color: z.object({
        id: z.number(),
        name: z.string(),
        hexCode: z.string(),
        createdAt: z.string().datetime(),
    })
})

export type CustomerResponse = z.infer<typeof customerResponseSchema>