const { Client } = require('pg')
const dotenv = require('dotenv')

dotenv.config()

const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = process.env

const client = () => {
  const clientInstance = new Client({
    connectionString: `postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`
  })

  const interval = setInterval(() => {
    clientInstance
      .connect()
      .then(() => {
        clearInterval(interval)
        console.log('Connected to database')
      })
      .catch(() => console.log('Failed to connect to database'))
  }, 5000)

  return clientInstance
}

module.exports = client()
