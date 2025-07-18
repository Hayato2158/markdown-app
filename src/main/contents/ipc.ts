export type NoteInfo = {
  uuid: string
  title: string
  content?: string
  lastEditTime: Date
}

export type NoteContent = string | undefined
export type valueOf<T> = T[keyof T]

/** Response Types */
export type ApiResponse<T> = {
  success: boolean
  data?: T
  error?: string
}

/** Notes Types */
export type GetNote = () => Promise<ApiResponse<NoteInfo[]>>
export type ReadNote = (uuid: string) => Promise<ApiResponse<NoteInfo>>
export type WriteNote = (note: NoteInfo) => Promise<ApiResponse<NoteInfo>>
export type CreateNote = (filename: string) => Promise<ApiResponse<NoteInfo>>
export type DeleteNote = (filename: string, uuid: string) => Promise<ApiResponse<void>>
