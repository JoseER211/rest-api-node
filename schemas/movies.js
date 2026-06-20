import z from 'zod'
const movieSchema = z.object({
  title: z.string({
    invalid_type_error: 'Movie title must be a String',
    required_error: 'Movie title is required'
  }),
  year: z
    .number({
      invalid_type_error: 'Movie year must be a Number',
      required_error: 'Movie year is required'
    })
    .int()
    .positive()
    .min(1900)
    .max(new Date().getFullYear()),
  director: z.string({
    invalid_type_error: 'Movie director must be a String',
    required_error: 'Movie director is required'
  }),
  duration: z
    .number({
      invalid_type_error: 'Movie duration must be a Number',
      required_error: 'Movie duration is required'
    })
    .int()
    .positive(),
  poster: z.string({
    required_error: 'Movie poster is required',
    url: 'Movie poster must be a valid URL'
  }),
  genre: z
    .enum([
      'Action',
      'Comedy',
      'Drama',
      'Horror',
      'Sci-Fi',
      'Romance',
      'Thriller',
      'Fantasy',
      'Animation'
    ])
    .array({
      invalid_type_error: 'Movie genre must be an Array of Strings',
      required_error: 'Movie genre is required'
    })
    .nonempty('Movie genre must have at least one genre'),
  rate: z.number().min(0).max(10).default(0)
})

export function validateMovie(movie) {
  return movieSchema.safeParse(movie)
}

export function validatePartialMovie(movie) {
  return movieSchema.partial().safeParse(movie)
}
