import { useState, useEffect } from 'react'
import api from '../api'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const types = ['突击步枪', '冲锋枪', '狙击枪', '射手步枪', '轻机枪', '霰弹枪', '手枪', '特殊武器']

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
