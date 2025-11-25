/**
 * RegisterForm - Formulaire d'inscription
 *
 * Permet à un nouvel utilisateur de créer un compte avec
 * un nom d'utilisateur, un email et un mot de passe
 */

import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'

/**
 * Composant RegisterForm
 */
export default function RegisterForm() {
  // Navigation entre les pages
  const navigate = useNavigate()

  // Messages de notification
  const { toast } = useToast()

  // États du formulaire
  const [loading, setLoading] = useState(false)  // Chargement en cours
  const [username, setUsername] = useState('')  // Nom d'utilisateur saisi
  const [email, setEmail] = useState('')  // Email saisi
  const [password, setPassword] = useState('')  // Mot de passe saisi
  const [confirmPassword, setConfirmPassword] = useState('')  // Confirmation du mot de passe

  // URL de l'API - auto-détection
  const API_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:8000'  // En local
    : window.location.origin + '/api'  // En production

  /**
   * Soumission du formulaire d'inscription
   * @param {Event} e - Événement du formulaire
   */
  async function handleSubmit(e) {
    // Empêche le rechargement de la page
    e.preventDefault()

    // Vérifie que les mots de passe correspondent
    if (password !== confirmPassword) {
      toast({ title: 'Erreur', description: 'Les mots de passe sont différents', variant: 'destructive' })
      return
    }

    // Vérifie la longueur minimale du mot de passe
    if (password.length < 6) {
      toast({ title: 'Erreur', description: 'Mot de passe trop court', variant: 'destructive' })
      return
    }

    // Active l'état de chargement
    setLoading(true)

    // Appelle l'API d'inscription
    const response = await fetch(`${API_URL}/auth.php?action=register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    })

    // Récupère la réponse
    const data = await response.json()

    if (response.ok) {
      // Inscription réussie
      localStorage.setItem('token', data.token)  // Sauvegarde le token
      localStorage.setItem('user', JSON.stringify(data.user))  // Sauvegarde l'utilisateur
      toast({ title: 'Compte créé' })  // Message de succès
      navigate('/')  // Redirige vers le dashboard
    } else {
      // Inscription échouée
      toast({ title: 'Erreur', description: 'Ce nom existe déjà', variant: 'destructive' })
    }

    // Désactive l'état de chargement
    setLoading(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        {/* En-tête */}
        <CardHeader>
          <CardTitle className="text-2xl">Inscription</CardTitle>
          <CardDescription>
            Créez votre compte
          </CardDescription>
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

            {/* Champ email */}
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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

            {/* Champ confirmation du mot de passe */}
            <div>
              <Label>Confirmer le mot de passe</Label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            {/* Bouton de soumission */}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Chargement...' : "Créer mon compte"}
            </Button>

            {/* Lien vers la connexion */}
            <div className="text-center text-sm">
              <Link to="/login" className="text-primary hover:underline">
                J'ai déjà un compte
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
