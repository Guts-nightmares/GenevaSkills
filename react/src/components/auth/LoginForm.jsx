// LoginForm - Le formulaire pour se connecter
// C'est ici que tu tapes ton nom d'utilisateur et ton mot de passe

// J'importe ce dont j'ai besoin
import { useState } from 'react'  // Pour gérer mes états
import { useNavigate, Link } from 'react-router-dom'  // Pour changer de page
import { Button } from '@/components/ui/button'  // Bouton stylé
import { Input } from '@/components/ui/input'  // Champ de texte stylé
import { Label } from '@/components/ui/label'  // Label stylé
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'  // Carte stylée
import { useToast } from '@/components/ui/use-toast'  // Pour les messages
import Footer from '../layout/Footer'  // Mon footer

// Ma fonction principale du formulaire de connexion
export default function LoginForm() {
  // navigate = pour aller sur d'autres pages
  const navigate = useNavigate()

  // toast = pour afficher des messages
  const { toast } = useToast()

  // Mes états (variables qui peuvent changer)
  const [loading, setLoading] = useState(false)  // true = en train d'envoyer
  const [username, setUsername] = useState('')  // Ce que je tape comme nom d'utilisateur
  const [password, setPassword] = useState('')  // Ce que je tape comme mot de passe
  const isDisabled = username.trim() === '' || password.trim() === '';

  // URL de mon API - change automatiquement
  const API_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:8000'  // En local
    : window.location.origin + '/api'  // Sur le serveur

  // Fonction qui se lance quand je clique sur "Se connecter"
  async function handleSubmit(e) { // je mets async car je fais un await
    // J'empêche la page de se recharger
    e.preventDefault()

    // Je dis que je suis en train de charger
    setLoading(true)

    // J'envoie mes identifiants au serveur
    const response = await fetch(`${API_URL}/auth.php?action=login`, { // utile car ca me permet de ne pas changer quand je met en prod ou quand je dev en local
      method: 'POST',  
      headers: { 'Content-Type': 'application/json' },  // Je dis que c'est du JSON
      body: JSON.stringify({ username, password })  
    })

    // Je récupère la réponse du serveur
    const data = await response.json()

    if (response.ok) {
      localStorage.setItem('token', data.token)  // Je sauvegarde mon token dans le navigateur
      localStorage.setItem('user', JSON.stringify(data.user))  // Je sauvegarde mes infos
      toast({ title: 'Connecté',  duration: 4000 })  // Message de succès
      navigate('/')  // Je vais sur le dashboard
    } else {
      toast({ // Un message aussi
        title: 'Erreur',
        description: 'Mauvais identifiants',
        variant: 'destructive'
      })
    }

    // Je dis que j'ai fini de charger
    setLoading(false)
  }

  // J'affiche mon formulaire de connexion
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="bg-gray-50">
            <CardTitle>Connexion</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 bg-gray-50">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Nom d'utilisateur</Label>
                <Input
                  type="text"
                  placeholder="Entre ton nom d'utilisateur"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Mot de passe</Label>
                <Input
                  type="password"
                  placeholder="Entre ton mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" disabled={isDisabled || loading} className="w-full">
                {loading ? "Connexion..." : "Se connecter"}
              </Button>
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-50 text-gray-500">Pas encore de compte?</span>
                </div>
              </div>
              <Link to="/register">
                <Button type="button" variant="outline" className="w-full">
                  Créer un compte
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
