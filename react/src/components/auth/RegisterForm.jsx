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
    // Conteneur avec footer en bas
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Contenu principal (formulaire centré) */}
      <div className="flex-1 flex items-center justify-center p-4">
        {/* La carte avec mon formulaire */}
        <Card className="w-full max-w-md">
          {/* En-tête de la carte */}
          <CardHeader>
            <CardTitle className="text-2xl">Inscription</CardTitle>
            <CardDescription>
              Créez votre compte
            </CardDescription>
          </CardHeader>

          {/* Le contenu de la carte */}
          <CardContent>
            {/* Mon formulaire - quand je soumets, ça appelle handleSubmit */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Champ pour le nom d'utilisateur */}
              <div>
                <Label>Nom d'utilisateur</Label>
                <Input
                  type="text"
                  value={username}  // Ce que j'ai tapé
                  onChange={(e) => setUsername(e.target.value)}  // Quand je tape
                  required  // Obligatoire
                />
              </div>

              {/* Champ pour l'email */}
              <div>
                <Label>Email</Label>
                <Input
                  type="email"  // Vérifie automatiquement que c'est un email valide
                  value={email}  // Ce que j'ai tapé
                  onChange={(e) => setEmail(e.target.value)}  // Quand je tape
                  required  // Obligatoire
                />
              </div>

              {/* Champ pour le mot de passe */}
              <div>
                <Label>Mot de passe</Label>
                <Input
                  type="password"  // Masque les caractères
                  value={password}  // Ce que j'ai tapé
                  onChange={(e) => setPassword(e.target.value)}  // Quand je tape
                  required  // Obligatoire
                />
              </div>

              {/* Champ pour confirmer le mot de passe */}
              <div>
                <Label>Confirmer le mot de passe</Label>
                <Input
                  type="password"  // Masque les caractères
                  value={confirmPassword}  // Ce que j'ai tapé
                  onChange={(e) => setConfirmPassword(e.target.value)}  // Quand je tape
                  required  // Obligatoire
                />
              </div>

              {/* Le bouton pour créer mon compte */}
              <Button type="submit" disabled={loading || isDisabled}
                className={`w-full transition-all ${
                  loading || isDisabled ? 'bg-gray-400 cursor-not-allowed opacity-60' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {loading ? 'Chargement...' : "Créer mon compte"}  {/* Change le texte pendant le chargement */}
              </Button>

              {/* Lien pour aller se connecter si j'ai déjà un compte */}
              <div className="text-center text-sm">
                <Link to="/login" className="text-primary hover:underline">
                  J'ai déjà un compte
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  )
}
