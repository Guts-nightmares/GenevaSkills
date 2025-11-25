// Carte pour afficher une tâche avec tous ses détails

import { Check, Edit, Trash2, Calendar, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { formatDateShort, isPastDeadline, isUpcoming } from '@/lib/utils'

export default function TaskCard({ task, onEdit, onDelete, onToggleStatus }) {
  const isOverdue = isPastDeadline(task.deadline) && task.status === 'todo'
  const isComingSoon = isUpcoming(task.deadline) && task.status === 'todo'

  return (
    <Card className={`task-card ${task.status === 'done' ? 'opacity-70' : ''}`}>
      <CardContent className="pt-6">
        {/* En-tête avec catégorie et actions */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            {task.category_name && (
              <div className="flex items-center space-x-1 mb-2">
                <div
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: task.category_color }}
                />
                <span className="text-xs font-medium text-muted-foreground">
                  {task.category_name}
                </span>
              </div>
            )}
            <h3 className={`text-lg font-semibold ${task.status === 'done' ? 'line-through text-muted-foreground' : ''}`}>
              {task.title}
            </h3>
          </div>
          <div className="flex space-x-1 ml-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(task)}
              title="Modifier"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(task)}
              title="Supprimer"
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </div>

        {/* Description */}
        {task.description && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {task.description}
          </p>
        )}

        {/* Date limite */}
        {task.deadline && (
          <div className={`flex items-center space-x-2 text-sm mb-3 ${
            isOverdue ? 'text-destructive font-medium' :
            isComingSoon ? 'text-orange-600 font-medium' :
            'text-muted-foreground'
          }`}>
            {isOverdue ? (
              <AlertCircle className="h-4 w-4" />
            ) : (
              <Calendar className="h-4 w-4" />
            )}
            <span>
              {isOverdue && 'En retard: '}
              {isComingSoon && 'Bientôt: '}
              {formatDateShort(task.deadline)}
            </span>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between items-center pt-0">
        {/* Badge de statut */}
        <div className={`status-badge ${
          task.status === 'done'
            ? 'bg-green-100 text-green-800'
            : 'bg-blue-100 text-blue-800'
        }`}>
          {task.status === 'done' ? 'Terminee' : 'A faire'}
        </div>

        {/* Bouton de changement de statut */}
        <Button
          variant={task.status === 'done' ? 'outline' : 'default'}
          size="sm"
          onClick={() => onToggleStatus(task)}
        >
          {task.status === 'done' ? (
            'Rouvrir'
          ) : (
            <>
              <Check className="mr-2 h-4 w-4" />
              Terminer
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
