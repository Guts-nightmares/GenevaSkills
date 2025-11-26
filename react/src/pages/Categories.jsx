// Categories - Page pour gérer mes catégories
// Les catégories c'est pour ranger mes tâches par thème (perso, école, sport, etc.)

// J'importe ce dont j'ai besoin
import { useState, useEffect } from 'react'  // Pour les états et effets
import { useNavigate } from 'react-router-dom'  // Pour naviguer entre les pages
import Layout from '@/components/layout/Layout'  // Mon layout avec la nav
import CategoryList from '@/components/categories/CategoryList'  // Pour afficher mes catégories
import CategoryModal from '@/components/categories/CategoryModal'  // Le popup pour créer/modifier
import { Button } from '@/components/ui/button'  // Bouton stylé
import { useToast } from '@/components/ui/use-toast'  // Messages de notification

// URL de mon API - détecte si je suis en local ou sur le serveur
const API_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:8000'  // En développement local
  : window.location.origin + '/api'  // En production sur mon serveur

// Ma fonction pour appeler l'API PHP
// endpoint = le fichier à appeler (ex: 'categories.php')
// method = GET, POST, PUT ou DELETE
// data = les données à envoyer si j'en ai
async function callApi(endpoint, method = 'GET', data = null) {
  // Je récupère mon token de connexion
  const token = localStorage.getItem('token')

  // Je prépare ma requête
  const options = {
    method,  // La méthode HTTP
    headers: {
      'Content-Type': 'application/json',  // Je dis que c'est du JSON
      'Authorization': `Bearer ${token}`  // Mon token pour prouver que c'est moi
    }
  }

  // Si j'ai des données à envoyer, je les ajoute
  if (data) options.body = JSON.stringify(data)

  // J'envoie ma requête
  const response = await fetch(`${API_URL}/${endpoint}`, options)

  // Si le serveur dit que je suis pas connecté (401)
  if (response.status === 401) {
    localStorage.clear()  // Je supprime tout
    window.location.href = '/#/login'  // Je retourne au login
    return
  }

  // Je retourne la réponse en JSON
  return response.json()
}

// Mon composant principal de la page Catégories
export default function Categories() {
  // navigate = pour aller sur d'autres pages (comme le bouton retour)
  const navigate = useNavigate()

  // toast = pour afficher des messages de succès/erreur
  const { toast } = useToast()

  // Mes états (variables qui changent)
  const [categories, setCategories] = useState([])  // Ma liste de catégories
  const [loading, setLoading] = useState(true)  // true = en train de charger
  const [showModal, setShowModal] = useState(false)  // true = popup ouvert
  const [editCategory, setEditCategory] = useState(null)  // La catégorie que je modifie (null si création)

  // useEffect = se lance au démarrage de la page
  useEffect(() => {
    loadCategories()  // Je charge mes catégories
  }, [])  // [] = juste une fois au début

  // Fonction pour charger toutes mes catégories depuis le serveur
  async function loadCategories() {
    const data = await callApi('categories.php')  // J'appelle mon API
    setCategories(data || [])  // Je mets à jour ma liste
    setLoading(false)  // Je dis que c'est chargé
  }

  // Fonction pour ouvrir le popup (création ou modification)
  // Si category = null, je crée une nouvelle catégorie
  // Sinon je modifie celle qu'on m'a donnée
  function openModal(category = null) {
    setEditCategory(category)  // Je stocke la catégorie à modifier
    setShowModal(true)  // J'ouvre le popup
  }

  // Fonction pour sauvegarder une catégorie
  async function saveCategory(categoryData) {
    if (editCategory) {
      // Cas 1 : Je modifie une catégorie existante
      await callApi('categories.php', 'PUT', { ...categoryData, id: editCategory.id })
      toast({ title: 'Catégorie modifiée' })  // Message de succès
    } else {
      // Cas 2 : Je crée une nouvelle catégorie
      await callApi('categories.php', 'POST', categoryData)
      toast({ title: 'Catégorie créée' })  // Message de succès
    }
    loadCategories()  // Je recharge la liste
    setShowModal(false)  // Je ferme le popup
  }

  // Fonction pour supprimer une catégorie
  async function deleteCategory(category) {
    // Je demande confirmation
    if (!confirm(`Supprimer "${category.name}" ?`)) return

    await callApi(`categories.php?id=${category.id}`, 'DELETE')  // J'appelle l'API
    toast({ title: 'Catégorie supprimée' })  // Message
    loadCategories()  // Je recharge
  }

  // Si je suis en train de charger, j'affiche "Chargement..."
  if (loading) return <Layout><p>Chargement...</p></Layout>

  // J'affiche ma page
  return (
    <Layout>
      <div className="space-y-6">
        {/* En-tête avec le bouton retour et le titre */}
        <div className="flex items-center justify-between bg-gray-100 p-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate('/')}>
              Retour
            </Button>
            <div>
              <h2 className="text-3xl font-bold">Catégories</h2>
              <p className="text-gray-600 mt-1">Organiser mes tâches</p>
            </div>
          </div>
          <Button onClick={() => openModal()}>
            Ajouter une catégorie
          </Button>
        </div>

        {/* Ma liste de catégories (grille avec les cartes) */}
        <CategoryList
          categories={categories}  // Mes catégories
          onEdit={openModal}  // Quand je clique sur modifier
          onDelete={deleteCategory}  // Quand je clique sur supprimer
        />

        {/* Le popup pour créer ou modifier une catégorie */}
        <CategoryModal
          isOpen={showModal}  // true = ouvert
          onClose={() => setShowModal(false)}  // Fermer le popup
          onSave={saveCategory}  // Sauvegarder
          category={editCategory}  // La catégorie à modifier (null si création)
        />
      </div>
    </Layout>
  )
}
