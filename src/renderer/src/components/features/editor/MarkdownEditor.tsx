/**CSS */
import styles from '@renderer/styles/features/editor/markdownEditor.module.scss'
import '@mdxeditor/editor/style.css'


/** Markdown */
import {
  MDXEditor,
  headingsPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  quotePlugin,
  thematicBreakPlugin
} from '@mdxeditor/editor'


/** title */
import { NoteTitle } from '../contents/NoteTitle'


/** hooks  */
import { useNoteEditor } from '@renderer/hooks/index'
import { JSX } from 'react'

export const MarkdownEditor = (): JSX.Element => {
  const { editor, selectedNote, handleAutoSave, handleBlur } = useNoteEditor()

  const onChange = (markdown: string): void => {
    handleAutoSave(markdown)
  }

  // const content = typeof selectedNote?.content === 'string' ? selectedNote.content : ''

  return (
    <section>
      <NoteTitle className = {styles.noteTitle} />
      <MDXEditor
        ref={editor}
        key={selectedNote?.uuid}
        markdown={selectedNote?.content ?? ''}
        onChange={onChange}
        onBlur={handleBlur}
        contentEditableClassName={styles.wrapper}
        plugins={[
          headingsPlugin(),
          listsPlugin(),
          quotePlugin(),
          thematicBreakPlugin(),
          markdownShortcutPlugin(),
        ]}
      />
    </section>
  )
}
