import { useState, useEffect } from 'react'
import Layout from '@/components/layout/Layout'
import TaskList from '@/components/tasks/TaskList'
import TaskModal from '@/components/tasks/TaskModal'
import TaskFilters from '@/components/tasks/TaskFilters'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'

const API_URL = 'http://localhost:8000'

async function callApi(endpoint, method = 'GET', data = null) {
  const token = localStorage.getItem('token')

  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }

  if (data) {
    options.body = JSON.stringify(data)
  }

  const response = await fetch(`${API_URL}/${endpoint}`, options)

  if (response.status === 401) {
    localStorage.clear()
    window.location.href = '/#/login'
    return
  }

  return response.json()
}


export default function Dashboard() {
  const { toast } = useToast()
  const [tasks, setTasks] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editTask, setEditTask] = useState(null)
  const [filters, setFilters] = useState({
    status: '',
    category_id: null
  })

  useEffect(() => {
    loadTasks()
    loadCategories()
  }, [filters])

  async function loadTasks() {
    const data = await callApi('tasks.php')
    setTasks(data || [])
    setLoading(false)
  }

  async function loadCategories() {
    const data = await callApi('categories.php')
    setCategories(data || [])
  }

  function openModal(task = null) {
    setEditTask(task)
    setShowModal(true)
  }

  async function saveTask(taskData) {
    if (editTask) {
      await callApi('tasks.php', 'PUT', { ...taskData, id: editTask.id })
      toast({ title: 'Tâche modifiée' })
    } else {
      await callApi('tasks.php', 'POST', taskData)
      toast({ title: 'Tâche créée' })
    }
    loadTasks()
    setShowModal(false)
  }

  async function deleteTask(task) {
    if (!confirm(`Supprimer "${task.title}" ?`)) return
    await callApi(`tasks.php?id=${task.id}`, 'DELETE')
    toast({ title: 'Tâche supprimée' })
    loadTasks()
  }

  async function toggleStatus(task) {
    const newStatus = task.status === 'todo' ? 'done' : 'todo'
    await callApi('tasks.php', 'PUT', { ...task, status: newStatus })
    loadTasks()
  }

  if (loading) return <Layout><p>Chargement...</p></Layout>

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Mes tâches</h2>
            <p className="text-gray-600">{tasks.length} tâche{tasks.length > 1 ? 's' : ''}</p>
          </div>
          <Button onClick={() => openModal()}>Ajouter une tâche</Button>
        </div>

        <TaskFilters
          categories={categories}
          filters={filters}
          onFilterChange={setFilters}
        />

        <TaskList
          tasks={tasks}
          onEdit={openModal}
          onDelete={deleteTask}
          onToggleStatus={toggleStatus}
        />

        <TaskModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSave={saveTask}
          task={editTask}
          categories={categories}
        />
      </div>
    </Layout>
  )
}
