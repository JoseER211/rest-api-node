import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)

export function readJson(path) {
  return require(path)
}

// How to read a EsModules Json File for now

// Another alternative
// import fs from 'node:fs'
// const movies = JSON.parse(fs.readFileSync('./movies.json', 'utf-8'))
