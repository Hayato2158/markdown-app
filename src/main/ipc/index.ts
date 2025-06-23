import { ipcMain } from 'electron'
import { NoteInfoRepository } from '@main/repository/noteInfoRepository'
import { CreateNote, DeleteNote, GetNote, ReadNote, WriteNote } from '@main/contents/ipc'
import { NoteInfo } from '@main/database/model/noteInfo'

const noteRepository = new NoteInfoRepository()

// ノート一覧を取得
ipcMain.handle('getNotes', async (): Promise<ReturnType<GetNote>> => {
  try {
    const notes = await noteRepository.findAll()
    return { success: true, data: notes }
  } catch (error) {
    console.error('Failed to get notes:', error)
    return { success: false, error: 'Failed to get notes' }
  }
})

// ノートを作成
ipcMain.handle('createNote', async (_, filename: string): Promise<ReturnType<CreateNote>> => {
  try {
    const note = await noteRepository.create(filename)
    return { success: true, data: note }
  } catch (error) {
    console.error('Failed to create note:', error)
    return { success: false, error: 'Failed to create note' }
  }
})

// ノートを読み込み
ipcMain.handle('readNote', async (_, uuid: string): Promise<ReturnType<ReadNote>> => {
  try {
    const note = await noteRepository.findByUuid(uuid)
    if (!note) {
      return { success: false, error: 'Note not found' }
    }
    return { success: true, data: note }
  } catch (error) {
    console.error('Failed to read note:', error)
    return { success: false, error: 'Failed to read note' }
  }
})

// ノートを書き込み
ipcMain.handle('writeNote', async (_, note: NoteInfo): Promise<ReturnType<WriteNote>> => {
  try {
    const updatedNote = await noteRepository.update(note)
    return { success: true, data: updatedNote }
  } catch (error) {
    console.error('Failed to write note:', error)
    return { success: false, error: 'Failed to write note' }
  }
})

// ノートを削除
ipcMain.handle('deleteNote', async (_, filename: string, uuid: string): Promise<ReturnType<DeleteNote>> => {
  try {
    await noteRepository.delete(filename, uuid)
    return { success: true }
  } catch (error) {
    console.error('Failed to delete note:', error)
    return { success: false, error: 'Failed to delete note' }
  }
}) 
