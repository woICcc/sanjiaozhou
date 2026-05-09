import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api'
import GunCard from '../components/GunCard'

export default function Home() {
  const [guns, setGuns] = useState([])
  const [articles, setArticles] = useState([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    api.get('/guns').then(res => setGuns(res.data))
    api.get('/articles?sort=hot').then(res => setArticles(res.data.slice(0, 5)))
  }, [])

  const filtered = guns.filter(g => g.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div>
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">🎯 三角洲改枪营地</h1>
        <p className="text-gray-500 mb-6">寻找最强配装，分享你的改枪方案</p>
        <input
          type="text" placeholder="搜索枪械..."
          value={search} onChange={e => setSearch(e.target.value)}
          className="w-full max-w-md px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
      </div>

      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">🔥 热门枪械</h2>
          <Link to="/guns" className="text-sm text-orange-500 hover:underline">查看全部 →</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filtered.slice(0, 6).map(gun => <GunCard key={gun.id} gun={gun} />)}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">📝 热门攻略</h2>
          <Link to="/articles" className="text-sm text-orange-500 hover:underline">查看全部 →</Link>
        </div>
        <div className="space-y-3">
          {articles.map(a => (
            <Link key={a.id} to={`/articles/${a.id}`} className="block bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition border border-gray-100">
              <h3 className="font-semibold">{a.title}</h3>
              <p className="text-sm text-gray-400 mt-1">
                {a.user?.username} · 👍 {a.likesCount} · 💬 {a.commentCount || 0}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
