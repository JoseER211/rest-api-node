const express = require('express')
const crypto = require('node:crypto')
const cors = require('cors')
const { validateMovie, validatePartialMovie } = require('./schemas/movies')
const movies = require('./movies.json')

const app = express()

app.disable('x-powered-by')
app.use(express.json())
app.use(
  cors({
    origin: (origin, callback) => {
      const ACCEPTED_ORIGINS = ['http://localhost:8080', 'http://localhost:3000']
      if (!origin || ACCEPTED_ORIGINS.includes(origin)) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    }
  })
)

// easy methods: GET, POST, HEAD
// hard methods: PUT, PATCH, DELETE, OPTIONS // have cors pre-flight

app.get('/movies', (req, res) => {
  const { genre } = req.query
  if (genre) {
    const filteredMovies = movies.filter((movie) =>
      movie.genre.some((g) => g.toLowerCase() === genre.toLowerCase())
    )
    return res.json(filteredMovies)
  }
  res.json(movies)
})

app.get('/movies/:id', (req, res) => {
  const { id } = req.params
  const movie = movies.find((m) => m.id === Number.parseInt(id))
  if (movie) return res.json(movie)
  return res.status(400).json({ error: 'Movie not found' })
})

app.post('/movies', (req, res) => {
  const result = validateMovie(req.body)
  if (result.error) {
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  }
  const newMovie = {
    id: crypto.randomUUID(),
    ...result.data
  }
  movies.push(newMovie)

  return res.status(201).json(newMovie)
})

app.patch('/movies/:id', (req, res) => {
  const result = validatePartialMovie(req.body)

  if (result.error) {
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  }

  const { id } = req.params
  const movieIndex = movies.findIndex((m) => m.id === Number.parseInt(id))

  if (movieIndex === -1) {
    return res.status(400).json({ error: 'Movie not found' })
  }

  const updateMovie = {
    ...movies[movieIndex],
    ...result.data
  }
  movies[movieIndex] = updateMovie
  return res.json(updateMovie)
})

app.delete('/movies/:id', (req, res) => {
  const { id } = req.params
  const movieIndex = movies.findIndex((m) => m.id === Number.parseInt(id))
  if (movieIndex === -1) {
    return res.status(400).json({ error: 'Movie not found' })
  }
  movies.splice(movieIndex, 1)
  return res.sendStatus(204).send()
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`)
})
