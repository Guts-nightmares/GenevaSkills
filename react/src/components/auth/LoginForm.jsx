import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'

export default function LoginForm() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)

    const response = await fetch('http://localhost:8000/auth.php?action=login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })

    const data = await response.json()

    if (response.ok) {
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      toast({ title: 'Connecté' })
      navigate('/')
    } else {
      toast({ title: 'Erreur', description: 'Mauvais identifiants', variant: 'destructive' })
    }

    setLoading(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Connexion</CardTitle>
          <CardDescription>Entrez vos identifiants</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Nom d'utilisateur</Label>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div>
              <Label>Mot de passe</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Connexion...' : 'Connexion'}
            </Button>

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
