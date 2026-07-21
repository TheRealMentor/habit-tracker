import { Router } from 'express'
import { validateBody, validateParams } from '../middleware/validation.ts'
import z from 'zod'
import { authenticateToken } from '../middleware/auth.ts'
import { createHabit } from '../controllers/habitController.ts'

const createHabitSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  frequency: z.string(),
  targetCount: z.number(),
  tagIds: z.array(z.string()).optional(),
})

const completeHabitSchema = z.object({
  id: z.string().min(3, 'ID must be at least 3 characters long'),
})

const router = Router()

// Protect all the routes below with authentication
router.use(authenticateToken)

// Define your habit-related routes here
router.get('/', (req, res) => {
  res.status(200).json({ message: 'Get all habits' })
})

router.get('/:id', (req, res) => {
  res.status(200).json({ message: 'Get habit by ID' })
})

router.post('/', validateBody(createHabitSchema), createHabit)

router.delete('/:id', (req, res) => {
  res.status(200).json({ message: 'Habit deleted successfully' })
})

router.post(
  '/:id/complete',
  validateParams(completeHabitSchema),
  validateBody(createHabitSchema),
  (req, res) => {
    res.json({ message: `Mark habit ${req.params.id} complete` })
  },
)

router.get('/:id/stats', (req, res) => {
  res.json({ message: `Get stats for habit ${req.params.id}` })
})

export default router
