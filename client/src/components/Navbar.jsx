import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()

  return (
    <nav className="bg-gray-900 text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-orange-400">
          🎯 三角洲改枪营地
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <Link to="/guns" className="hover:text-orange-300">枪械广场</Link>
          <Link to="/articles" className="hover:text-orange-300">攻略</Link>
          {user ? (
            <>
              <Link to="/profile" className="hover:text-orange-300">{user.username}</Link>
              {user.role === 'admin' && <Link to="/admin" className="hover:text-orange-300">管理</Link>}
              <button onClick={logout} className="text-gray-400 hover:text-white">退出</button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-orange-300">登录</Link>
              <Link to="/register" className="bg-orange-500 px-3 py-1 rounded hover:bg-orange-600">注册</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
