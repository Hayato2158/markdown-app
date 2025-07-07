import express from 'express'
import cors from 'cors'
import notesRouter from './routes/notes'

const app = express()
const port = 3000

app.use(cors())
app.use(express.json())
app.use('/api/notes', notesRouter)

app.listen(port, () => {
  console.log(`API server listening at http://localhost:${port}`)
})
