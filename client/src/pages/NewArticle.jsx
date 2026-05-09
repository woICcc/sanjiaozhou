import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'
import { useAuth } from '../context/AuthContext'

const categories = ['活动速通', '武器测评', '干员技巧', '地图解析']

const TOOLBAR_ITEMS = [
  { label: 'H2', tag: '<h2>$1</h2>', desc: '标题' },
  { label: 'H3', tag: '<h3>$1</h3>', desc: '子标题' },
  { label: 'B', tag: '<strong>$1</strong>', desc: '加粗' },
  { label: 'i', tag: '<em>$1</em>', desc: '斜体' },
  { label: '•', tag: '<li>$1</li>', desc: '列表项' },
  { label: '🔗', tag: '<a href="$1">链接</a>', desc: '链接' },
]

export default function NewArticle() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const textRef = useRef(null)
  const fileRef = useRef(null)
  const [form, setForm] = useState({ title: '', content: '', category: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [uploading, setUploading] = useState(false)

  if (loading) return null
  if (!user) { navigate('/login'); return null }

  const insertTag = (template) => {
    const ta = textRef.current
    if (!ta) return
    const start = ta.selectionStart
    const end = ta.selectionEnd
    const selected = form.content.substring(start, end) || '内容'
    const before = form.content.substring(0, start)
    const after = form.content.substring(end)

    if (template === '<a href="$1">链接</a>') {
      const url = prompt('输入链接地址:', 'https://')
      if (!url) return
      setForm({ ...form, content: before + `<a href="${url}">${selected}</a>` + after })
    } else {
      const html = template.replace('$1', selected)
      setForm({ ...form, content: before + html + after })
    }
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) { setError('只支持图片文件'); return }
    if (file.size > 5 * 1024 * 1024) { setError('图片不能超过5MB'); return }

    setUploading(true)
    setError('')
    try {
      const fd = new FormData()
      fd.append('image', file)
      const res = await api.post('/upload', fd)
      const ta = textRef.current
      const start = ta?.selectionStart || form.content.length
      const before = form.content.substring(0, start)
      const after = form.content.substring(start)
      setForm({ ...form, content: before + `<img src="${res.data.url}" alt="image" style="max-width:100%">` + after })
    } catch (err) {
      setError(err.response?.data?.error || '上传失败')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

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

        {/* 工具栏 */}
        <div className="flex items-center gap-1 p-1.5 border rounded-lg bg-gray-50 flex-wrap">
          {TOOLBAR_ITEMS.map(item => (
            <button key={item.label} type="button" onClick={() => insertTag(item.tag)}
              title={item.desc}
              className="px-2.5 py-1 text-sm rounded hover:bg-white hover:shadow-sm transition font-mono">
              {item.label}
            </button>
          ))}
          <span className="w-px h-5 bg-gray-300 mx-1" />
          <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
            title="插入图片"
            className="px-2.5 py-1 text-sm rounded hover:bg-white hover:shadow-sm transition">
            {uploading ? '上传中...' : '🖼️ 图片'}
          </button>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
        </div>

        {/* 编辑器 */}
        <textarea ref={textRef} placeholder="正文内容..." value={form.content} required rows={14}
          onChange={e => setForm({ ...form, content: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 leading-relaxed"
          style={{ minHeight: '300px' }} />

        {/* 预览 */}
        {form.content && (
          <div>
            <p className="text-xs text-gray-400 mb-1">预览：</p>
            <div className="prose prose-sm max-w-none border rounded-lg p-4 bg-gray-50"
                 dangerouslySetInnerHTML={{ __html: form.content }} />
          </div>
        )}

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
