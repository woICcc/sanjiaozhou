import { useState, useEffect } from 'react'
import api from '../api'
import GunCard from '../components/GunCard'

const types = ['全部', '突击步枪', '冲锋枪', '狙击枪', '霰弹枪', '轻机枪', '射手步枪']

export default function GunPlaza() {
  const [guns, setGuns] = useState([])
  const [type, setType] = useState('全部')
  const [search, setSearch] = useState('')

  useEffect(() => {
    const params = type !== '全部' ? { type } : {}
    api.get('/guns', { params }).then(res => setGuns(res.data))
  }, [type])

  const filtered = guns.filter(g => g.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">🔫 枪械广场</h1>
      <div className="flex flex-wrap gap-2 mb-6">
        {types.map(t => (
          <button key={t} onClick={() => setType(t)}
            className={`px-3 py-1.5 rounded-full text-sm ${type === t ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
            {t}
          </button>
        ))}
      </div>
      <input type="text" placeholder="搜索枪械..." value={search} onChange={e => setSearch(e.target.value)}
        className="w-full max-w-md px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 mb-6" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filtered.map(gun => <GunCard key={gun.id} gun={gun} />)}
      </div>
    </div>
  )
}
