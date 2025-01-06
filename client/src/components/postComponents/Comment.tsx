import { ThumbsUp, MoreHorizontal } from 'lucide-react'

interface CommentProps {
  comment: {
    id: number
    user: {
      name: string
      image: string
    }
    text: string
    likes: number
  }
}

export function Comment({ comment }: CommentProps) {
  return (
    <div className="flex items-start">
      <img
        src={comment.user.image}
        alt={comment.user.name}
        width={32}
        height={32}
        className="rounded-full mr-2"
      />
      <div className="flex-grow bg-gray-100 rounded-lg p-2">
        <div className="flex justify-between items-center mb-1">
          <h4 className="font-semibold text-sm">{comment.user.name}</h4>
          <button className="text-gray-500 hover:text-gray-700">
            <MoreHorizontal size={16} />
          </button>
        </div>
        <p className="text-sm mb-1">{comment.text}</p>
        <div className="flex items-center text-xs text-gray-500">
          <button className="flex items-center hover:text-blue-500 mr-2">
            <ThumbsUp size={12} className="mr-1" />
            Like
          </button>
          <span>{comment.likes} likes</span>
        </div>
      </div>
    </div>
  )
}

