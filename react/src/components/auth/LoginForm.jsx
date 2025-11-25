/**
 * LoginForm - Formulaire de connexion
 *
 * Permet à un utilisateur de se connecter avec son nom d'utilisateur
 * et son mot de passe
 */

import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'

/**
 * Composant LoginForm
 */
export default function LoginForm() {
  // Navigation entre les pages
  const navigate = useNavigate()

  // Messages de notification
  const { toast } = useToast()

  // États du formulaire
  const [loading, setLoading] = useState(false)  // Chargement en cours
  const [username, setUsername] = useState('')  // Nom d'utilisateur saisi
  const [password, setPassword] = useState('')  // Mot de passe saisi

  // URL de l'API - auto-détection
  const API_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:8000'
    : window.location.origin + '/api'

  /**
   * Soumission du formulaire de connexion
   * @param {Event} e - Événement du formulaire
   */
  async function handleSubmit(e) {
    // Empêche le rechargement de la page
    e.preventDefault()

    // Active l'état de chargement
    setLoading(true)

    // Appelle l'API de connexion
    const response = await fetch(`${API_URL}/auth.php?action=login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })

    // Récupère la réponse
    const data = await response.json()

    if (response.ok) {
      // Connexion réussie
      localStorage.setItem('token', data.token)  // Sauvegarde le token
      localStorage.setItem('user', JSON.stringify(data.user))  // Sauvegarde l'utilisateur
      toast({ title: 'Connecté' })  // Message de succès
      navigate('/')  // Redirige vers le dashboard
    } else {
      // Connexion échouée
      toast({
        title: 'Erreur',
        description: 'Mauvais identifiants',
        variant: 'destructive'
      })
    }

    // Désactive l'état de chargement
    setLoading(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        {/* En-tête */}
        <CardHeader>
          <CardTitle>Connexion</CardTitle>
          <CardDescription>Entrez vos identifiants</CardDescription>
        </CardHeader>

        {/* Contenu */}
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Champ nom d'utilisateur */}
            <div>
              <Label>Nom d'utilisateur</Label>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            {/* Champ mot de passe */}
            <div>
              <Label>Mot de passe</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Bouton de soumission */}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Connexion...' : 'Connexion'}
            </Button>

            {/* Lien vers l'inscription */}
            <div className="text-center text-sm">
              <Link to="/register" className="text-primary hover:underline">
                Créer un compte
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
