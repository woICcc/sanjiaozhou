import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.js'
import gunRoutes from './routes/guns.js'
import buildRoutes from './routes/builds.js'
import articleRoutes from './routes/articles.js'
import commentRoutes from './routes/comments.js'
import userRoutes from './routes/user.js'
import uploadRoutes from './routes/upload.js'
import path from 'path'
import { fileURLToPath } from 'url'

const app = express()
const PORT = process.env.PORT || 3001

const __dirname = path.dirname(fileURLToPath(import.meta.url))

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/guns', gunRoutes)
app.use('/api/builds', buildRoutes)
app.use('/api/articles', articleRoutes)
app.use('/api/comments', commentRoutes)
app.use('/api/user', userRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
