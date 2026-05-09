import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { authenticateToken } from '../middleware/auth.js'

const router = Router()
const prisma = new PrismaClient()

router.get('/', async (req, res) => {
  try {
    const { category, sort } = req.query
    const where = category ? { category } : {}
    const orderBy = sort === 'hot' ? { likesCount: 'desc' } : { createdAt: 'desc' }

    const articles = await prisma.article.findMany({
      where,
      orderBy,
      include: {
        user: { select: { id: true, username: true } },
        _count: { select: { comments: true } }
      }
    })
    res.json(articles.map(a => ({ ...a, commentCount: a._count.comments })))
  } catch (err) {
    res.status(500).json({ error: '获取攻略列表失败' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const article = await prisma.article.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, username: true } },
        comments: {
          include: { user: { select: { id: true, username: true } } },
          orderBy: { createdAt: 'asc' }
        }
      }
    })
    if (!article) return res.status(404).json({ error: '帖子不存在' })
    res.json(article)
  } catch (err) {
    res.status(500).json({ error: '获取帖子失败' })
  }
})

router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, content, category } = req.body
    if (!title || !content) return res.status(400).json({ error: '标题和正文为必填' })

    const article = await prisma.article.create({
      data: { userId: req.user.id, title, content, category },
      include: { user: { select: { id: true, username: true } } }
    })
    res.status(201).json(article)
  } catch (err) {
    res.status(500).json({ error: '发布失败' })
  }
})

router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const article = await prisma.article.findUnique({ where: { id } })
    if (!article) return res.status(404).json({ error: '帖子不存在' })
    if (article.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: '无权编辑' })
    }

    const { title, content, category } = req.body
    const updated = await prisma.article.update({
      where: { id },
      data: { title, content, category }
    })
    res.json(updated)
  } catch (err) {
    res.status(500).json({ error: '编辑失败' })
  }
})

router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const article = await prisma.article.findUnique({ where: { id } })
    if (!article) return res.status(404).json({ error: '帖子不存在' })
    if (article.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: '无权删除' })
    }

    await prisma.article.delete({ where: { id } })
    res.json({ message: '删除成功' })
  } catch (err) {
    res.status(500).json({ error: '删除失败' })
  }
})

router.post('/:id/like', authenticateToken, async (req, res) => {
  try {
    const articleId = parseInt(req.params.id)
    const userId = req.user.id

    const existing = await prisma.articleLike.findUnique({
      where: { articleId_userId: { articleId, userId } }
    })

    if (existing) {
      await prisma.articleLike.delete({ where: { id: existing.id } })
      await prisma.article.update({ where: { id: articleId }, data: { likesCount: { decrement: 1 } } })
    } else {
      await prisma.articleLike.create({ data: { articleId, userId } })
      await prisma.article.update({ where: { id: articleId }, data: { likesCount: { increment: 1 } } })
    }

    const article = await prisma.article.findUnique({ where: { id: articleId } })
    res.json({ liked: !existing, likesCount: article.likesCount })
  } catch (err) {
    res.status(500).json({ error: '操作失败' })
  }
})

export default router
