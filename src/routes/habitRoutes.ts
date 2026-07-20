import { Router } from 'express'

const router = Router()

// Define your habit-related routes here
router.get('/', (req, res) => {
  res.status(200).json({ message: 'Get all habits' })
})

router.get('/:id', (req, res) => {
  res.status(200).json({ message: 'Get habit by ID' })
})

router.post('/', (req, res) => {
  res.status(201).json({ message: 'Habit created successfully' })
})

router.delete('/:id', (req, res) => {
  res.status(200).json({ message: 'Habit deleted successfully' })
})

router.post('/:id/complete', (req, res) => {
  res.json({ message: `Mark habit ${req.params.id} complete` })
})

router.get('/:id/stats', (req, res) => {
  res.json({ message: `Get stats for habit ${req.params.id}` })
})

export default router
