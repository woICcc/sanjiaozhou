import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { authenticateToken } from '../middleware/auth.js'

const router = Router()
const prisma = new PrismaClient()

router.get('/articles/:articleId', async (req, res) => {
  try {
    const articleId = parseInt(req.params.articleId)
    const comments = await prisma.comment.findMany({
      where: { articleId },
      include: { user: { select: { id: true, username: true } } },
      orderBy: { createdAt: 'asc' }
    })
    res.json(comments)
  } catch (err) {
    res.status(500).json({ error: '获取评论失败' })
  }
})

router.post('/articles/:articleId', authenticateToken, async (req, res) => {
  try {
    const articleId = parseInt(req.params.articleId)
    const { content, parentId } = req.body
    if (!content) return res.status(400).json({ error: '评论内容不能为空' })

    const comment = await prisma.comment.create({
      data: { articleId, userId: req.user.id, content, parentId: parentId || null },
      include: { user: { select: { id: true, username: true } } }
    })
    res.status(201).json(comment)
  } catch (err) {
    res.status(500).json({ error: '评论失败' })
  }
})

export default router
