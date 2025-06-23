import styles from '@renderer/styles/features/editor/markdownEditor.module.scss'

/** Markdown */
import {
  MDXEditor,
  headingsPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  quotePlugin,
  thematicBreakPlugin
} from '@mdxeditor/editor'

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
      <MDXEditor
        ref={editor}
        key={selectedNote ? selectedNote.title : ''}
        markdown={selectedNote?.content ? selectedNote.content : ''}
        onChange={onChange}
        onBlur={handleBlur}
        contentEditableClassName={styles.wrapper}
        plugins={[
          headingsPlugin(),
          listsPlugin(),
          quotePlugin(),
          markdownShortcutPlugin(),
          thematicBreakPlugin()
        ]}
      />
    </section>
  )
}
