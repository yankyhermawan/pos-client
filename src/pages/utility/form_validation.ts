import z from 'zod'

export const requiredString = (message = 'Required') => z.string().trim().min(1, { message })