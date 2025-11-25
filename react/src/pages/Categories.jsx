/**
 * Categories - Page de gestion des catégories
 *
 * Permet de créer, modifier et supprimer des catégories
 * pour organiser les tâches
 */

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '@/components/layout/Layout'
import CategoryList from '@/components/categories/CategoryList'
import CategoryModal from '@/components/categories/CategoryModal'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'

// URL de l'API - détecte automatiquement l'environnement
const API_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:8000'  // En local
  : window.location.origin + '/api'  // En production

/**
 * Appelle l'API avec authentification
 * @param {string} endpoint - Fichier PHP à appeler
 * @param {string} method - Méthode HTTP
 * @param {object} data - Données à envoyer
 * @returns {Promise} Réponse de l'API
 */
async function callApi(endpoint, method = 'GET', data = null) {
  // Récupère le token
  const token = localStorage.getItem('token')

  // Configure la requête
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }

  // Ajoute les données
  if (data) options.body = JSON.stringify(data)

  // Fait l'appel
  const response = await fetch(`${API_URL}/${endpoint}`, options)

  // Déconnecte si non autorisé
  if (response.status === 401) {
    localStorage.clear()
    window.location.href = '/#/login'
    return
  }

  return response.json()
}

/**
 * Composant Categories
 */
export default function Categories() {
  // Navigation entre les pages
  const navigate = useNavigate()

  // Messages toast
  const { toast } = useToast()

  // États
  const [categories, setCategories] = useState([])  // Liste des catégories
  const [loading, setLoading] = useState(true)  // Chargement en cours
  const [showModal, setShowModal] = useState(false)  // Modal ouvert/fermé
  const [editCategory, setEditCategory] = useState(null)  // Catégorie en édition

  // Charge les catégories au démarrage
  useEffect(() => {
    loadCategories()
  }, [])

  /**
   * Charge toutes les catégories
   */
  async function loadCategories() {
    const data = await callApi('categories.php')
    setCategories(data || [])
    setLoading(false)
  }

  /**
   * Ouvre le modal pour créer ou modifier
   * @param {object} category - Catégorie à modifier (null = créer)
   */
  function openModal(category = null) {
    setEditCategory(category)
    setShowModal(true)
  }

  /**
   * Sauvegarde une catégorie
   * @param {object} categoryData - Données de la catégorie
   */
  async function saveCategory(categoryData) {
    if (editCategory) {
      // Modification
      await callApi('categories.php', 'PUT', { ...categoryData, id: editCategory.id })
      toast({ title: 'Catégorie modifiée' })
    } else {
      // Création
      await callApi('categories.php', 'POST', categoryData)
      toast({ title: 'Catégorie créée' })
    }
    loadCategories()  // Recharge
    setShowModal(false)  // Ferme le modal
  }

  /**
   * Supprime une catégorie
   * @param {object} category - Catégorie à supprimer
   */
  async function deleteCategory(category) {
    if (!confirm(`Supprimer "${category.name}" ?`)) return
    await callApi(`categories.php?id=${category.id}`, 'DELETE')
    toast({ title: 'Catégorie supprimée' })
    loadCategories()
  }

  // Message de chargement
  if (loading) return <Layout><p>Chargement...</p></Layout>

  // Affiche la page
  return (
    <Layout>
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Bouton retour */}
            <Button variant="outline" onClick={() => navigate('/')}>
              Retour
            </Button>
            <div>
              <h2 className="text-2xl font-bold">Catégories</h2>
              <p className="text-gray-600">Organiser mes tâches</p>
            </div>
          </div>
          {/* Bouton ajouter */}
          <Button onClick={() => openModal()}>Ajouter une catégorie</Button>
        </div>

        {/* Liste des catégories */}
        <CategoryList
          categories={categories}
          onEdit={openModal}
          onDelete={deleteCategory}
        />

        {/* Modal de création/édition */}
        <CategoryModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSave={saveCategory}
          category={editCategory}
        />
      </div>
    </Layout>
  )
}
