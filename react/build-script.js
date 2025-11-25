import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Copier le dossier api dans dist
const apiSource = path.join(__dirname, '../api')
const apiDest = path.join(__dirname, 'dist/api')

// Créer le dossier api dans dist
if (!fs.existsSync(apiDest)) {
  fs.mkdirSync(apiDest, { recursive: true })
}

// Copier tous les fichiers PHP
const files = fs.readdirSync(apiSource)
files.forEach(file => {
  if (file.endsWith('.php')) {
    const src = path.join(apiSource, file)
    const dest = path.join(apiDest, file)
    fs.copyFileSync(src, dest)
    console.log(`Copié: api/${file}`)
  }
})

console.log('\n Build terminé! Tout est dans le dossier dist/')
console.log(' Upload dist/ sur ton serveur via FileZilla\n')
