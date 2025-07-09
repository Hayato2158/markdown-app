import { NoteList } from './components/features/noteList/NoteList'
import styles from './styles/pages/app.module.scss'


function App() {
  return (
    <div className={styles.container}>
      <h1>Markdownアプリ</h1>
      <NoteList />
    </div>
  )
}

export default App
