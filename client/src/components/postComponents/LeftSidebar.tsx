import NewPostBox from './NewPostBox'
import UpcomingEvents from './UpcomingEvents'
import MediaGallery from './MediaGallery'

export default function LeftSidebar() {
  return (
    <div className="space-y-8">
      <NewPostBox />
      <UpcomingEvents />
      <MediaGallery/>
    </div>
  )
}
