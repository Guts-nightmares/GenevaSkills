import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'

export default function RegisterForm() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast({ title: 'Erreur', description: 'Les mots de passe sont différents', variant: 'destructive' })
      return
    }

    if (password.length < 6) {
      toast({ title: 'Erreur', description: 'Mot de passe trop court', variant: 'destructive' })
      return
    }

    setLoading(true)

    const response = await fetch('http://localhost:8000/auth.php?action=register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    })

    const data = await response.json()

    if (response.ok) {
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      toast({ title: 'Compte créé' })
      navigate('/')
    } else {
      toast({ title: 'Erreur', description: 'Ce nom existe déjà', variant: 'destructive' })
    }

    setLoading(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Inscription</CardTitle>
          <CardDescription>
            Créez votre compte
          </CardDescription>
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
              <Label>Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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

            <div>
              <Label>Confirmer le mot de passe</Label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Chargement...' : "Créer mon compte"}
            </Button>

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
