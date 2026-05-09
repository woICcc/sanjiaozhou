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
