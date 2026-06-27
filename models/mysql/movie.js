import mysql from 'mysql2/promise'

const config = {
  host: 'localhost',
  user: 'root',
  port: 3306,
  password: '',
  database: 'movies_db'
}

const connection = await mysql.createConnection(config)

export class MovieModel {
  static async getAll({ genre }) {
    if (genre) {
      const lowerCaseGenre = genre.toLowerCase()

      const [genres] = await connection.query(
        'SELECT id FROM genre WHERE LOWER(name) = ?;',
        [lowerCaseGenre]
      )

      if (genres.length === 0) return []

      const [{ id: genreId }] = genres

      const [movies] = await connection.query(
        `SELECT m.title, m.year, m.director, m.duration, m.poster, m.rate, BIN_TO_UUID(m.id) id 
         FROM movie m
         INNER JOIN movie_genres mg ON m.id = mg.movie_id
         WHERE mg.genre_id = ?;`,
        [genreId]
      )

      return movies
    }

    const [movies] = await connection.query(
      'SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) id FROM movie;'
    )
    return movies
  }

  static async getById({ id }) {
    const [movies] = await connection.query(
      'SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) id FROM movie WHERE BIN_TO_UUID(id) = ?;',
      [id]
    )
    if (movies.length === 0) return null
    return movies[0]
  }

  static async create({ data }) {
    const { title, year, director, duration, poster, rate } = data

    const [uuidResult] = await connection.query('SELECT UUID() uuid;')
    const [{ uuid }] = uuidResult

    try {
      await connection.query(
        'INSERT INTO movie (id, title, year, director, duration, poster, rate) VALUES (UUID_TO_BIN(?), ?, ?, ?, ?, ?, ?);',
        [uuid, title, year, director, duration, poster, rate]
      )
    } catch (error) {
      console.error('Error inserting movie:', error)
      throw error
    }
    return { id: uuid, ...data }
  }

  static async update({ id, data }) {
    const { title, year, director, duration, poster, rate } = data

    await connection.query(
      'UPDATE movie SET title = ?, year = ?, director = ?, duration = ?, poster = ?, rate = ? WHERE BIN_TO_UUID(id) = ?;',
      [title, year, director, duration, poster, rate, id]
    )
    return { id, ...data }
  }

  static async delete({ id }) {
    await connection.query('DELETE FROM movie WHERE BIN_TO_UUID(id) = ?;', [id])
  }
}
