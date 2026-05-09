import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'
import { useAuth } from '../context/AuthContext'

const categories = ['活动速通', '武器测评', '干员技巧', '地图解析']

export default function NewArticle() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ title: '', content: '', category: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (loading) return null
  if (!user) { navigate('/login'); return null }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title || !form.content) { setError('标题和正文为必填'); return }
    setSubmitting(true)
    setError('')
    try {
      const res = await api.post('/articles', form)
      navigate(`/articles/${res.data.id}`)
    } catch (err) {
      setError(err.response?.data?.error || '发布失败')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">📝 发布攻略</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 space-y-4">
        {error && <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded">{error}</p>}

        <input type="text" placeholder="标题" value={form.title} required
          onChange={e => setForm({ ...form, title: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg text-lg font-medium focus:outline-none focus:ring-2 focus:ring-orange-400" />

        <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400">
          <option value="">选择分类（可选）</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <textarea placeholder="正文内容（支持HTML）" value={form.content} required rows={12}
          onChange={e => setForm({ ...form, content: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 font-mono" />

        <div className="text-xs text-gray-400">
          支持 HTML 标签，如 &lt;h2&gt;、&lt;p&gt;、&lt;ul&gt;、&lt;li&gt; 等
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={submitting}
            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 disabled:opacity-50">
            {submitting ? '发布中...' : '发布'}
          </button>
          <button type="button" onClick={() => navigate('/articles')}
            className="text-gray-500 px-4 py-2 rounded-lg hover:bg-gray-100">取消</button>
        </div>
      </form>
    </div>
  )
}
