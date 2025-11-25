// Barre de filtres pour trier et filtrer les tâches

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'

export default function TaskFilters({
  categories,
  filters,
  onFilterChange,
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-white rounded-lg border">
      {/* Filtre par statut */}
      <div className="space-y-2">
        <Label>Statut</Label>
        <Select
          value={filters.status || 'all'}
          onValueChange={(value) =>
            onFilterChange({ ...filters, status: value === 'all' ? '' : value })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous</SelectItem>
            <SelectItem value="todo">A faire</SelectItem>
            <SelectItem value="done">Terminees</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Filtre par catégorie */}
      <div className="space-y-2">
        <Label>Catégorie</Label>
        <Select
          value={filters.category_id?.toString() || 'all'}
          onValueChange={(value) =>
            onFilterChange({
              ...filters,
              category_id: value === 'all' ? null : parseInt(value),
            })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes</SelectItem>
            <SelectItem value="0">Sans catégorie</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id.toString()}>
                <div className="flex items-center space-x-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span>{cat.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tri */}
      <div className="space-y-2">
        <Label>Trier par</Label>
        <Select
          value={filters.sort_by || 'created_at'}
          onValueChange={(value) =>
            onFilterChange({ ...filters, sort_by: value })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="created_at">Date de création</SelectItem>
            <SelectItem value="deadline">Date limite</SelectItem>
            <SelectItem value="title">Titre</SelectItem>
            <SelectItem value="status">Statut</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Ordre de tri */}
      <div className="space-y-2">
        <Label>Ordre</Label>
        <Select
          value={filters.sort_order || 'DESC'}
          onValueChange={(value) =>
            onFilterChange({ ...filters, sort_order: value })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ASC">Croissant</SelectItem>
            <SelectItem value="DESC">Décroissant</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
