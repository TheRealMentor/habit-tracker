import type { Request, Response, NextFunction } from 'express'
import { verifyToken, type JwtPayload } from '../utils/jwt.ts'

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload
}

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ error: 'Access token required' })
    }

    // Verify and extract user object from token
    const payload = await verifyToken(token)

    // Attach authenticated user to req
    req.user = payload

    // Jump to next middleware
    next()
  } catch (e) {
    res.status(403).json({ error: 'Forbidden!' })
  }
}
