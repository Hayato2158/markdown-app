import { ComponentPropsWithoutRef } from 'react'

/** components */
import { NotePreview } from '@renderer/components/features/noteList/NotePreview'

/** styles */
import styles from '@renderer/styles/features/noteList/NoteList.module.scss'

/** hooks */
import { useNotesList } from '@renderer/hooks/index'

/** types */
import type { NoteInfo } from '@renderer/contents/note'


type NoteListProps = ComponentPropsWithoutRef<'ul'> & {
  onSelect?: () => void
}

export const NoteList = ({ onSelect, ...props }: NoteListProps) => {
  const { notes, selectedIndex, handleNoteSelect } = useNotesList({ onSelect })

  

  if (!notes?.length) {
    return (
      <ul {...props}>
        <span>ノートがありません。</span>
      </ul>
    )
  }

  return (
    <ul {...props} className={styles.wrapper}>
      {notes?.map((note: NoteInfo, i: number) => (
        <NotePreview
          key={note.uuid?.toString() ?? note.uuid ?? i}
          isActive={selectedIndex === i}
          onClick={() => handleNoteSelect(i)}
          {...note}
        />
      ))}
    </ul>
  )
}
