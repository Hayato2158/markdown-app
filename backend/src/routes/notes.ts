import express from 'express'
const router = express.Router()

const notes = [
  { id: 1, title: '初めてのノート', content: 'これは最初のノートです。' },
  { id: 2, title: '2つ目のノート', content: 'こちらは2つ目のノートです。' }
]

router.get('/', (_req, res) => {
  res.json(notes)
})

router.post('/', (req, res) => {
  const newNote = req.body
  notes.push({ id: notes.length + 1, ...newNote })
  res.status(201).json(newNote)
})

export default router
