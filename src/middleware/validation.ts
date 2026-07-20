import type { Request, Response, NextFunction } from 'express'
import { type ZodSchema, ZodError } from 'zod'

export const validateBody = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedBody = schema.parse(req.body)
      req.body = validatedBody
      next()
    } catch (e) {
      if (e instanceof ZodError) {
        return res.status(400).json({
          message: 'Invalid body',
          details: e.issues.map((issue) => ({
            path: issue.path,
            message: issue.message,
          })),
        })
      }

      next(e) // Pass other errors to the error handling middleware
    }
  }
}

export const validateParams = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.params)
      next()
    } catch (e) {
      if (e instanceof ZodError) {
        return res.status(400).json({
          message: 'Invalid params',
          details: e.issues.map((issue) => ({
            path: issue.path,
            message: issue.message,
          })),
        })
      }

      next(e) // Pass other errors to the error handling middleware
    }
  }
}

export const validateQuery = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.query)
      next()
    } catch (e) {
      if (e instanceof ZodError) {
        return res.status(400).json({
          message: 'Invalid query parameters',
          details: e.issues.map((issue) => ({
            path: issue.path,
            message: issue.message,
          })),
        })
      }

      next(e) // Pass other errors to the error handling middleware
    }
  }
}
