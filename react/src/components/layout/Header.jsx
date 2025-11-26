// En-tête simple

import { Button } from '@/components/ui/button'
import { useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'

export default function Header() {
  const navigate = useNavigate()
  const location = useLocation()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      try {
        setUser(JSON.parse(userStr))
      } catch (e) {
        setUser(null)
      }
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    // Header sticky = reste en haut quand je scroll
    <header className="sticky top-0 z-50 border-b bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo / Titre cliquable */}
          <h1
            className="text-xl font-bold cursor-pointer hover:text-blue-600 transition-colors"
            onClick={() => navigate('/')}
          >
            Todo List
          </h1>

          {/* Menu si connecté */}
          {user && (
            <div className="flex items-center gap-4">
              {/* Bouton Catégories (sauf si on est déjà sur cette page) */}
              {location.pathname !== '/categories' && (
                <Button
                  variant="outline"
                  onClick={() => navigate('/categories')}
                >
                  Catégories
                </Button>
              )}
              {/* Nom de l'utilisateur */}
              <span className="text-sm">{user.username}</span>
              {/* Bouton déconnexion */}
              <Button
                variant="outline"
                onClick={handleLogout}
              >
                Se déconnecter
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
