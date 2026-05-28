import { z } from 'zod'

export const paginationSchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().default(10),
})

export const searchQuerySchema = paginationSchema.extend({
    search: z.string().optional(),
})

export type PaginationInput = z.infer<typeof paginationSchema>
export type SearchQueryInput = z.infer<typeof searchQuerySchema>