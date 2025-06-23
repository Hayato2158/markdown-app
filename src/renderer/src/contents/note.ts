export type NoteInfo = {
  uuid: string
  title: string
  content?: string
  lastEditTime: Date
}
export type NoteContent = string

/** Response Types */
export type ApiResponse<T> = {
  success: boolean
  data?: T
  error?: string
}

/** types */
export type GetNotes = () => Promise<ApiResponse<NoteInfo[]>>
export type ReadNote = (uuid: string) => Promise<ApiResponse<NoteInfo>>
export type WriteNote = (note: NoteInfo) => Promise<ApiResponse<NoteInfo>>
export type CreateNote = (filename: string) => Promise<ApiResponse<NoteInfo>>
export type DeleteNote = (filename: string, uuid: string) => Promise<ApiResponse<void>>
