// Fenêtre modale pour créer ou modifier une catégorie

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const DEFAULT_COLORS = [
  '#EF4444', // Rouge
  '#F59E0B', // Orange
  '#10B981', // Vert
  '#3B82F6', // Bleu
  '#8B5CF6', // Violet
  '#EC4899', // Rose
  '#14B8A6', // Teal
  '#64748B', // Gris
]

export default function CategoryModal({ isOpen, onClose, onSave, category = null }) {
  const [formData, setFormData] = useState({
    name: '',
    color: '#3B82F6',
  })

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        color: category.color,
      })
    } else {
      setFormData({
        name: '',
        color: '#3B82F6',
      })
    }
  }, [category, isOpen])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {category ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
          </DialogTitle>
          <DialogDescription>
            {category
              ? 'Modifiez les informations de la catégorie'
              : 'Créez une nouvelle catégorie pour organiser vos tâches'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom de la catégorie</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: Travail, Personnel, Urgent..."
              required
              maxLength={100}
            />
          </div>

          <div className="space-y-2">
            <Label>Couleur</Label>
            <div className="flex flex-wrap gap-2">
              {DEFAULT_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`h-10 w-10 rounded-full border-2 transition-transform hover:scale-110 ${
                    formData.color === color
                      ? 'border-gray-900 ring-2 ring-gray-300'
                      : 'border-gray-200'
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setFormData({ ...formData, color })}
                  title={color}
                />
              ))}
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="custom-color" className="text-sm">
                Couleur personnalisée:
              </Label>
              <input
                id="custom-color"
                type="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="h-10 w-20 rounded border"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit">
              {category ? 'Modifier' : 'Créer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
