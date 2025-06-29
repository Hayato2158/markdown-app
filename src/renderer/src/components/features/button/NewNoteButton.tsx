import { useSetAtom } from 'jotai'

/** components */
import { ActionButton, ActionButtonProps } from '@renderer/components/features/button/ActionButton'

/** store */
import { createNoteAtom, refreshNotesAtom } from '@renderer/store/useNotes'

/** scss */
import style from '@renderer/styles/features/button/newNoteButton.module.scss'
import newNote_icon from '@renderer/assets/newNote_icon.svg'

/** types */
import { NoteInfo } from '@renderer/contents/note'

export const NewNoteButton = ({ ...props }: ActionButtonProps) => {
  const createNote = useSetAtom(createNoteAtom)
  const refreshNotes = useSetAtom(refreshNotesAtom)

  const handleAddNote = async (): Promise<void> => {
    await createNote()
    await refreshNotes()
  }

  return (
    <ActionButton onClick={handleAddNote} {...props}>
      <img src={newNote_icon} className={style.wrapper} />
    </ActionButton>
  )
}
