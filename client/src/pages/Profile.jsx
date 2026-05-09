import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'
import { useAuth } from '../context/AuthContext'

export default function Profile() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
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
