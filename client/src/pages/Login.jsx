import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || '登录失败')
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-10">
      <h1 className="text-2xl font-bold text-center mb-6">登录</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <input type="email" placeholder="邮箱" value={email} onChange={e => setEmail(e.target.value)} required
          className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
        <input type="password" placeholder="密码" value={password} onChange={e => setPassword(e.target.value)} required
          className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
        <button type="submit" className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600">登录</button>
        <p className="text-sm text-center text-gray-500">没有账号？<Link to="/register" className="text-orange-500 hover:underline">注册</Link></p>
      </form>
    </div>
  )
}
