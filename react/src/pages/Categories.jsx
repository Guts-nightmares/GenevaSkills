import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '@/components/layout/Layout'
import CategoryList from '@/components/categories/CategoryList'
import CategoryModal from '@/components/categories/CategoryModal'
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

  if (data) options.body = JSON.stringify(data)

  const response = await fetch(`${API_URL}/${endpoint}`, options)
  if (response.status === 401) {
    localStorage.clear()
    window.location.href = '/#/login'
    return
  }

  return response.json()
}

export default function Categories() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editCategory, setEditCategory] = useState(null)

  useEffect(() => {
    loadCategories()
  }, [])

  async function loadCategories() {
    const data = await callApi('categories.php')
    setCategories(data || [])
    setLoading(false)
  }

  function openModal(category = null) {
    setEditCategory(category)
    setShowModal(true)
  }

  async function saveCategory(categoryData) {
    if (editCategory) {
      await callApi('categories.php', 'PUT', { ...categoryData, id: editCategory.id })
      toast({ title: 'Catégorie modifiée' })
    } else {
      await callApi('categories.php', 'POST', categoryData)
      toast({ title: 'Catégorie créée' })
    }
    loadCategories()
    setShowModal(false)
  }

  async function deleteCategory(category) {
    if (!confirm(`Supprimer "${category.name}" ?`)) return
    await callApi(`categories.php?id=${category.id}`, 'DELETE')
    toast({ title: 'Catégorie supprimée' })
    loadCategories()
  }

  if (loading) return <Layout><p>Chargement...</p></Layout>

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate('/')}>
              Retour
            </Button>
            <div>
              <h2 className="text-2xl font-bold">Catégories</h2>
              <p className="text-gray-600">Organiser mes tâches</p>
            </div>
          </div>
          <Button onClick={() => openModal()}>Ajouter une catégorie</Button>
        </div>

        <CategoryList
          categories={categories}
          onEdit={openModal}
          onDelete={deleteCategory}
        />

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
