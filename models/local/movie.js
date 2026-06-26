import { readJson } from '../../utils/require.js'
import { randomUUID } from 'node:crypto'

const movies = readJson('../movies.json')

export class MovieModel {
  static async getAll({ genre }) {
    if (genre) {
      return movies.filter((movie) =>
        movie.genre.some((g) => g.toLowerCase() === genre.toLowerCase())
      )
    }
    return movies
  }

  static async getById(id) {
    return movies.find((m) => m.id === Number.parseInt(id))
  }

  static async create(data) {
    const newMovie = {
      id: randomUUID(),
      ...data
    }
    movies.push(newMovie)
    return newMovie
  }

  static async update(id, data) {
    const movieIndex = movies.findIndex((m) => m.id === Number.parseInt(id))
    if (movieIndex === -1) {
      throw new Error('Movie not found')
    }
    const updatedMovie = {
      ...movies[movieIndex],
      ...data
    }
    movies[movieIndex] = updatedMovie
    return updatedMovie
  }

  static async delete(id) {
    const movieIndex = movies.findIndex((m) => m.id === Number.parseInt(id))
    if (movieIndex === -1) {
      throw new Error('Movie not found')
    }
    movies.splice(movieIndex, 1)
  }
}
