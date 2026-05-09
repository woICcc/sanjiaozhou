import LikeButton from './LikeButton'

export default function BuildCard({ build }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold">{build.name}</h3>
          <p className="text-xs text-gray-400 mt-0.5">
            {build.user?.username} · {new Date(build.createdAt).toLocaleDateString()}
          </p>
        </div>
        <LikeButton buildId={build.id} initialLikes={build.likesCount} />
      </div>
      {build.description && <p className="text-sm text-gray-600 mt-2">{build.description}</p>}
      <div className="mt-2 flex items-center gap-2">
        <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono flex-1 truncate">{build.buildCode}</code>
        <button onClick={() => { navigator.clipboard.writeText(build.buildCode); alert('已复制！') }}
          className="text-xs bg-gray-800 text-white px-2 py-1 rounded hover:bg-gray-700 shrink-0">
          复制
        </button>
      </div>
    </div>
  )
}
