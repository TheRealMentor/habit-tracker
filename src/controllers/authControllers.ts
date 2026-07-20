import type { Request, Response } from 'express'
import { eq } from 'drizzle-orm'

import { db } from '../db/connection.ts'
import { users, type NewUser } from '../db/schema.ts'
import { generateToken } from '../utils/jwt.ts'
import { comparePassword, hashPassword } from '../utils/password.ts'

export const register = async (
  req: Request<any, any, NewUser>,
  res: Response,
) => {
  try {
    const hashedPassword = await hashPassword(req.body.password)

    const [user] = await db
      .insert(users)
      .values({
        ...req.body,
        password: hashedPassword,
      })
      .returning({
        id: users.id,
        email: users.email,
        username: users.username,
        firstName: users.firstName,
        lastName: users.lastName,
        createdAt: users.createdAt,
      })

    const token = await generateToken({
      id: user.id,
      email: user.email,
      username: user.username,
    })

    return res.status(201).json({
      message: 'User signed up!',
      token,
      user,
    })
  } catch (e) {
    console.error('Registration failed', e)
    res.status(500).json({ error: 'Failed to register user' })
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    // Step 1: Find the user by email
    const [user] = await db.select().from(users).where(eq(users.email, email))

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Step 2: Verify password
    const isValidPassword = await comparePassword(password, user.password)

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Step 3: Generate JWT token
    const token = await generateToken({
      id: user.id,
      email: user.email,
      username: user.username,
    })

    // Step 4: Return user data and token
    res.status(200).json({
      message: 'Login Successful!',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        createdAt: user.createdAt,
      },
      token,
    })
  } catch (e) {
    console.error('Error loggin in!', e)
    res.status(500).json({ error: 'Error logging in!' })
  }
}
