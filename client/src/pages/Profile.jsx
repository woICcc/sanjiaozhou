import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api'
import { useAuth } from '../context/AuthContext'

const tabs = [
  { key: 'my-builds', label: '我的改枪码' },
  { key: 'my-articles', label: '我的攻略' },
  { key: 'liked-builds', label: '收藏的改枪码' },
  { key: 'liked-articles', label: '收藏的帖子' },
]

export default function Profile() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('my-builds')
  const [data, setData] = useState({})
  const [likesLeft, setLikesLeft] = useState(10)

  useEffect(() => {
    if (!loading && !user) { navigate('/login'); return }
    if (!user) return
    api.get('/builds/likes/today').then(res => setLikesLeft(res.data.remaining)).catch(() => {})
  }, [user, loading])

  useEffect(() => {
    if (!user) return
    const fetcher = {
      'my-builds': () => api.get('/user/builds'),
      'my-articles': () => api.get('/user/articles'),
      'liked-builds': () => api.get('/user/liked-builds'),
      'liked-articles': () => api.get('/user/liked-articles'),
    }[tab]
    if (fetcher) {
      fetcher().then(res => setData(prev => ({ ...prev, [tab]: res.data }))).catch(() => {})
    }
  }, [tab, user])

  if (loading || !user) return <div className="text-center py-12 text-gray-400">加载中...</div>

  return (
    <div>
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-6">
        <h1 className="text-2xl font-bold mb-1">{user.username}</h1>
        <p className="text-sm text-gray-400">{user.email} · 今日剩余点赞 {likesLeft} 次</p>
      </div>

      {/* 标签页 */}
      <div className="flex gap-1 mb-6 border-b border-gray-200 overflow-x-auto">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition ${tab === t.key ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            {t.label}
            {data[t.key]?.length > 0 && <span className="ml-1 text-xs text-gray-400">({data[t.key].length})</span>}
          </button>
        ))}
      </div>

      {/* 我的改枪码 */}
      {tab === 'my-builds' && (
        <div className="space-y-3">
          {data['my-builds']?.length === 0 && <p className="text-gray-400 text-sm">还没有发布改枪码</p>}
          {data['my-builds']?.map(b => (
            <div key={b.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{b.name}</h3>
                  <p className="text-xs text-gray-400">{b.gun?.name} · {new Date(b.createdAt).toLocaleDateString()}</p>
                </div>
                <span className="text-xs text-gray-400">👍 {b.likesCount}</span>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono flex-1 truncate">{b.buildCode}</code>
                <button onClick={() => { navigator.clipboard.writeText(b.buildCode); alert('已复制！') }}
                  className="text-xs bg-gray-800 text-white px-2 py-1 rounded hover:bg-gray-700 shrink-0">复制</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 我的攻略 */}
      {tab === 'my-articles' && (
        <div className="space-y-3">
          {data['my-articles']?.length === 0 && <p className="text-gray-400 text-sm">还没有发布攻略</p>}
          {data['my-articles']?.map(a => (
            <Link key={a.id} to={`/articles/${a.id}`} className="block bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
              <h3 className="font-semibold">{a.title}</h3>
              <p className="text-xs text-gray-400 mt-1">{a.category} · {new Date(a.createdAt).toLocaleDateString()} · 👍 {a.likesCount} · 💬 {a.commentCount || 0}</p>
            </Link>
          ))}
        </div>
      )}

      {/* 收藏的改枪码 */}
      {tab === 'liked-builds' && (
        <div className="space-y-3">
          {data['liked-builds']?.length === 0 && <p className="text-gray-400 text-sm">还没有收藏改枪码</p>}
          {data['liked-builds']?.map(b => (
            <div key={b.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <Link to={`/guns/${b.gunId}`} className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{b.name}</h3>
                  <p className="text-xs text-gray-400">{b.gun?.name} · {b.user?.username} · {new Date(b.createdAt).toLocaleDateString()}</p>
                </div>
                <span className="text-xs text-gray-400">👍 {b.likesCount}</span>
              </Link>
              <div className="mt-2 flex items-center gap-2">
                <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono flex-1 truncate">{b.buildCode}</code>
                <button onClick={() => { navigator.clipboard.writeText(b.buildCode); alert('已复制！') }}
                  className="text-xs bg-gray-800 text-white px-2 py-1 rounded hover:bg-gray-700 shrink-0">复制</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 收藏的帖子 */}
      {tab === 'liked-articles' && (
        <div className="space-y-3">
          {data['liked-articles']?.length === 0 && <p className="text-gray-400 text-sm">还没有收藏帖子</p>}
          {data['liked-articles']?.map(a => (
            <Link key={a.id} to={`/articles/${a.id}`} className="block bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
              <h3 className="font-semibold">{a.title}</h3>
              <p className="text-xs text-gray-400 mt-1">{a.user?.username} · {new Date(a.createdAt).toLocaleDateString()} · 👍 {a.likesCount} · 💬 {a.commentCount || 0}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
