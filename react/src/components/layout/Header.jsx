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
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <h1
            className="text-xl font-bold cursor-pointer"
            onClick={() => navigate('/')}
          >
            Todo List
          </h1>

          {user && (
            <div className="flex items-center gap-4">
              {location.pathname !== '/categories' && (
                <Button
                  variant="outline"
                  onClick={() => navigate('/categories')}
                >
                  Catégories
                </Button>
              )}
              <span className="text-sm">{user.username}</span>
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
