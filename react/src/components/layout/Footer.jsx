// Footer - Le pied de page de mon site
// S'affiche en bas de toutes les pages

// Composant Footer
export default function Footer() {
  // J'affiche mon footer
  return (
    <footer className="bg-white border-t mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">

          <div className="text-center md:text-left">
            <p className="text-sm text-gray-600">
              Task Manager - Gérez vos tâches facilement
            </p>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-500">
              © Noel Bertrand - CFPTI {new Date().getFullYear()}.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
