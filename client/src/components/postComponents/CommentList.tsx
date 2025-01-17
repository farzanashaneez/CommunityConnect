import { Comment } from './Comment'

interface CommentListProps {
  comments: {
    id: number
    user: {
      name: string
      image: string
      _id:string
    }
    text: string
    likes: number
  }[]
}

export function CommentList({ comments }: CommentListProps) {
  return (
    <div className="space-y-4 mb-4">
      {comments.map((comment) => (
        <Comment key={comment.id} comment={comment} />
      ))}
    </div>
  )
}

