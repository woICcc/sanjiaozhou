import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'
import { authenticateToken, JWT_SECRET } from '../middleware/auth.js'

const router = Router()
const prisma = new PrismaClient()

router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body
    if (!username || !email || !password) {
      return res.status(400).json({ error: '请填写所有必填字段' })
    }

    const existing = await prisma.user.findFirst({
      where: { OR: [{ username }, { email }] }
    })
    if (existing) {
      return res.status(409).json({ error: '用户名或邮箱已被注册' })
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: { username, email, passwordHash }
    })

    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '7d' })
    res.status(201).json({ token, user: { id: user.id, username: user.username, email: user.email, role: user.role } })
  } catch (err) {
    res.status(500).json({ error: '注册失败' })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return res.status(401).json({ error: '邮箱或密码错误' })

    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) return res.status(401).json({ error: '邮箱或密码错误' })

    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '7d' })
    res.json({ token, user: { id: user.id, username: user.username, email: user.email, role: user.role } })
  } catch (err) {
    res.status(500).json({ error: '登录失败' })
  }
})

router.get('/me', authenticateToken, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { id: true, username: true, email: true, role: true, createdAt: true }
  })
  res.json(user)
})

export default router
