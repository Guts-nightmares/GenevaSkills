// Header - La barre en haut de mon site
// Elle reste collée en haut quand je scroll (sticky)

import { Button } from '@/components/ui/button'  // Mes boutons stylés
import { useNavigate, useLocation } from 'react-router-dom'  // Pour changer de page
import { useEffect, useState } from 'react'  // Pour gérer mes états
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// Mon composant Header
export default function Header() {
  // navigate = pour aller sur d'autres pages
  const navigate = useNavigate()
  const getInitials = (user) => {
    if (!user) return "";
    return user.username.substring(0, 2).toUpperCase();
  };

  // location = pour savoir sur quelle page je suis
  const location = useLocation()

  // user = l'utilisateur connecté (null si pas connecté)
  const [user, setUser] = useState(null)
  // useEffect = se lance au démarrage pour récupérer l'utilisateur
  useEffect(() => {
    const userStr = localStorage.getItem('user')  // Je lis le localStorage
    if (userStr) {  // Si y'a quelque chose
      try {
        setUser(JSON.parse(userStr))  // Je transforme le texte en objet
      } catch (e) {
        setUser(null)  // Si erreur, pas d'utilisateur
      }
    }
  }, [])  // [] = juste une fois au début

  // Fonction pour se déconnecter
  const handleLogout = () => {
    localStorage.removeItem('token')  // Je supprime le token
    localStorage.removeItem('user')  // Je supprime l'utilisateur
    navigate('/login')  // Je retourne au login
  }

  return (
    <header className="sticky top-0 z-50 bg-blue-600 shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white cursor-pointer" onClick={() => navigate('/')}>
            Task Manager
          </h1>
          {user && (
            <div className="flex items-center gap-3">
              {location.pathname !== '/categories' && (
                <Button variant="secondary" onClick={() => navigate('/categories')}>
                  Catégories
                </Button>
              )}
              {location.pathname !== '/settings' && (
                <Button variant="secondary" onClick={() => navigate('/settings')}>
                  Paramètres
                </Button>
              )}
              <Avatar>
              <AvatarFallback>{getInitials(user)}</AvatarFallback>
            </Avatar>
              <Button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white">
                Déconnexion
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
