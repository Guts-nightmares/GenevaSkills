// Affiche la grille de toutes les tâches

import { ListTodo } from 'lucide-react'
import TaskCard from './TaskCard'

export default function TaskList({ tasks, onEdit, onDelete, onToggleStatus }) {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <ListTodo className="h-16 w-16 mx-auto mb-4 opacity-50" />
        <h3 className="text-lg font-medium mb-2">Aucune tâche trouvée</h3>
        <p className="text-sm">
          Commencez par créer une nouvelle tâche ou ajustez vos filtres
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleStatus={onToggleStatus}
        />
      ))}
    </div>
  )
}
