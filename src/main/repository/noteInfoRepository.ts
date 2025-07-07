import Database from '@main/database/index'
import { DeleteResult, UpdateResult } from 'typeorm'
import { NoteInfoModel } from '@main/database/model/noteInfo'
import { uploadNoteToSupabase, deleteNoteFromSupabase } from './supabaseNoteRepository'



/** types */
import { NoteInfo } from '@main/contents/ipc'

export const getNoteInfo = async (uuid: string): Promise<NoteInfoModel> => {
  const connection = await Database.createConnection()
  return await connection
    .getRepository(NoteInfoModel)
    .createQueryBuilder('noteInfo')
    .where({ uuid })
    .getOneOrFail()
}

export const readNotesInfo = async (): Promise<NoteInfoModel[]> => {
  const connection = await Database.createConnection()
  return await connection
    .getRepository(NoteInfoModel)
    .createQueryBuilder('noteInfo')
    .select()
    .getMany()
}

export const writeNoteInfo = async (note: NoteInfo): Promise<UpdateResult> => {
  const { uuid, content, title, lastEditTime } = note
  const connection = await Database.createConnection()
  return await connection
    .getRepository(NoteInfoModel)
    .createQueryBuilder()
    .update(NoteInfoModel)
    .set({ content, title, lastEditTime })
    .where('uuid= :id', { id: uuid })
    .execute()
}

export const saveNoteInfo = async (noteInfo: NoteInfo): Promise<void> => {
  const connection = await Database.createConnection()
  connection.getRepository(NoteInfoModel).save(noteInfo)


await uploadNoteToSupabase({
  id: noteInfo.uuid,
  title: noteInfo.title,
  content: noteInfo.content ?? '', // ← undefinedだったら空文字にする
  updated_at: noteInfo.lastEditTime.toISOString()
})
}


export const deleteNoteInfo = async (uuid: string): Promise<DeleteResult> => {
  const connection = await Database.createConnection()

  const result = await connection
    .getRepository(NoteInfoModel)
    .createQueryBuilder()
    .delete()
    .from(NoteInfoModel)
    .where('uuid = :id', { id: uuid })
    .execute()

  await deleteNoteFromSupabase(uuid)

  return result
}

export const NoteInfoRepository = {
  getNoteInfo,
  readNotesInfo,
  writeNoteInfo,
  saveNoteInfo,
  deleteNoteInfo
}

