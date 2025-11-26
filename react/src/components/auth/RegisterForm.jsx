// RegisterForm - Le formulaire pour créer un compte
// Ici tu choisis ton nom d'utilisateur, ton email et ton mot de passe

// J'importe ce dont j'ai besoin
import { useState } from 'react'  // Pour gérer mes états
import { useNavigate, Link } from 'react-router-dom'  // Pour changer de page
import { Button } from '@/components/ui/button'  // Bouton stylé
import { Input } from '@/components/ui/input'  // Champ de texte stylé
import { Label } from '@/components/ui/label'  // Label stylé
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'  // Carte stylée
import { useToast } from '@/components/ui/use-toast'  // Pour les messages
import Footer from '../layout/Footer'  // Mon footer

export default function RegisterForm() {
  // navigate = pour aller sur d'autres pages
  const navigate = useNavigate()

  // toast = pour afficher des messages
  const { toast } = useToast()

  const [loading, setLoading] = useState(false)  // true = en train d'envoyer
  const [username, setUsername] = useState('')  // Mon nom d'utilisateur
  const [email, setEmail] = useState('')  // Mon email
  const [password, setPassword] = useState('')  // Mon mot de passe
  const [confirmPassword, setConfirmPassword] = useState('')  // Je retape mon mot de passe pour vérifier
  // Pour mettre mon boutton a enabled || disabled
  const isDisabled =
    loading ||
    username.trim() === '' ||
    email.trim() === '' ||
    password.trim() === '' ||
    confirmPassword.trim() === ''

  const API_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:8000'  // En local
    : window.location.origin + '/api'  // Sur le serveur

  async function handleSubmit(e) {
    // J'empêche la page de se recharger
    e.preventDefault()

    // Je vérifie que les deux mots de passe sont pareils
    if (password !== confirmPassword) {
      toast({ title: 'Erreur', description: 'Les mots de passe sont différents', variant: 'destructive' })
      return 
    }

    // Je vérifie que le mot de passe fait au moins 6 caractères
    if (password.length < 6) {
      toast({ title: 'Erreur', description: 'Mot de passe trop court', variant: 'destructive' })
      return  
    }

    // Je dis que je suis en train de charger
    setLoading(true)

    // J'envoie mes infos au serveur pour créer mon compte
    const response = await fetch(`${API_URL}/auth.php?action=register`, {
      method: 'POST',  // J'envoie des données
      headers: { 'Content-Type': 'application/json' },  // Je dis que c'est du JSON
      body: JSON.stringify({ username, email, password })  
    })

    // Je récupère la réponse du serveur
    const data = await response.json()

    if (response.ok) {
      localStorage.setItem('token', data.token)  // Je sauvegarde mon token
      localStorage.setItem('user', JSON.stringify(data.user))  // Je sauvegarde mes infos
      toast({ title: 'Compte créé',  duration: 4000 })  // Message de succès
      navigate('/')  // Je vais sur le dashboard
    } else {
      toast({ title: 'Erreur', description: 'Ce nom existe déjà', variant: 'destructive' })
    }

    // Je dis que j'ai fini de charger
    setLoading(false)
  }

  // J'affiche mon formulaire d'inscription
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="bg-gray-50">
            <CardTitle>Inscription</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 bg-gray-50">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Nom d'utilisateur</Label>
                <Input
                  type="text"
                  placeholder="Choisis un nom d'utilisateur"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  placeholder="ton@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Mot de passe</Label>
                <Input
                  type="password"
                  placeholder="Min. 6 caractères"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Confirme ton mot de passe</Label>
                <Input
                  type="password"
                  placeholder="Retape ton mot de passe"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" disabled={loading || isDisabled} className="w-full">
                {loading ? "Création..." : "Créer mon compte"}
              </Button>
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-50 text-gray-500">Déjà un compte?</span>
                </div>
              </div>
              <Link to="/login">
                <Button type="button" variant="outline" className="w-full">
                  Se connecter
                </Button>
              </Link>
            </form>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  )
}
