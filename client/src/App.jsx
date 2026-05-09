import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import GunPlaza from './pages/GunPlaza'
import GunDetail from './pages/GunDetail'
import StrategyList from './pages/StrategyList'
import ArticleDetail from './pages/ArticleDetail'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import Admin from './pages/Admin'

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/guns" element={<GunPlaza />} />
          <Route path="/guns/:id" element={<GunDetail />} />
          <Route path="/articles" element={<StrategyList />} />
          <Route path="/articles/:id" element={<ArticleDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
    </div>
  )
}
