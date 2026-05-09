import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { authenticateToken } from '../middleware/auth.js'

const router = Router()
const prisma = new PrismaClient()

router.post('/', authenticateToken, async (req, res) => {
  try {
    const { gunId, name, buildCode, description, screenshot } = req.body
    if (!gunId || !name || !buildCode) {
      return res.status(400).json({ error: '请填写必填字段' })
    }
    const build = await prisma.build.create({
      data: {
        gunId: parseInt(gunId),
        userId: req.user.id,
        name,
        buildCode,
        description,
        screenshot
      },
      include: { user: { select: { id: true, username: true } } }
    })
    res.status(201).json(build)
  } catch (err) {
    res.status(500).json({ error: '发布失败' })
  }
})

router.post('/:id/like', authenticateToken, async (req, res) => {
  try {
    const buildId = parseInt(req.params.id)
    const userId = req.user.id
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const existing = await prisma.buildLike.findUnique({
      where: { buildId_userId_likedDate: { buildId, userId, likedDate: today } }
    })
    if (existing) return res.status(400).json({ error: '今天已经支持过了' })

    const todayCount = await prisma.buildLike.count({
      where: { userId, likedDate: today }
    })
    if (todayCount >= 10) return res.status(400).json({ error: '今日点赞额度已用完' })

    await prisma.buildLike.create({ data: { buildId, userId, likedDate: today } })
    await prisma.build.update({ where: { id: buildId }, data: { likesCount: { increment: 1 } } })

    const build = await prisma.build.findUnique({ where: { id: buildId } })
    res.json({ likesCount: build.likesCount })
  } catch (err) {
    res.status(500).json({ error: '点赞失败' })
  }
})

router.get('/likes/today', authenticateToken, async (req, res) => {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const count = await prisma.buildLike.count({
      where: { userId: req.user.id, likedDate: today }
    })
    res.json({ used: count, remaining: Math.max(0, 10 - count) })
  } catch (err) {
    res.status(500).json({ error: '获取失败' })
  }
})

router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const buildId = parseInt(req.params.id)
    const build = await prisma.build.findUnique({ where: { id: buildId } })
    if (!build) return res.status(404).json({ error: '不存在' })
    if (build.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: '无权删除' })
    }
    await prisma.build.delete({ where: { id: buildId } })
    res.json({ message: '删除成功' })
  } catch (err) {
    res.status(500).json({ error: '删除失败' })
  }
})

export default router
