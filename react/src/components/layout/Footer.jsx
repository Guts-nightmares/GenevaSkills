// Footer - Le pied de page de mon site
// S'affiche en bas de toutes les pages avec un style moderne

// Mon composant Footer
export default function Footer() {
  // Je récupère l'année actuelle automatiquement
  const annee = new Date().getFullYear()

  // J'affiche mon footer
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      {/* Conteneur principal */}
      <div className="container mx-auto px-4 py-8">
        {/* Tout le contenu du footer */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">

          {/* Colonne de gauche - Info du site */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-bold mb-2">Task Manager</h3>
            <p className="text-sm text-gray-300">
              Gérez vos tâches facilement et efficacement
            </p>
          </div>

          {/* Colonne du milieu - Copyright */}
          <div className="text-center">
            <p className="text-sm text-gray-300">
              © {annee} Noel Bertrand
            </p>
            <p className="text-xs text-gray-400 mt-1">
              CFPTI - Projet Task Manager
            </p>
          </div>

          
        </div>

      </div>
    </footer>
  )
}
