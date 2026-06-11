import ClockWidget from '../widgets/ClockWidget'
import TasksWidget from '../widgets/TasksWidget'
import NotesWidget from '../widgets/NotesWidget'
import SystemWidget from '../widgets/SystemWidget'
import ActivityWidget from '../widgets/ActivityWidget'

export default function Desktop() {
  return (
    <main className="desktop">
      <ClockWidget />
      {/* Center void — 3D scene visible through here */}
      <div className="void-area" />
      <TasksWidget />
      <NotesWidget />
      <ActivityWidget />
      <SystemWidget />
    </main>
  )
}
