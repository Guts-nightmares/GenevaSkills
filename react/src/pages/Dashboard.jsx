// Dashboard - C'est la page d'accueil quand tu es connecté
// Ici tu vois toutes tes tâches et tu peux les gérer

// J'importe les trucs dont j'ai besoin
import { useState, useEffect } from 'react'  // Pour gérer les états et les effets
import Layout from '@/components/layout/Layout'  // Le layout avec la nav bar
import TaskList from '@/components/tasks/TaskList'  // Pour afficher mes tâches
import TaskModal from '@/components/tasks/TaskModal'  // Le popup pour créer/modifier
import TaskFilters from '@/components/tasks/TaskFilters'  // Les filtres (statut, catégorie)
import { Button } from '@/components/ui/button'  // Le bouton stylé
import { useToast } from '@/components/ui/use-toast'  // Pour afficher des messages

// URL de l'API - ça change automatiquement selon où je suis
const API_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:8000'  // Quand je dev en local
  : window.location.origin + '/api'  // Quand c'est en ligne sur mon serveur

// Fonction pour parler avec mon API PHP
// endpoint = le fichier à appeler (ex: 'tasks.php')
// method = GET, POST, PUT ou DELETE
// data = les données à envoyer (si j'en ai)
async function callApi(endpoint, method = 'GET', data = null) {
  // Je récupère mon token de connexion (il est stocké dans le navigateur)
  const token = localStorage.getItem('token')

  // Je prépare ma requête
  const options = {
    method,  // GET, POST, PUT ou DELETE
    headers: {
      'Content-Type': 'application/json',  // Je dis que j'envoie du JSON
      'Authorization': `Bearer ${token}`  // J'envoie mon token pour prouver que c'est moi
    }
  }

  // Si j'ai des données à envoyer, je les ajoute
  if (data) {
    options.body = JSON.stringify(data)  // Je transforme l'objet en texte JSON
  }

  // J'envoie la requête
  const response = await fetch(`${API_URL}/${endpoint}`, options)

  // Si le serveur me dit que je suis pas connecté (erreur 401)
  if (response.status === 401) {
    localStorage.clear()  // Je supprime tout
    window.location.href = '/#/login'  // Je retourne à la page de login
    return
  }

  // Je retourne la réponse en JSON
  return response.json()
}

// Ma fonction principale du Dashboard
export default function Dashboard() {
  // Toast = pour afficher des petits messages en haut à droite
  const { toast } = useToast()

  // Tous mes états (variables qui peuvent changer)
  const [tasks, setTasks] = useState([])  // Ma liste de tâches
  const [categories, setCategories] = useState([])  // Mes catégories
  const [loading, setLoading] = useState(true)  // true = en train de charger
  const [showModal, setShowModal] = useState(false)  // true = le popup est ouvert
  const [editTask, setEditTask] = useState(null)  // La tâche que je modifie (null si création)
  const [filters, setFilters] = useState({  // Mes filtres
    status: '',  // Vide = toutes, 'todo' ou 'done'
    category_id: null  // null = toutes, sinon l'ID d'une catégorie
  })

  // useEffect = se déclenche au chargement et quand les filtres changent
  useEffect(() => {
    loadTasks()  // Je charge mes tâches
    loadCategories()  // Je charge mes catégories
  }, [filters])  // Je recharge si les filtres changent

  // Fonction pour charger toutes mes tâches depuis le serveur
  async function loadTasks() {
    const data = await callApi('tasks.php')  // J'appelle mon API
    setTasks(data || [])  // Je mets à jour ma liste (ou [] si vide)
    setLoading(false)  // Je dis que c'est chargé
  }

  // Fonction pour charger toutes mes catégories
  async function loadCategories() {
    const data = await callApi('categories.php')  // J'appelle mon API
    setCategories(data || [])  // Je mets à jour ma liste
  }

  // Fonction pour ouvrir le popup (création ou modification)
  // Si task = null, c'est pour créer une nouvelle tâche
  // Sinon c'est pour modifier la tâche donnée
  function openModal(task = null) {
    setEditTask(task)  // Je stocke la tâche à modifier (ou null)
    setShowModal(true)  // J'ouvre le popup
  }

  // Fonction pour sauvegarder une tâche (création ou modification)
  async function saveTask(taskData) {
    if (editTask) {
      // Cas 1 : Je modifie une tâche existante
      await callApi('tasks.php', 'PUT', { ...taskData, id: editTask.id })
      toast({ title: 'Tâche modifiée' })  // Message de succès
    } else {
      // Cas 2 : Je crée une nouvelle tâche
      await callApi('tasks.php', 'POST', taskData)
      toast({ title: 'Tâche créée' })  // Message de succès
    }
    loadTasks()  // Je recharge la liste pour voir les changements
    setShowModal(false)  // Je ferme le popup
  }

  // Fonction pour supprimer une tâche
  async function deleteTask(task) {
    // Je demande confirmation avant de supprimer
    if (!confirm(`Supprimer "${task.title}" ?`)) return

    await callApi(`tasks.php?id=${task.id}`, 'DELETE')  // J'appelle l'API
    toast({ title: 'Tâche supprimée' })  // Message
    loadTasks()  // Je recharge la liste
  }

  // Fonction pour changer le statut (cocher/décocher)
  async function toggleStatus(task) {
    // Si c'est 'todo' ça devient 'done', sinon ça devient 'todo'
    const newStatus = task.status === 'todo' ? 'done' : 'todo'
    await callApi('tasks.php', 'PUT', { ...task, status: newStatus })  // J'envoie
    loadTasks()  // Je recharge
  }

  // Si on est en train de charger, j'affiche "Chargement..."
  if (loading) return <Layout><p>Chargement...</p></Layout>

  // J'affiche ma page
  return (
    <Layout>
      <div className="space-y-6">
        {/* En-tête : le titre et le bouton pour ajouter */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Mes tâches</h2>
            {/* Je compte combien j'ai de tâches et j'ajoute un 's' si y'en a plusieurs */}
            <p className="text-gray-600">{tasks.length} tâche{tasks.length > 1 ? 's' : ''}</p>
          </div>
          {/* Bouton pour créer une nouvelle tâche */}
          <Button onClick={() => openModal()}>Ajouter une tâche</Button>
        </div>

        {/* Mes filtres (par statut et par catégorie) */}
        <TaskFilters
          categories={categories}  // Je lui donne mes catégories
          filters={filters}  // Les filtres actuels
          onFilterChange={setFilters}  // Fonction pour changer les filtres
        />

        {/* La liste de toutes mes tâches */}
        <TaskList
          tasks={tasks}  // Mes tâches
          onEdit={openModal}  // Quand je clique sur modifier
          onDelete={deleteTask}  // Quand je clique sur supprimer
          onToggleStatus={toggleStatus}  // Quand je coche/décoche
        />

        {/* Le popup pour créer ou modifier une tâche */}
        <TaskModal
          isOpen={showModal}  // true = ouvert, false = fermé
          onClose={() => setShowModal(false)}  // Fermer le popup
          onSave={saveTask}  // Sauvegarder la tâche
          task={editTask}  // La tâche à modifier (null si création)
          categories={categories}  // Mes catégories pour le select
        />
      </div>
    </Layout>
  )
}
