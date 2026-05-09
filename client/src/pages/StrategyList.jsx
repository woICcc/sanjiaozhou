import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api'

const categories = ['全部', '活动速通', '武器测评', '干员技巧', '地图解析']

export default function StrategyList() {
  const [articles, setArticles] = useState([])
  const [category, setCategory] = useState('全部')
  const [sort, setSort] = useState('new')

  useEffect(() => {
    const params = {}
    if (category !== '全部') params.category = category
    if (sort === 'hot') params.sort = 'hot'
    api.get('/articles', { params }).then(res => setArticles(res.data))
  }, [category, sort])

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">📝 攻略</h1>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {categories.map(c => (
          <button key={c} onClick={() => setCategory(c)}
            className={`px-3 py-1.5 rounded-full text-sm ${category === c ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
            {c}
          </button>
        ))}
      </div>

      <div className="flex gap-2 mb-6">
        <button onClick={() => setSort('new')} className={`px-3 py-1.5 rounded-lg text-sm ${sort === 'new' ? 'bg-gray-800 text-white' : 'bg-gray-200'}`}>最新发布</button>
        <button onClick={() => setSort('hot')} className={`px-3 py-1.5 rounded-lg text-sm ${sort === 'hot' ? 'bg-gray-800 text-white' : 'bg-gray-200'}`}>最多点赞</button>
      </div>

      <div className="space-y-3">
        {articles.map(a => (
          <Link key={a.id} to={`/articles/${a.id}`} className="block bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition border border-gray-100">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold">{a.title}</h3>
                <p className="text-xs text-gray-400 mt-1">{a.user?.username} · {new Date(a.createdAt).toLocaleDateString()}</p>
              </div>
              {a.category && <span className="text-xs bg-gray-100 px-2 py-1 rounded-full shrink-0">{a.category}</span>}
            </div>
            <div className="flex gap-4 mt-2 text-xs text-gray-400">
              <span>👍 {a.likesCount}</span>
              <span>💬 {a.commentCount || 0}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
