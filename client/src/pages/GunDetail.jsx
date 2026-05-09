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
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-3xl">🔫</div>
          <div>
            <h1 className="text-2xl font-bold">{gun.name}</h1>
            <p className="text-gray-500">{gun.type}{gun.unlockLevel ? ` · 解锁等级 ${gun.unlockLevel}` : ''}</p>
          </div>
        </div>
      </div>

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

      {user && (
        <div className="text-sm text-gray-500 mb-4">
          今日点赞: {todayLikes.used}/10
        </div>
      )}

      <div className="mb-6">
        <button onClick={() => setShowForm(!showForm)}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition">
          {showForm ? '取消' : '📤 分享我的改枪码'}
        </button>
      </div>

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

      <h2 className="text-lg font-bold mb-3">📋 全部配装方案</h2>
      <div className="space-y-3">
        {gun.builds?.map(b => <BuildCard key={b.id} build={b} />)}
      </div>
    </div>
  )
}
