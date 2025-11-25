// Affiche toutes les catégories créées par l'utilisateur

import { Edit, Trash2, Tag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function CategoryList({ categories, onEdit, onDelete }) {
  if (!categories || categories.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Tag className="h-12 w-12 mx-auto mb-2 opacity-50" />
        <p>Aucune catégorie pour le moment</p>
      </div>
    )
  }

  return (
    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
      {categories.map((category) => (
        <Card key={category.id} className="hover:shadow-md transition-shadow">
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-3">
              <div
                className="h-4 w-4 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              <div>
                <h3 className="font-medium">{category.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {category.task_count || 0} tâche{category.task_count !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <div className="flex space-x-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(category)}
                title="Modifier"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(category)}
                title="Supprimer"
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
