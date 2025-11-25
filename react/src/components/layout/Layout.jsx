// Structure de base de l'appli (header + contenu)

import Header from './Header'
import { Toaster } from '@/components/ui/toaster'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
      <Toaster />
    </div>
  )
}
