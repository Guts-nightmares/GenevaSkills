// Structure de base de l'appli (header + contenu + footer)

import Header from './Header'  // Mon en-tête
import Footer from './Footer'  // Mon pied de page
import { Toaster } from '@/components/ui/toaster'  // Pour les messages

// Mon composant Layout qui entoure toutes mes pages
export default function Layout({ children }) {
  return (
    // Conteneur principal qui prend toute la hauteur de l'écran
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Mon header (navbar) en haut */}
      <Header />

      {/* Le contenu de ma page (ça change selon la page) */}
      <main className="container mx-auto px-4 py-8 flex-1">
        {children}
      </main>

      <Footer />

      <Toaster />
    </div>
  )
}
