import { Router } from 'express'
import { MovieController } from '../controllers/movies.js'
export const moviesRouter = Router()

// easy methods: GET, POST and HEAD
// hard methods: PUT, PATCH and DELETE use before using themselves OPTIONS // have cors pre-flight

moviesRouter.get('/', MovieController.getAll)

moviesRouter.get('/:id', MovieController.getById)

moviesRouter.post('/', MovieController.create)

moviesRouter.patch('/:id', MovieController.update)

moviesRouter.delete('/:id', MovieController.delete)
