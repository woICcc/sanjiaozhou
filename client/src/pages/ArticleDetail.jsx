import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api'
import { useAuth } from '../context/AuthContext'

export default function ArticleDetail() {
  const { id } = useParams()
  const { user } = useAuth()
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
