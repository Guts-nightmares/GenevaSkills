// Fenêtre modale pour créer ou modifier une tâche

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
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from '@/components/ui/select'

export default function TaskModal({ isOpen, onClose, onSave, task = null, categories = [] }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: '',
    category_id: '',
    status: 'todo',
  })

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || '',
        deadline: task.deadline || '',
        category_id: task.category_id ? task.category_id.toString() : '',
        status: task.status,
      })
    } else {
      setFormData({
        title: '',
        description: '',
        deadline: '',
        category_id: '',
        status: 'todo',
      })
    }
  }, [task, isOpen])

  const handleSubmit = (e) => {
    e.preventDefault()

    const dataToSave = {
      ...formData,
      category_id: formData.category_id ? parseInt(formData.category_id) : null,
      deadline: formData.deadline || null,
    }

    onSave(dataToSave)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {task ? 'Modifier la tâche' : 'Nouvelle tâche'}
          </DialogTitle>
          <DialogDescription>
            {task
              ? 'Modifiez les informations de la tâche'
              : 'Créez une nouvelle tâche à accomplir'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titre *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Ex: Terminer le rapport mensuel"
              required
              maxLength={255}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Décrivez la tâche en détail (optionnel)"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="deadline">Date limite</Label>
              <Input
                id="deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Catégorie</Label>
              <Select
                value={formData.category_id}
                onValueChange={(value) => setFormData({ ...formData, category_id: value })}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup >
                    <SelectLabel>Aucune catégorie</SelectLabel>
                  </SelectGroup>
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Statut</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData({ ...formData, status: value })}
            >
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todo">A faire</SelectItem>
                <SelectItem value="done">Terminee</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit">
              {task ? 'Modifier' : 'Créer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
