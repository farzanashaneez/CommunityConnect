import { Paper, List, ListItem, ListItemText, Button } from '@mui/material'

const events = [
  { id: 1, title: 'Community Meetup', date: '2023-06-15' },
  { id: 2, title: 'Online Workshop', date: '2023-06-20' },
  { id: 3, title: 'Charity Fundraiser', date: '2023-06-25' },
]

export default function UpcomingEvents() {
  return (
    <Paper elevation={3} className="p-4">
      <h2 className="text-xl font-bold mb-4">Upcoming Events</h2>
      <List>
        {events.map((event) => (
          <ListItem key={event.id}>
            <ListItemText primary={event.title} secondary={event.date} />
          </ListItem>
        ))}
      </List>
      <Button variant="outlined" fullWidth className="mt-4">
        See More
      </Button>
    </Paper>
  )
}

