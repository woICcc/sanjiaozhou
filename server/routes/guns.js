import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { authenticateToken, requireAdmin } from '../middleware/auth.js'

const router = Router()
const prisma = new PrismaClient()

router.get('/', async (req, res) => {
  try {
    const { type } = req.query
    const where = type ? { type } : {}
    const guns = await prisma.gun.findMany({
      where,
      orderBy: { type: 'asc' }
    })
    res.json(guns)
  } catch (err) {
    res.status(500).json({ error: '获取枪械列表失败' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const gun = await prisma.gun.findUnique({ where: { id } })
    if (!gun) return res.status(404).json({ error: '枪械不存在' })

    const topBuilds = await prisma.build.findMany({
      where: { gunId: id },
      orderBy: { likesCount: 'desc' },
      take: 5,
      include: { user: { select: { id: true, username: true } } }
    })

    const builds = await prisma.build.findMany({
      where: { gunId: id },
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { id: true, username: true } } }
    })

    res.json({ ...gun, topBuilds, builds })
  } catch (err) {
    res.status(500).json({ error: '获取枪械详情失败' })
  }
})

router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, type, image, unlockLevel } = req.body
    const gun = await prisma.gun.create({
      data: { name, type, image, unlockLevel: unlockLevel ? parseInt(unlockLevel) : null }
    })
    res.status(201).json(gun)
  } catch (err) {
    res.status(500).json({ error: '新增枪械失败' })
  }
})

router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const { name, type, image, unlockLevel } = req.body
    const gun = await prisma.gun.update({
      where: { id },
      data: { name, type, image, unlockLevel: unlockLevel ? parseInt(unlockLevel) : null }
    })
    res.json(gun)
  } catch (err) {
    res.status(500).json({ error: '编辑枪械失败' })
  }
})

router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    await prisma.gun.delete({ where: { id } })
    res.json({ message: '删除成功' })
  } catch (err) {
    res.status(500).json({ error: '删除枪械失败' })
  }
})

export default router
