import { useState } from 'react'
import { Send } from 'lucide-react'

interface CommentInputProps {
  postId: number
}

export function CommentInput({ postId }: CommentInputProps) {
  const [comment, setComment] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the comment to your backend postId
    setComment('')
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center">
      <input
        type="text"
        key={postId}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write a comment..."
        className="flex-grow border rounded-full px-4 py-2 mr-2 focus:outline-none focus:border-blue-500"
      />
      <button
        type="submit"
        className="text-blue-500 hover:text-blue-600"
        disabled={!comment.trim()}
      >
        <Send size={20} />
      </button>
    </form>
  )
}

