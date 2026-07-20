import z from 'zod'
import { Router } from 'express'
import { login, register } from '../controllers/authControllers.ts'
import { validateBody } from '../middleware/validation.ts'
import { insertUserSchema } from '../db/schema.ts'

// Login validation schema
const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
})

const router = Router()

// Define your auth-related routes here
router.post('/register', validateBody(insertUserSchema), register)
router.post('/login', validateBody(loginSchema), login)

export default router
