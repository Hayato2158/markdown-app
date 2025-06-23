import { IElectronAPI } from './index'

declare global {
  interface Window {
    electron: IElectronAPI
  }
}
