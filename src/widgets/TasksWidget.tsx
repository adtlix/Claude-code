import { useState, KeyboardEvent } from 'react'
import { useOSStore, Task } from '../store'

export default function TasksWidget() {
  const { tasks, addTask, toggleTask, deleteTask } = useOSStore()
  const [input, setInput] = useState('')

  const handleAdd = () => {
    const text = input.trim()
    if (!text) return
    addTask(text)
    setInput('')
  }

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleAdd()
  }

  const pending = tasks.filter((t) => !t.done)
  const done = tasks.filter((t) => t.done)

  return (
    <div className="widget widget-tasks">
      <div className="widget-header">
        <span className="widget-title">TASKS</span>
        <span style={{ fontSize: 9, color: 'var(--accent)', letterSpacing: '0.1em' }}>
          {pending.length} OPEN
        </span>
        <span className="widget-icon">◈</span>
      </div>
      <div className="widget-body" style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        <div className="tasks-add">
          <input
            className="tasks-input"
            placeholder="add task..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
          />
          <button className="btn-add" onClick={handleAdd}>+</button>
        </div>
        <div className="task-list">
          {pending.map((t) => (
            <TaskItem key={t.id} task={t} onToggle={toggleTask} onDelete={deleteTask} />
          ))}
          {done.length > 0 && (
            <>
              <div style={{ height: 1, background: 'var(--border)', margin: '6px 0' }} />
              {done.slice(0, 3).map((t) => (
                <TaskItem key={t.id} task={t} onToggle={toggleTask} onDelete={deleteTask} />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function TaskItem({
  task,
  onToggle,
  onDelete,
}: {
  task: Task
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}) {
  return (
    <div className={`task-item${task.done ? ' done' : ''}`}>
      <div className="task-check" onClick={() => onToggle(task.id)}>
        <div className="task-check-inner" />
      </div>
      <span className="task-text" onClick={() => onToggle(task.id)}>{task.text}</span>
      <div className={`task-priority priority-${task.priority}`} />
      <button
        className="task-delete"
        onClick={(e) => {
          e.stopPropagation()
          onDelete(task.id)
        }}
        title="Delete task"
      >
        ×
      </button>
    </div>
  )
}
