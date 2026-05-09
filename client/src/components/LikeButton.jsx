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
