import { Router } from 'express'
import { MovieController } from '../controllers/movies.js'

// easy methods: GET, POST and HEAD
// hard methods: PUT, PATCH and DELETE use before using themselves OPTIONS // have cors pre-flight

export const createMovieRouter = ({ movieModel }) => {
  const moviesRouter = Router()

  const movieController = new MovieController({
    movieModel
  })

  moviesRouter.get('/', movieController.getAll)
  moviesRouter.get('/:id', movieController.getById)
  moviesRouter.post('/', movieController.create)
  moviesRouter.patch('/:id', movieController.update)
  moviesRouter.delete('/:id', movieController.delete)
  return moviesRouter
}
