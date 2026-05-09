import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirm) { setError('两次密码不一致'); return }
    try {
      await register(form.username, form.email, form.password)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || '注册失败')
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-10">
      <h1 className="text-2xl font-bold text-center mb-6">注册</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <input type="text" placeholder="用户名" value={form.username} onChange={e => setForm({...form, username: e.target.value})} required
          className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
        <input type="email" placeholder="邮箱" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required
          className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
        <input type="password" placeholder="密码" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required
          className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
        <input type="password" placeholder="确认密码" value={form.confirm} onChange={e => setForm({...form, confirm: e.target.value})} required
          className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
        <button type="submit" className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600">注册</button>
        <p className="text-sm text-center text-gray-500">已有账号？<Link to="/login" className="text-orange-500 hover:underline">登录</Link></p>
      </form>
    </div>
  )
}
