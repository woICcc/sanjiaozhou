export default function TopFiveCard({ build, rank }) {
  return (
    <div className="flex items-center gap-3 bg-gradient-to-r from-yellow-50 to-orange-50 p-3 rounded-lg border border-yellow-200">
      <span className="text-2xl font-bold text-orange-500 w-8">#{rank}</span>
      <div className="flex-1 min-w-0">
        <p className="font-semibold truncate">{build.name}</p>
        <p className="text-xs text-gray-500">{build.user?.username}</p>
      </div>
      <div className="text-right">
        <p className="text-sm font-bold text-orange-500">👍 {build.likesCount}</p>
      </div>
    </div>
  )
}
