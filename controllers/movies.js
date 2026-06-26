import { MovieModel } from '../models/local/movie.js'
// import { MovieModel } from '../models/database/movie.js'
import { validateMovie, validatePartialMovie } from '../schemas/movies.js'

export class MovieController {
  static async getAll(req, res) {
    try {
      const { genre } = req.query
      const movies = await MovieModel.getAll({ genre })
      res.json(movies)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }

  static async getById(req, res) {
    try {
      const { id } = req.params
      const movie = await MovieModel.getById(id)
      if (movie) return res.json(movie)
      return res.status(400).json({ error: 'Movie not found' })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }

  static async create(req, res) {
    try {
      const result = validateMovie(req.body)
      if (result.error) {
        return res.status(400).json({ error: JSON.parse(result.error.message) })
      }
      const newMovie = await MovieModel.create(result.data)
      return res.status(201).json(newMovie)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }

  static async update(req, res) {
    try {
      const result = validatePartialMovie(req.body)
      if (result.error) {
        return res.status(400).json({ error: JSON.parse(result.error.message) })
      }

      const { id } = req.params
      const movie = await MovieModel.getById(id)
      if (!movie) {
        return res.status(400).json({ error: 'Movie not found' })
      }
      const updateMovie = {
        ...movie,
        ...result.data
      }
      const updatedMovie = await MovieModel.update(id, updateMovie)
      return res.json(updatedMovie)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params
      const movie = await MovieModel.getById(id)
      if (!movie) {
        return res.status(400).json({ error: 'Movie not found' })
      }
      await MovieModel.delete(id)
      return res.sendStatus(204)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }
}
