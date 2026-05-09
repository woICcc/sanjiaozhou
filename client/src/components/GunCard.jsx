import { Link } from 'react-router-dom'

export default function GunCard({ gun }) {
  const typeColors = {
    '突击步枪': 'bg-blue-100 text-blue-800',
    '冲锋枪': 'bg-green-100 text-green-800',
    '狙击枪': 'bg-red-100 text-red-800',
    '霰弹枪': 'bg-purple-100 text-purple-800',
    '轻机枪': 'bg-yellow-100 text-yellow-800',
    '射手步枪': 'bg-indigo-100 text-indigo-800',
    '手枪': 'bg-pink-100 text-pink-800',
    '特殊武器': 'bg-teal-100 text-teal-800',
  }

  return (
    <Link to={`/guns/${gun.id}`} className="block bg-white rounded-xl shadow-sm hover:shadow-md transition p-4 border border-gray-100">
      <div className="text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-3 flex items-center justify-center text-3xl">
          🔫
        </div>
        <h3 className="font-semibold text-lg">{gun.name}</h3>
        <span className={`inline-block text-xs px-2 py-0.5 rounded-full mt-1 ${typeColors[gun.type] || 'bg-gray-100'}`}>
          {gun.type}
        </span>
        {gun.unlockLevel && <p className="text-xs text-gray-400 mt-1">解锁等级 {gun.unlockLevel}</p>}
      </div>
    </Link>
  )
}
