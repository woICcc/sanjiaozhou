import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { authenticateToken } from '../middleware/auth.js'

const router = Router()
const prisma = new PrismaClient()

// 我的改枪码
router.get('/builds', authenticateToken, async (req, res) => {
  try {
    const builds = await prisma.build.findMany({
      where: { userId: req.user.id },
      include: {
        gun: { select: { id: true, name: true, type: true } },
        _count: { select: { likes: true } }
      },
      orderBy: { createdAt: 'desc' }
    })
    res.json(builds)
  } catch (err) {
    res.status(500).json({ error: '获取失败' })
  }
})

// 我的攻略
router.get('/articles', authenticateToken, async (req, res) => {
  try {
    const articles = await prisma.article.findMany({
      where: { userId: req.user.id },
      include: {
        _count: { select: { comments: true } }
      },
      orderBy: { createdAt: 'desc' }
    })
    res.json(articles.map(a => ({ ...a, commentCount: a._count.comments })))
  } catch (err) {
    res.status(500).json({ error: '获取失败' })
  }
})

// 我点赞过的改枪码
router.get('/liked-builds', authenticateToken, async (req, res) => {
  try {
    const likes = await prisma.buildLike.findMany({
      where: { userId: req.user.id },
      include: {
        build: {
          include: {
            gun: { select: { id: true, name: true } },
            user: { select: { id: true, username: true } }
          }
        }
      },
      orderBy: { likedDate: 'desc' }
    })
    res.json(likes.map(l => l.build))
  } catch (err) {
    res.status(500).json({ error: '获取失败' })
  }
})

// 我点赞过的攻略
router.get('/liked-articles', authenticateToken, async (req, res) => {
  try {
    const likes = await prisma.articleLike.findMany({
      where: { userId: req.user.id },
      include: {
        article: {
          include: {
            user: { select: { id: true, username: true } },
            _count: { select: { comments: true } }
          }
        }
      },
      orderBy: { id: 'desc' }
    })
    res.json(likes.map(l => ({ ...l.article, commentCount: l.article._count.comments })))
  } catch (err) {
    res.status(500).json({ error: '获取失败' })
  }
})

export default router
