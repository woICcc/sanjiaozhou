# 三角洲改枪营地 (Delta GunSmith Hub) 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 构建一个 Web 端《三角洲行动》改枪配装库与攻略分享平台

**架构:** React (Vite) 前端 + Express 后端 API + SQLite (Prisma ORM)，JWT 鉴权，RESTful 接口

**Tech Stack:** React 18, Vite, Tailwind CSS 3, Express, Prisma, SQLite, JWT, React Router v6

---

### Task 1: 项目脚手架初始化

**Files:**
- Create: `/d/cc/cc-first/package.json`
- Create: `/d/cc/cc-first/server/package.json`
- Create: `/d/cc/cc-first/server/index.js`
- Create: `/d/cc/cc-first/client/package.json`
- Create: `/d/cc/cc-first/client/vite.config.js`
- Create: `/d/cc/cc-first/client/tailwind.config.js`
- Create: `/d/cc/cc-first/client/postcss.config.js`
- Create: `/d/cc/cc-first/client/index.html`
- Create: `/d/cc/cc-first/client/src/main.jsx`
- Create: `/d/cc/cc-first/client/src/App.jsx`
- Create: `/d/cc/cc-first/client/src/index.css`

- [ ] **Step 1: Create root package.json**

```json
{
  "name": "delta-gunsmith-hub",
  "private": true,
  "scripts": {
    "dev": "concurrently \"npm run dev:server\" \"npm run dev:client\"",
    "dev:server": "cd server && npm run dev",
    "dev:client": "cd client && npm run dev",
    "build": "cd client && npm run build",
    "start": "cd server && npm start"
  },
  "devDependencies": {
    "concurrently": "^8.2.0"
  }
}
```

- [ ] **Step 2: Create server/package.json**

```json
{
  "name": "delta-gunsmith-hub-server",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "node --watch index.js",
    "start": "node index.js",
    "db:push": "npx prisma db push",
    "db:seed": "node seed.js"
  },
  "dependencies": {
    "@prisma/client": "^5.10.0",
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "express": "^4.18.2",
    "jsonwebtoken": "^9.0.2",
    "multer": "^1.4.5-lts.1"
  },
  "devDependencies": {
    "prisma": "^5.10.0"
  }
}
```

- [ ] **Step 3: Create client/package.json**

```json
{
  "name": "delta-gunsmith-hub-client",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "axios": "^1.6.7",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.22.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.55",
    "@types/react-dom": "^18.2.19",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.17",
    "postcss": "^8.4.35",
    "tailwindcss": "^3.4.1",
    "vite": "^5.1.0"
  }
}
```

- [ ] **Step 4: Create client/vite.config.js**

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true
      }
    }
  }
})
```

- [ ] **Step 5: Create Tailwind config files**

```js
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: { 50: '#eff6ff', 100: '#dbeafe', 200: '#bfdbfe', 300: '#93c5fd', 400: '#60a5fa', 500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8', 800: '#1e40af', 900: '#1e3a8a' },
        accent: { 50: '#fff7ed', 100: '#ffedd5', 200: '#fed7aa', 300: '#fdba74', 400: '#fb923c', 500: '#f97316', 600: '#ea580c', 700: '#c2410c', 800: '#9a3412', 900: '#7c2d12' }
      }
    }
  },
  plugins: []
}
```

```js
// postcss.config.js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  }
}
```

- [ ] **Step 6: Create client/index.html**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>三角洲改枪营地</title>
</head>
<body class="bg-gray-50 text-gray-900">
  <div id="root"></div>
  <script type="module" src="/src/main.jsx"></script>
</body>
</html>
```

- [ ] **Step 7: Create client/src/index.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- [ ] **Step 8: Create client/src/main.jsx**

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { AuthProvider } from './context/AuthContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)
```

- [ ] **Step 9: Create client/src/App.jsx (skeleton with routes)**

```jsx
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import GunPlaza from './pages/GunPlaza'
import GunDetail from './pages/GunDetail'
import StrategyList from './pages/StrategyList'
import ArticleDetail from './pages/ArticleDetail'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import Admin from './pages/Admin'

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/guns" element={<GunPlaza />} />
          <Route path="/guns/:id" element={<GunDetail />} />
          <Route path="/articles" element={<StrategyList />} />
          <Route path="/articles/:id" element={<ArticleDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
    </div>
  )
}
```

- [ ] **Step 10: Create server/index.js (skeleton)**

```js
import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.js'
import gunRoutes from './routes/guns.js'
import buildRoutes from './routes/builds.js'
import articleRoutes from './routes/articles.js'
import commentRoutes from './routes/comments.js'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/guns', gunRoutes)
app.use('/api/builds', buildRoutes)
app.use('/api/articles', articleRoutes)
app.use('/api/comments', commentRoutes)

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
```

- [ ] **Step 11: Install dependencies**

Run: `cd /d/cc/cc-first && npm install`
Run: `cd /d/cc/cc-first/server && npm install`
Run: `cd /d/cc/cc-first/client && npm install`

---

### Task 2: 数据库 Schema (Prisma)

**Files:**
- Create: `/d/cc/cc-first/server/prisma/schema.prisma`

- [ ] **Step 1: Create Prisma schema**

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model User {
  id           Int           @id @default(autoincrement())
  username     String        @unique
  email        String        @unique
  passwordHash String
  role         String        @default("user")
  createdAt    DateTime      @default(now())
  builds       Build[]
  articles     Article[]
  buildLikes   BuildLike[]
  articleLikes ArticleLike[]
  comments     Comment[]
}

model Gun {
  id          Int     @id @default(autoincrement())
  name        String  @unique
  type        String
  image       String?
  unlockLevel Int?
  createdAt   DateTime @default(now())
  builds      Build[]
}

model Build {
  id          Int        @id @default(autoincrement())
  gunId       Int
  userId      Int
  name        String
  buildCode   String
  description String?
  screenshot  String?
  likesCount  Int        @default(0)
  createdAt   DateTime   @default(now())
  gun         Gun        @relation(fields: [gunId], references: [id])
  user        User       @relation(fields: [userId], references: [id])
  likes       BuildLike[]
}

model BuildLike {
  id        Int      @id @default(autoincrement())
  buildId   Int
  userId    Int
  likedDate DateTime @default(now())
  build     Build    @relation(fields: [buildId], references: [id])
  user      User     @relation(fields: [userId], references: [id])

  @@unique([buildId, userId, likedDate])
}

model Article {
  id          Int           @id @default(autoincrement())
  userId      Int
  title       String
  content     String
  category    String?
  likesCount  Int           @default(0)
  createdAt   DateTime      @default(now())
  user        User          @relation(fields: [userId], references: [id])
  comments    Comment[]
  likes       ArticleLike[]
}

model ArticleLike {
  id        Int     @id @default(autoincrement())
  articleId Int
  userId    Int
  article   Article @relation(fields: [articleId], references: [id])
  user      User    @relation(fields: [userId], references: [id])

  @@unique([articleId, userId])
}

model Comment {
  id        Int      @id @default(autoincrement())
  articleId Int
  parentId  Int?
  userId    Int
  content   String
  createdAt DateTime @default(now())
  article   Article  @relation(fields: [articleId], references: [id])
  user      User     @relation(fields: [userId], references: [id])
}
```

- [ ] **Step 2: Create .env file for server**

Create `/d/cc/cc-first/server/.env`:
```
DATABASE_URL="file:./dev.db"
JWT_SECRET="delta-gunsmith-secret-key-change-in-production"
```

- [ ] **Step 3: Run Prisma migration**

Run: `cd /d/cc/cc-first/server && npx prisma db push`

---

### Task 3: 认证系统 (后端)

**Files:**
- Create: `/d/cc/cc-first/server/middleware/auth.js`
- Create: `/d/cc/cc-first/server/routes/auth.js`

- [ ] **Step 1: Create auth middleware**

```js
// server/middleware/auth.js
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
```

- [ ] **Step 2: Create auth routes**

```js
// server/routes/auth.js
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
```

---

### Task 4: Auth Context (前端)

**Files:**
- Create: `/d/cc/cc-first/client/src/context/AuthContext.jsx`
- Create: `/d/cc/cc-first/client/src/api/index.js`

- [ ] **Step 1: Create API client**

```js
// client/src/api/index.js
import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api

// API functions
export const authAPI = {
  register: data => api.post('/auth/register', data),
  login: data => api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
}
```

- [ ] **Step 2: Create AuthContext**

```jsx
// client/src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user')
    return saved ? JSON.parse(saved) : null
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      authAPI.me().then(res => {
        setUser(res.data)
        localStorage.setItem('user', JSON.stringify(res.data))
      }).catch(() => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setUser(null)
      }).finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password })
    localStorage.setItem('token', res.data.token)
    localStorage.setItem('user', JSON.stringify(res.data.user))
    setUser(res.data.user)
    return res.data
  }

  const register = async (username, email, password) => {
    const res = await authAPI.register({ username, email, password })
    localStorage.setItem('token', res.data.token)
    localStorage.setItem('user', JSON.stringify(res.data.user))
    setUser(res.data.user)
    return res.data
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
```

---

### Task 5: Navbar 组件

**Files:**
- Create: `/d/cc/cc-first/client/src/components/Navbar.jsx`

- [ ] **Step 1: Create Navbar**

```jsx
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()

  return (
    <nav className="bg-gray-900 text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-orange-400">
          🎯 三角洲改枪营地
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <Link to="/guns" className="hover:text-orange-300">枪械广场</Link>
          <Link to="/articles" className="hover:text-orange-300">攻略</Link>
          {user ? (
            <>
              <Link to="/profile" className="hover:text-orange-300">{user.username}</Link>
              {user.role === 'admin' && <Link to="/admin" className="hover:text-orange-300">管理</Link>}
              <button onClick={logout} className="text-gray-400 hover:text-white">退出</button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-orange-300">登录</Link>
              <Link to="/register" className="bg-orange-500 px-3 py-1 rounded hover:bg-orange-600">注册</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
```

---

### Task 6: 枪械后端 API

**Files:**
- Create: `/d/cc/cc-first/server/routes/guns.js`

- [ ] **Step 1: Create gun routes**

```js
import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { authenticateToken, requireAdmin } from '../middleware/auth.js'

const router = Router()
const prisma = new PrismaClient()

// 获取枪械列表（支持类型筛选）
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

// 获取枪械详情（含 Top5 排行 + 改枪码列表）
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

// 新增枪械 (admin)
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

// 编辑枪械 (admin)
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

// 删除枪械 (admin)
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
```

---

### Task 7: 改枪码后端 API

**Files:**
- Create: `/d/cc/cc-first/server/routes/builds.js`

- [ ] **Step 1: Create build routes**

```js
import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { authenticateToken } from '../middleware/auth.js'

const router = Router()
const prisma = new PrismaClient()

// 发布改枪码
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

// 点赞改枪码
router.post('/:id/like', authenticateToken, async (req, res) => {
  try {
    const buildId = parseInt(req.params.id)
    const userId = req.user.id
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // 检查是否已给该码点过赞
    const existing = await prisma.buildLike.findUnique({
      where: { buildId_userId_likedDate: { buildId, userId, likedDate: today } }
    })
    if (existing) return res.status(400).json({ error: '今天已经支持过了' })

    // 检查今日额度
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

// 获取今日剩余点赞次数
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

// 删除改枪码（作者或admin）
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
```

---

### Task 8: 攻略后端 API

**Files:**
- Create: `/d/cc/cc-first/server/routes/articles.js`

- [ ] **Step 1: Create article routes**

```js
import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { authenticateToken } from '../middleware/auth.js'

const router = Router()
const prisma = new PrismaClient()

// 获取攻略列表
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

// 获取攻略详情
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

// 发布攻略
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

// 点赞/取消赞攻略
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
```

---

### Task 9: 评论后端 API

**Files:**
- Create: `/d/cc/cc-first/server/routes/comments.js`

- [ ] **Step 1: Create comment routes**

```js
import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { authenticateToken } from '../middleware/auth.js'

const router = Router()
const prisma = new PrismaClient()

// 获取评论
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

// 发布评论
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
```

---

### Task 10: 种子数据

**Files:**
- Create: `/d/cc/cc-first/server/seed.js`

- [ ] **Step 1: Create seed script**

```js
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // 创建管理员
  const adminHash = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@delta.com' },
    update: {},
    create: { username: '管理员', email: 'admin@delta.com', passwordHash: adminHash, role: 'admin' }
  })

  // 创建普通用户
  const userHash = await bcrypt.hash('user123', 10)
  const user = await prisma.user.upsert({
    where: { email: 'user@test.com' },
    update: {},
    create: { username: '测试用户', email: 'user@test.com', passwordHash: userHash, role: 'user' }
  })

  // 创建枪械
  const guns = [
    { name: 'M4A1', type: '突击步枪', unlockLevel: 1 },
    { name: 'AK-74', type: '突击步枪', unlockLevel: 4 },
    { name: 'SCAR-H', type: '突击步枪', unlockLevel: 10 },
    { name: 'MP5', type: '冲锋枪', unlockLevel: 2 },
    { name: 'Vector', type: '冲锋枪', unlockLevel: 8 },
    { name: 'SR-25', type: '狙击枪', unlockLevel: 12 },
    { name: 'AWP', type: '狙击枪', unlockLevel: 15 },
    { name: 'M870', type: '霰弹枪', unlockLevel: 6 },
  ]

  for (const gun of guns) {
    await prisma.gun.upsert({
      where: { name: gun.name },
      update: {},
      create: gun
    })
  }

  // 创建示例改枪码
  const m4 = await prisma.gun.findUnique({ where: { name: 'M4A1' } })
  if (m4) {
    await prisma.build.create({
      data: {
        gunId: m4.id, userId: admin.id,
        name: '激光远射 M4', buildCode: 'M4A1-001-LASER-XYZ',
        description: '中远距离压制，后坐力控制优秀'
      }
    })
    await prisma.build.create({
      data: {
        gunId: m4.id, userId: user.id,
        name: '近战速射 M4', buildCode: 'M4A1-002-CQB-ABC',
        description: '近距离高射速，腰射精准'
      }
    })
  }

  const ak = await prisma.gun.findUnique({ where: { name: 'AK-74' } })
  if (ak) {
    await prisma.build.create({
      data: {
        gunId: ak.id, userId: admin.id,
        name: '经典 AK 稳点', buildCode: 'AK74-001-STABLE',
        description: '经典配装，稳扎稳打'
      }
    })
  }

  // 创建示例攻略
  await prisma.article.create({
    data: {
      userId: admin.id, title: 'M4A1 最强配装指南——新赛季必看',
      content: '<h2>M4A1 新赛季配装思路</h2><p>M4A1 在本赛季中依然是最稳定的突击步枪选择。以下是推荐的配装方案...</p><h3>配件选择</h3><ul><li>枪口：消音器</li><li>握把：垂直握把</li><li>瞄准镜：红点</li></ul>',
      category: '武器测评'
    }
  })

  await prisma.article.create({
    data: {
      userId: user.id, title: '长弓溪谷地图打法详解',
      content: '<h2>长弓溪谷攻略</h2><p>长弓溪谷是一张中型地图，主要交战距离为中远距离...</p>',
      category: '地图解析'
    }
  })

  console.log('✅ 种子数据创建成功')
  console.log('管理员: admin@delta.com / admin123')
  console.log('测试用户: user@test.com / user123')
}

main().catch(e => {
  console.error(e)
  process.exit(1)
}).finally(() => prisma.$disconnect())
```

---

### Task 11: 前端页面 - 首页 + 枪械广场

**Files:**
- Create: `/d/cc/cc-first/client/src/pages/Home.jsx`
- Create: `/d/cc/cc-first/client/src/pages/GunPlaza.jsx`
- Create: `/d/cc/cc-first/client/src/components/GunCard.jsx`

- [ ] **Step 1: Create GunCard component**

```jsx
import { Link } from 'react-router-dom'

export default function GunCard({ gun }) {
  const typeColors = {
    '突击步枪': 'bg-blue-100 text-blue-800',
    '冲锋枪': 'bg-green-100 text-green-800',
    '狙击枪': 'bg-red-100 text-red-800',
    '霰弹枪': 'bg-purple-100 text-purple-800',
    '轻机枪': 'bg-yellow-100 text-yellow-800',
    '射手步枪': 'bg-indigo-100 text-indigo-800',
  }

  return (
    <Link to={`/guns/${gun.id}`} className="block bg-white rounded-xl shadow-sm hover:shadow-md transition p-4 border border-gray-100">
      <div className="text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-3 flex items-center justify-center text-3xl">
          🔫
        </div>
        <h3 className="font-semibold text-lg">{gun.name}</h3>
        <span className={`inline-block text-xs px-2 py-0.5 rounded-full mt-1 ${typeColors[gun.type] || 'bg-gray-100'}`}>
          {gun.type}
        </span>
        {gun.unlockLevel && <p className="text-xs text-gray-400 mt-1">解锁等级 {gun.unlockLevel}</p>}
      </div>
    </Link>
  )
}
```

- [ ] **Step 2: Create Home page**

```jsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api'
import GunCard from '../components/GunCard'

export default function Home() {
  const [guns, setGuns] = useState([])
  const [articles, setArticles] = useState([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    api.get('/guns').then(res => setGuns(res.data))
    api.get('/articles?sort=hot').then(res => setArticles(res.data.slice(0, 5)))
  }, [])

  const filtered = guns.filter(g => g.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div>
      {/* Hero */}
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">🎯 三角洲改枪营地</h1>
        <p className="text-gray-500 mb-6">寻找最强配装，分享你的改枪方案</p>
        <input
          type="text" placeholder="搜索枪械..."
          value={search} onChange={e => setSearch(e.target.value)}
          className="w-full max-w-md px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
      </div>

      {/* 热门枪械 */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">🔥 热门枪械</h2>
          <Link to="/guns" className="text-sm text-orange-500 hover:underline">查看全部 →</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filtered.slice(0, 6).map(gun => <GunCard key={gun.id} gun={gun} />)}
        </div>
      </section>

      {/* 热门攻略 */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">📝 热门攻略</h2>
          <Link to="/articles" className="text-sm text-orange-500 hover:underline">查看全部 →</Link>
        </div>
        <div className="space-y-3">
          {articles.map(a => (
            <Link key={a.id} to={`/articles/${a.id}`} className="block bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition border border-gray-100">
              <h3 className="font-semibold">{a.title}</h3>
              <p className="text-sm text-gray-400 mt-1">
                {a.user?.username} · 👍 {a.likesCount} · 💬 {a.commentCount || 0}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
```

- [ ] **Step 3: Create GunPlaza page**

```jsx
import { useState, useEffect } from 'react'
import api from '../api'
import GunCard from '../components/GunCard'

const types = ['全部', '突击步枪', '冲锋枪', '狙击枪', '霰弹枪', '轻机枪', '射手步枪']

export default function GunPlaza() {
  const [guns, setGuns] = useState([])
  const [type, setType] = useState('全部')
  const [search, setSearch] = useState('')

  useEffect(() => {
    const params = type !== '全部' ? { type } : {}
    api.get('/guns', { params }).then(res => setGuns(res.data))
  }, [type])

  const filtered = guns.filter(g => g.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">🔫 枪械广场</h1>
      <div className="flex flex-wrap gap-2 mb-6">
        {types.map(t => (
          <button key={t} onClick={() => setType(t)}
            className={`px-3 py-1.5 rounded-full text-sm ${type === t ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
            {t}
          </button>
        ))}
      </div>
      <input type="text" placeholder="搜索枪械..." value={search} onChange={e => setSearch(e.target.value)}
        className="w-full max-w-md px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 mb-6" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filtered.map(gun => <GunCard key={gun.id} gun={gun} />)}
      </div>
    </div>
  )
}
```

---

### Task 12: 前端页面 - 枪械专区详情页

**Files:**
- Create: `/d/cc/cc-first/client/src/pages/GunDetail.jsx`
- Create: `/d/cc/cc-first/client/src/components/TopFiveCard.jsx`
- Create: `/d/cc/cc-first/client/src/components/BuildCard.jsx`
- Create: `/d/cc/cc-first/client/src/components/LikeButton.jsx`

- [ ] **Step 1: Create TopFiveCard**

```jsx
export default function TopFiveCard({ build, rank }) {
  return (
    <div className="flex items-center gap-3 bg-gradient-to-r from-yellow-50 to-orange-50 p-3 rounded-lg border border-yellow-200">
      <span className="text-2xl font-bold text-orange-500 w-8">#{rank}</span>
      <div className="flex-1 min-w-0">
        <p className="font-semibold truncate">{build.name}</p>
        <p className="text-xs text-gray-500">{build.user?.username}</p>
      </div>
      <div className="text-right">
        <p className="text-sm font-bold text-orange-500">👍 {build.likesCount}</p>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create LikeButton**

```jsx
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api'

export default function LikeButton({ buildId, initialLikes, onLike }) {
  const { user } = useAuth()
  const [likes, setLikes] = useState(initialLikes)
  const [loading, setLoading] = useState(false)

  const handleLike = async () => {
    if (!user) { alert('请先登录'); return }
    setLoading(true)
    try {
      const res = await api.post(`/builds/${buildId}/like`)
      setLikes(res.data.likesCount)
      onLike?.(res.data.likesCount)
    } catch (err) {
      alert(err.response?.data?.error || '操作失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button onClick={handleLike} disabled={loading}
      className="flex items-center gap-1 text-sm px-3 py-1 rounded-full border hover:bg-orange-50 disabled:opacity-50">
      👍 <span>{likes}</span>
    </button>
  )
}
```

- [ ] **Step 3: Create BuildCard**

```jsx
import LikeButton from './LikeButton'

export default function BuildCard({ build }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold">{build.name}</h3>
          <p className="text-xs text-gray-400 mt-0.5">
            {build.user?.username} · {new Date(build.createdAt).toLocaleDateString()}
          </p>
        </div>
        <LikeButton buildId={build.id} initialLikes={build.likesCount} />
      </div>
      {build.description && <p className="text-sm text-gray-600 mt-2">{build.description}</p>}
      <div className="mt-2 flex items-center gap-2">
        <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono flex-1 truncate">{build.buildCode}</code>
        <button onClick={() => { navigator.clipboard.writeText(build.buildCode); alert('已复制！') }}
          className="text-xs bg-gray-800 text-white px-2 py-1 rounded hover:bg-gray-700 shrink-0">
          复制
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Create GunDetail page**

```jsx
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api'
import { useAuth } from '../context/AuthContext'
import TopFiveCard from '../components/TopFiveCard'
import BuildCard from '../components/BuildCard'

export default function GunDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const [gun, setGun] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', buildCode: '', description: '' })
  const [todayLikes, setTodayLikes] = useState({ used: 0, remaining: 10 })

  useEffect(() => {
    api.get(`/guns/${id}`).then(res => setGun(res.data))
    if (user) {
      api.get('/builds/likes/today').then(res => setTodayLikes(res.data))
    }
  }, [id, user])

  const submitBuild = async (e) => {
    e.preventDefault()
    try {
      await api.post('/builds', { gunId: id, ...form })
      setForm({ name: '', buildCode: '', description: '' })
      setShowForm(false)
      const res = await api.get(`/guns/${id}`)
      setGun(res.data)
    } catch (err) {
      alert(err.response?.data?.error || '发布失败')
    }
  }

  if (!gun) return <div className="text-center py-12 text-gray-400">加载中...</div>

  return (
    <div>
      {/* 枪械头部 */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-3xl">🔫</div>
          <div>
            <h1 className="text-2xl font-bold">{gun.name}</h1>
            <p className="text-gray-500">{gun.type}{gun.unlockLevel ? ` · 解锁等级 ${gun.unlockLevel}` : ''}</p>
          </div>
        </div>
      </div>

      {/* Top5 */}
      <section className="mb-6">
        <h2 className="text-lg font-bold mb-3">🏆 Top 5 排行</h2>
        {gun.topBuilds?.length > 0 ? (
          <div className="space-y-2">
            {gun.topBuilds.map((b, i) => <TopFiveCard key={b.id} build={b} rank={i + 1} />)}
          </div>
        ) : (
          <p className="text-gray-400 text-sm">暂无改枪方案</p>
        )}
      </section>

      {/* 今日额度 */}
      {user && (
        <div className="text-sm text-gray-500 mb-4">
          今日点赞: {todayLikes.used}/10
        </div>
      )}

      {/* 发布入口 */}
      <div className="mb-6">
        <button onClick={() => setShowForm(!showForm)}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition">
          {showForm ? '取消' : '📤 分享我的改枪码'}
        </button>
      </div>

      {/* 发布表单 */}
      {showForm && (
        <form onSubmit={submitBuild} className="bg-white p-4 rounded-xl shadow-sm mb-6 border border-gray-100 space-y-3">
          <input type="text" placeholder="改枪码名称（如：激光远射M4）" value={form.name} required
            onChange={e => setForm({ ...form, name: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
          <input type="text" placeholder="改枪码本体（字符串）" value={form.buildCode} required
            onChange={e => setForm({ ...form, buildCode: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 font-mono" />
          <textarea placeholder="配装思路（可选）" value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" rows={2} />
          <button type="submit" className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 text-sm">发布</button>
        </form>
      )}

      {/* 改枪码列表 */}
      <h2 className="text-lg font-bold mb-3">📋 全部配装方案</h2>
      <div className="space-y-3">
        {gun.builds?.map(b => <BuildCard key={b.id} build={b} />)}
      </div>
    </div>
  )
}
```

---

### Task 13: 前端页面 - 攻略 + 帖子详情 + 评论

**Files:**
- Create: `/d/cc/cc-first/client/src/pages/StrategyList.jsx`
- Create: `/d/cc/cc-first/client/src/pages/ArticleDetail.jsx`

- [ ] **Step 1: Create StrategyList page**

```jsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api'

const categories = ['全部', '活动速通', '武器测评', '干员技巧', '地图解析']

export default function StrategyList() {
  const [articles, setArticles] = useState([])
  const [category, setCategory] = useState('全部')
  const [sort, setSort] = useState('new')

  useEffect(() => {
    const params = {}
    if (category !== '全部') params.category = category
    if (sort === 'hot') params.sort = 'hot'
    api.get('/articles', { params }).then(res => setArticles(res.data))
  }, [category, sort])

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">📝 攻略</h1>
        <Link to="/articles/new" className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-orange-600">发布攻略</Link>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {categories.map(c => (
          <button key={c} onClick={() => setCategory(c)}
            className={`px-3 py-1.5 rounded-full text-sm ${category === c ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
            {c}
          </button>
        ))}
      </div>

      <div className="flex gap-2 mb-6">
        <button onClick={() => setSort('new')} className={`px-3 py-1.5 rounded-lg text-sm ${sort === 'new' ? 'bg-gray-800 text-white' : 'bg-gray-200'}`}>最新发布</button>
        <button onClick={() => setSort('hot')} className={`px-3 py-1.5 rounded-lg text-sm ${sort === 'hot' ? 'bg-gray-800 text-white' : 'bg-gray-200'}`}>最多点赞</button>
      </div>

      <div className="space-y-3">
        {articles.map(a => (
          <Link key={a.id} to={`/articles/${a.id}`} className="block bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition border border-gray-100">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold">{a.title}</h3>
                <p className="text-xs text-gray-400 mt-1">{a.user?.username} · {new Date(a.createdAt).toLocaleDateString()}</p>
              </div>
              {a.category && <span className="text-xs bg-gray-100 px-2 py-1 rounded-full shrink-0">{a.category}</span>}
            </div>
            <div className="flex gap-4 mt-2 text-xs text-gray-400">
              <span>👍 {a.likesCount}</span>
              <span>💬 {a.commentCount || 0}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create ArticleDetail page**

```jsx
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api'
import { useAuth } from '../context/AuthContext'

export default function ArticleDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [article, setArticle] = useState(null)
  const [comment, setComment] = useState('')

  const fetchArticle = () => {
    api.get(`/articles/${id}`).then(res => setArticle(res.data))
  }

  useEffect(() => { fetchArticle() }, [id])

  const handleLike = async () => {
    if (!user) { alert('请先登录'); return }
    try {
      const res = await api.post(`/articles/${id}/like`)
      setArticle(prev => ({ ...prev, liked: res.data.liked, likesCount: res.data.likesCount }))
    } catch (err) {
      alert(err.response?.data?.error || '操作失败')
    }
  }

  const submitComment = async (e) => {
    e.preventDefault()
    if (!user) { alert('请先登录'); return }
    try {
      await api.post(`/comments/articles/${id}`, { content: comment })
      setComment('')
      fetchArticle()
    } catch (err) {
      alert(err.response?.data?.error || '评论失败')
    }
  }

  if (!article) return <div className="text-center py-12 text-gray-400">加载中...</div>

  return (
    <div>
      <article className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-6">
        <h1 className="text-2xl font-bold mb-2">{article.title}</h1>
        <div className="text-sm text-gray-400 mb-4">
          {article.user?.username} · {new Date(article.createdAt).toLocaleDateString()}
          {article.category && <span className="ml-2 bg-gray-100 px-2 py-0.5 rounded-full">{article.category}</span>}
        </div>
        <div className="prose prose-sm max-w-none mb-4" dangerouslySetInnerHTML={{ __html: article.content }} />
        <button onClick={handleLike}
          className={`flex items-center gap-1 text-sm px-3 py-1.5 rounded-full border transition ${article.liked ? 'bg-red-50 border-red-200 text-red-600' : 'hover:bg-gray-50'}`}>
          {article.liked ? '❤️' : '🤍'} {article.likesCount}
        </button>
      </article>

      {/* 评论区 */}
      <section className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-lg font-bold mb-4">💬 评论 ({article.comments?.length || 0})</h2>

        {user && (
          <form onSubmit={submitComment} className="mb-6">
            <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="写下你的评论..." required
              className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" rows={2} />
            <button type="submit" className="mt-2 bg-gray-800 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-gray-700">发布评论</button>
          </form>
        )}

        <div className="space-y-3">
          {article.comments?.filter(c => !c.parentId).map(c => (
            <div key={c.id} className="border-b border-gray-100 pb-3">
              <p className="text-sm"><strong>{c.user?.username}</strong> <span className="text-xs text-gray-400 ml-2">{new Date(c.createdAt).toLocaleString()}</span></p>
              <p className="text-sm mt-1">{c.content}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
```

---

### Task 14: 前端页面 - 登录 + 注册 + 个人中心

**Files:**
- Create: `/d/cc/cc-first/client/src/pages/Login.jsx`
- Create: `/d/cc/cc-first/client/src/pages/Register.jsx`
- Create: `/d/cc/cc-first/client/src/pages/Profile.jsx`

- [ ] **Step 1: Create Login page**

```jsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || '登录失败')
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-10">
      <h1 className="text-2xl font-bold text-center mb-6">登录</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <input type="email" placeholder="邮箱" value={email} onChange={e => setEmail(e.target.value)} required
          className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
        <input type="password" placeholder="密码" value={password} onChange={e => setPassword(e.target.value)} required
          className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
        <button type="submit" className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600">登录</button>
        <p className="text-sm text-center text-gray-500">没有账号？<Link to="/register" className="text-orange-500 hover:underline">注册</Link></p>
      </form>
    </div>
  )
}
```

- [ ] **Step 2: Create Register page**

```jsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirm) { setError('两次密码不一致'); return }
    try {
      await register(form.username, form.email, form.password)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || '注册失败')
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-10">
      <h1 className="text-2xl font-bold text-center mb-6">注册</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <input type="text" placeholder="用户名" value={form.username} onChange={e => setForm({...form, username: e.target.value})} required
          className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
        <input type="email" placeholder="邮箱" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required
          className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
        <input type="password" placeholder="密码" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required
          className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
        <input type="password" placeholder="确认密码" value={form.confirm} onChange={e => setForm({...form, confirm: e.target.value})} required
          className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
        <button type="submit" className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600">注册</button>
        <p className="text-sm text-center text-gray-500">已有账号？<Link to="/login" className="text-orange-500 hover:underline">登录</Link></p>
      </form>
    </div>
  )
}
```

- [ ] **Step 3: Create Profile page**

```jsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Profile() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const [builds, setBuilds] = useState([])
  const [articles, setArticles] = useState([])
  const [likesLeft, setLikesLeft] = useState(10)

  useEffect(() => {
    if (!loading && !user) { navigate('/login'); return }
    if (!user) return
    api.get('/builds/likes/today').then(res => setLikesLeft(res.data.remaining)).catch(() => {})
  }, [user, loading])

  if (loading || !user) return <div className="text-center py-12 text-gray-400">加载中...</div>

  return (
    <div>
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-6">
        <h1 className="text-2xl font-bold mb-2">{user.username}</h1>
        <p className="text-sm text-gray-400">{user.email} · 今日剩余点赞 {likesLeft} 次</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="font-bold mb-3">我的改枪码</h2>
          <p className="text-sm text-gray-400">功能开发中...</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="font-bold mb-3">我的攻略</h2>
          <p className="text-sm text-gray-400">功能开发中...</p>
        </div>
      </div>
    </div>
  )
}
```

---

### Task 15: 管理后台

**Files:**
- Create: `/d/cc/cc-first/client/src/pages/Admin.jsx`

- [ ] **Step 1: Create Admin page**

```jsx
import { useState, useEffect } from 'react'
import api from '../api'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const types = ['突击步枪', '冲锋枪', '狙击枪', '霰弹枪', '轻机枪', '射手步枪']

export default function Admin() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const [guns, setGuns] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', type: '突击步枪', image: '', unlockLevel: '' })

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) { navigate('/'); return }
    api.get('/guns').then(res => setGuns(res.data))
  }, [user, loading])

  const submitGun = async (e) => {
    e.preventDefault()
    try {
      await api.post('/guns', form)
      setForm({ name: '', type: '突击步枪', image: '', unlockLevel: '' })
      setShowForm(false)
      const res = await api.get('/guns')
      setGuns(res.data)
    } catch (err) {
      alert(err.response?.data?.error || '新增失败')
    }
  }

  const deleteGun = async (id) => {
    if (!confirm('确定删除？')) return
    try {
      await api.delete(`/guns/${id}`)
      setGuns(guns.filter(g => g.id !== id))
    } catch (err) {
      alert(err.response?.data?.error || '删除失败')
    }
  }

  if (loading) return <div className="text-center py-12 text-gray-400">加载中...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">⚙️ 管理后台</h1>
        <button onClick={() => setShowForm(!showForm)}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-orange-600">
          {showForm ? '取消' : '+ 新增枪械'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={submitGun} className="bg-white p-4 rounded-xl shadow-sm mb-6 border border-gray-100 space-y-3">
          <input type="text" placeholder="枪械名称" value={form.name} required
            onChange={e => setForm({...form, name: e.target.value})}
            className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
          <select value={form.type} onChange={e => setForm({...form, type: e.target.value})}
            className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400">
            {types.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <input type="number" placeholder="解锁等级" value={form.unlockLevel} onChange={e => setForm({...form, unlockLevel: e.target.value})}
            className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
          <button type="submit" className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-700">新增</button>
        </form>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3">名称</th>
              <th className="text-left px-4 py-3">类型</th>
              <th className="text-left px-4 py-3">解锁等级</th>
              <th className="text-right px-4 py-3">操作</th>
            </tr>
          </thead>
          <tbody>
            {guns.map(gun => (
              <tr key={gun.id} className="border-t border-gray-100">
                <td className="px-4 py-3 font-medium">{gun.name}</td>
                <td className="px-4 py-3 text-gray-500">{gun.type}</td>
                <td className="px-4 py-3 text-gray-500">{gun.unlockLevel || '-'}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => deleteGun(gun.id)} className="text-red-500 hover:underline text-xs">删除</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
```

---

### Task 16: 集成测试与验证

- [ ] **Step 1: 验证后端启动**

Run: `cd /d/cc/cc-first/server && node index.js`
Expected: 终端输出 `Server running on http://localhost:3001`

- [ ] **Step 2: 验证数据库和种子数据**

Run (new terminal): `cd /d/cc/cc-first/server && node seed.js`
Expected: 输出种子数据创建成功

- [ ] **Step 3: 验证前端启动**

Run: `cd /d/cc/cc-first/client && npm run dev`
Expected: Vite 启动在 http://localhost:5173

- [ ] **Step 4: 验证 API 端点**

Run: `curl http://localhost:3001/api/guns`
Expected: 返回枪械 JSON 数据
