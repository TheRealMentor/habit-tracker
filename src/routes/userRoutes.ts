import { Router } from 'express'
import { authenticateToken } from '../middleware/auth.ts'

const router = Router()

// Protect all the routes below with authentication
router.use(authenticateToken)

// Define your user-related routes here
router.get('/', (req, res) => {
  res.status(200).json({ message: 'Get all users' })
})

router.get('/:id', (req, res) => {
  res.status(200).json({ message: `Get user ${req.params.id}` })
})

router.put('/:id', (req, res) => {
  res.status(200).json({ message: `Update user ${req.params.id}` })
})

router.delete('/:id', (req, res) => {
  res.status(200).json({ message: `Delete user ${req.params.id}` })
})

export default router
