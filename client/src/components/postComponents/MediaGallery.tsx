import { Paper, Button, ImageList, ImageListItem } from '@mui/material'

const mediaItems = [
  { id: 1, src: '/placeholder.svg?height=100&width=100', alt: 'Media 1' },
  { id: 2, src: '/placeholder.svg?height=100&width=100', alt: 'Media 2' },
  { id: 3, src: '/placeholder.svg?height=100&width=100', alt: 'Media 3' },
  { id: 4, src: '/placeholder.svg?height=100&width=100', alt: 'Media 4' },
]

export default function MediaGallery() {
  return (
    <Paper elevation={3} className="p-4">
      <h2 className="text-xl font-bold mb-4">Media</h2>
      <ImageList cols={2} rowHeight={100}>
        {mediaItems.map((item) => (
          <ImageListItem key={item.id}>
            <img src={item.src} alt={item.alt} width={100} height={100} className="object-cover" />
          </ImageListItem>
        ))}
      </ImageList>
      <Button variant="outlined" fullWidth className="mt-4">
        See All Media
      </Button>
    </Paper>
  )
}

