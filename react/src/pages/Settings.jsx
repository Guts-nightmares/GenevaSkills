// Settings - Page pour modifier mes infos personnelles
// Ici je peux changer mon nom, email et mot de passe

// J'importe ce dont j'ai besoin
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '@/components/layout/Layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'

// URL de mon API
const API_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:8000'
  : window.location.origin + '/api'

// Ma fonction pour appeler l'API
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

export default function Settings() {
  const navigate = useNavigate()
  const { toast } = useToast()

  // Je récupère les infos de l'utilisateur connecté
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  // Mes états pour le formulaire (tout en un)
  const [username, setUsername] = useState(user.username || '')
  const [email, setEmail] = useState(user.email || '')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingDelete, setLoadingDelete] = useState(false)

  // Fonction pour sauvegarder tout (profil + mot de passe si rempli)
  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)

    try {
      // Si l'utilisateur veut changer le mot de passe
      if (newPassword || confirmPassword || currentPassword) {
        // Je vérifie que tous les champs de mot de passe sont remplis
        if (!currentPassword || !newPassword || !confirmPassword) {
          toast({
            title: 'Erreur',
            description: 'Remplis tous les champs de mot de passe',
            variant: 'destructive'
          })
          setLoading(false)
          return
        }

        // Je vérifie que les mots de passe correspondent
        if (newPassword !== confirmPassword) {
          toast({
            title: 'Erreur',
            description: 'Les mots de passe ne correspondent pas',
            variant: 'destructive'
          })
          setLoading(false)
          return
        }

        // Je vérifie la longueur du mot de passe
        if (newPassword.length < 6) {
          toast({
            title: 'Erreur',
            description: 'Le mot de passe doit faire au moins 6 caractères',
            variant: 'destructive'
          })
          setLoading(false)
          return
        }
      }

      // J'envoie tout à l'API
      const result = await callApi('user.php', 'PUT', {
        username,
        email,
        current_password: currentPassword || undefined,
        new_password: newPassword || undefined
      })

      if (result.error) {
        toast({
          title: 'Erreur',
          description: result.error,
          variant: 'destructive'
        })
      } else {
        // Je mets à jour les infos dans le localStorage
        const updatedUser = { ...user, username, email }
        localStorage.setItem('user', JSON.stringify(updatedUser))

        toast({
          title: 'Profil mis à jour',
          description: 'Tes informations ont été modifiées'
        })

        // Je vide les champs de mot de passe
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de modifier le profil',
        variant: 'destructive'
      })
    }

    setLoading(false)
  }

  // Fonction pour supprimer le compte
  async function handleDeleteAccount() {
    // Je demande confirmation deux fois pour être sûr
    if (!confirm('Es-tu sûr de vouloir supprimer ton compte ? Cette action est irréversible.')) {
      return
    }

    setLoadingDelete(true)

    try {
      const result = await callApi('user.php', 'DELETE')

      if (result.error) {
        toast({
          title: 'Erreur',
          description: result.error,
          variant: 'destructive'
        })
      } else {
        toast({
          title: 'Compte supprimé',
          description: 'Ton compte a été supprimé'
        })

        // Je déconnecte l'utilisateur
        localStorage.clear()
        navigate('/login')
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer le compte',
        variant: 'destructive'
      })
    }

    setLoadingDelete(false)
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex items-center justify-between bg-gray-100 p-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate('/')}>
              Retour
            </Button>
            <div>
              <h2 className="text-3xl font-bold">Paramètres</h2>
            </div>
          </div>
        </div>

        {/* Carte pour modifier mon profil et mon mot de passe */}
        <Card>
          <CardHeader className="bg-gray-50">
            <CardTitle>Informations du compte</CardTitle>
          </CardHeader>
          <CardContent className="bg-gray-50 pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Nom d'utilisateur</Label>
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
                
                <div className="space-y-2">
                  <Label>Mot de passe actuel</Label>
                  <Input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
              </div>
              <div className="space-y-2">
                <Label>Nouveau mot de passe</Label>
                <Input
                  type="password"
                  placeholder="Min. 6 caractères"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Confirmer le nouveau mot de passe</Label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Carte pour supprimer le compte */}
        <Card>
          <CardHeader className="bg-red-100">
            <CardTitle className="text-red-700">Supprimer son compte</CardTitle>

          </CardHeader>
          <CardContent className="bg-red-50 pt-6">
            <p className="text-sm text-gray-700 mb-4">
              Une fois supprimé, ton compte et toutes tes données seront perdues définitivement.
            </p>
            <Button
              onClick={handleDeleteAccount}
              disabled={loadingDelete}
              variant="destructive"
              className="w-full"
            >
              {loadingDelete ? 'Suppression...' : 'Supprimer mon compte'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
