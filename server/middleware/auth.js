import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'delta-gunsmith-secret-key-change-in-production'

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (!token) return res.status(401).json({ error: '未登录' })

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    next()
  } catch {
    return res.status(403).json({ error: '登录已过期' })
  }
}

export function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: '需要管理员权限' })
  }
  next()
}

export { JWT_SECRET }
