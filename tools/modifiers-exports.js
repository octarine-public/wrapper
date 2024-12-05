// @ts-ignore
// @ts-nocheck
const fs = require('fs')
const path = require('path')

const modPath = 'Objects/Modifiers'
const sourceDir = '../wrapper/' + modPath
const targetFile = '../wrapper/Imports.ts'

if (!fs.existsSync(sourceDir)) {
  console.error(`dir ${sourceDir} not found`)
  return
}

const getFiles = (dir) => {
  const files = []
  fs.readdirSync(dir).forEach((file) => {
    const filePath = path.join(dir, file)
    if (fs.statSync(filePath).isDirectory()) {
      files.push(...getFiles(filePath))
    } else {
      files.push(filePath)
    }
  })
  return files
}
const files = getFiles(sourceDir)
const exportLines = []
files.forEach((file) => {
  const fileName = path.basename(file, path.extname(file))
  const dirName = path.relative(sourceDir, path.dirname(file))
  const filePath = `./${modPath}/${dirName.replace(/\\/g, '/')}/${fileName}`
  const exportLine = `export { ${fileName} } from "${filePath}"`
  exportLines.push(exportLine)
})
const existingExports = fs.readFileSync(targetFile, 'utf8').split('\n').map(line => line.trim())
const newExports = exportLines.filter((exportLine) => !existingExports.includes(exportLine.trim()))
if (newExports.length !== 0) {
  fs.appendFileSync(targetFile, newExports.join('\n') + '\n')
  console.log('[+]', `Updated ${targetFile} with ${newExports.length} new exports`, '\n[x]', 'Total modifiers:', exportLines.length)
} else {
  console.log('[x]', 'No new exports', '\n[x]', 'Total modifiers:', exportLines.length)
}