import { Router } from 'express'
import { register } from '../controllers/authControllers.ts'
import { validateBody } from '../middleware/validation.ts'
import { insertUserSchema } from '../db/schema.ts'

const router = Router()

// Define your auth-related routes here
router.post('/register', validateBody(insertUserSchema), register)

router.post('/login', (req, res) => {
  res.status(200).json({ message: 'Login endpoint placeholder' })
})

export default router
