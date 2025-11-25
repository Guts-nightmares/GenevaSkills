/**
 * Dashboard - Page principale de l'application
 *
 * Cette page affiche toutes les tâches de l'utilisateur connecté
 * et permet de les gérer (créer, modifier, supprimer, filtrer)
 */

import { useState, useEffect } from 'react'
import Layout from '@/components/layout/Layout'
import TaskList from '@/components/tasks/TaskList'
import TaskModal from '@/components/tasks/TaskModal'
import TaskFilters from '@/components/tasks/TaskFilters'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'

// URL de l'API - détecte automatiquement si on est en local ou en prod
const API_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:8000'  // En local
  : window.location.origin + '/api'  // En production

/**
 * Fonction pour appeler l'API
 * @param {string} endpoint - Le fichier PHP à appeler (ex: 'tasks.php')
 * @param {string} method - La méthode HTTP (GET, POST, PUT, DELETE)
 * @param {object} data - Les données à envoyer (null si GET)
 * @returns {Promise} Les données de la réponse
 */
async function callApi(endpoint, method = 'GET', data = null) {
  // Récupère le token d'authentification
  const token = localStorage.getItem('token')

  // Configure la requête
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`  // Token pour l'authentification
    }
  }

  // Ajoute les données si nécessaire
  if (data) {
    options.body = JSON.stringify(data)
  }

  // Fait la requête
  const response = await fetch(`${API_URL}/${endpoint}`, options)

  // Si non autorisé, déconnecte l'utilisateur
  if (response.status === 401) {
    localStorage.clear()
    window.location.href = '/#/login'
    return
  }

  // Retourne les données
  return response.json()
}

/**
 * Composant Dashboard
 */
export default function Dashboard() {
  // Hook pour afficher des messages
  const { toast } = useToast()

  // États du composant
  const [tasks, setTasks] = useState([])  // Liste des tâches
  const [categories, setCategories] = useState([])  // Liste des catégories
  const [loading, setLoading] = useState(true)  // État de chargement
  const [showModal, setShowModal] = useState(false)  // Afficher/cacher le modal
  const [editTask, setEditTask] = useState(null)  // Tâche en cours d'édition
  const [filters, setFilters] = useState({  // Filtres actifs
    status: '',
    category_id: null
  })

  // Charge les données au démarrage et quand les filtres changent
  useEffect(() => {
    loadTasks()
    loadCategories()
  }, [filters])

  /**
   * Charge toutes les tâches depuis l'API
   */
  async function loadTasks() {
    const data = await callApi('tasks.php')
    setTasks(data || [])
    setLoading(false)
  }

  /**
   * Charge toutes les catégories depuis l'API
   */
  async function loadCategories() {
    const data = await callApi('categories.php')
    setCategories(data || [])
  }

  /**
   * Ouvre le modal pour créer ou modifier une tâche
   * @param {object} task - La tâche à modifier (null pour créer)
   */
  function openModal(task = null) {
    setEditTask(task)
    setShowModal(true)
  }

  /**
   * Sauvegarde une tâche (création ou modification)
   * @param {object} taskData - Les données de la tâche
   */
  async function saveTask(taskData) {
    if (editTask) {
      // Modification d'une tâche existante
      await callApi('tasks.php', 'PUT', { ...taskData, id: editTask.id })
      toast({ title: 'Tâche modifiée' })
    } else {
      // Création d'une nouvelle tâche
      await callApi('tasks.php', 'POST', taskData)
      toast({ title: 'Tâche créée' })
    }
    loadTasks()  // Recharge la liste
    setShowModal(false)  // Ferme le modal
  }

  /**
   * Supprime une tâche après confirmation
   * @param {object} task - La tâche à supprimer
   */
  async function deleteTask(task) {
    if (!confirm(`Supprimer "${task.title}" ?`)) return
    await callApi(`tasks.php?id=${task.id}`, 'DELETE')
    toast({ title: 'Tâche supprimée' })
    loadTasks()
  }

  /**
   * Change le statut d'une tâche (todo <-> done)
   * @param {object} task - La tâche à modifier
   */
  async function toggleStatus(task) {
    const newStatus = task.status === 'todo' ? 'done' : 'todo'
    await callApi('tasks.php', 'PUT', { ...task, status: newStatus })
    loadTasks()
  }

  // Affiche un message de chargement
  if (loading) return <Layout><p>Chargement...</p></Layout>

  // Affiche la page
  return (
    <Layout>
      <div className="space-y-6">
        {/* En-tête avec titre et bouton */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Mes tâches</h2>
            <p className="text-gray-600">{tasks.length} tâche{tasks.length > 1 ? 's' : ''}</p>
          </div>
          <Button onClick={() => openModal()}>Ajouter une tâche</Button>
        </div>

        {/* Filtres */}
        <TaskFilters
          categories={categories}
          filters={filters}
          onFilterChange={setFilters}
        />

        {/* Liste des tâches */}
        <TaskList
          tasks={tasks}
          onEdit={openModal}
          onDelete={deleteTask}
          onToggleStatus={toggleStatus}
        />

        {/* Modal pour créer/modifier une tâche */}
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
