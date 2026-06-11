import ClockWidget from '../widgets/ClockWidget'
import TasksWidget from '../widgets/TasksWidget'
import NotesWidget from '../widgets/NotesWidget'
import SystemWidget from '../widgets/SystemWidget'
import ActivityWidget from '../widgets/ActivityWidget'
import WeekPlanner from '../widgets/WeekPlanner'

export default function Desktop() {
  return (
    <main className="desktop">
      <ClockWidget />
      <div className="void-area" />
      <TasksWidget />
      <NotesWidget />
      <ActivityWidget />
      <SystemWidget />
      <WeekPlanner />
    </main>
  )
}
