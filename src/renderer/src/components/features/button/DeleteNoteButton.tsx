/** components */
import { ActionButton, ActionButtonProps } from './ActionButton'
import delete_icon from '@renderer/assets/delete_icon.svg'
import { useSetAtom } from 'jotai'

/** store */
import { deleteNoteAtom, refreshNotesAtom } from '@renderer/store/useNotes'


/** scss */
import style from '@renderer/styles/features/button/deleteNoteButton.module.scss'

export const DeleteNoteButton = ({ ...props }: ActionButtonProps) => {
  const deleteNote = useSetAtom(deleteNoteAtom)
  const refreshNotes = useSetAtom(refreshNotesAtom)

  const handleDelete = async (): Promise<void> => {
    await deleteNote()
    await refreshNotes()
  }

  return (
    <ActionButton onClick={handleDelete} {...props}>
      <img src={delete_icon} className={style.wrapper} />
    </ActionButton>
  )
}
