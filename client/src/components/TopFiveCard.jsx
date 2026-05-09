export default function TopFiveCard({ build, rank }) {
  return (
    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-3 rounded-lg border border-yellow-200">
      <div className="flex items-center gap-3">
        <span className="text-2xl font-bold text-orange-500 w-8">#{rank}</span>
        <div className="flex-1 min-w-0">
          <p className="font-semibold truncate">{build.name}</p>
          <p className="text-xs text-gray-500">{build.user?.username} · 👍 {build.likesCount}</p>
        </div>
      </div>
      <div className="mt-2 flex items-center gap-2 ml-11">
        <code className="text-xs bg-white/60 px-2 py-1 rounded font-mono flex-1 truncate border border-yellow-100">{build.buildCode}</code>
        <button onClick={() => { navigator.clipboard.writeText(build.buildCode); alert('已复制！') }}
          className="text-xs bg-orange-500 text-white px-2 py-1 rounded hover:bg-orange-600 shrink-0">
          复制
        </button>
      </div>
    </div>
  )
}
