// 環境変数の設定を最初に行う
import dotenv from 'dotenv'
dotenv.config({ path: '.env.main' })

import { app, shell, BrowserWindow, ipcMain, crashReporter } from 'electron'
import { autoUpdater } from 'electron-updater'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { LOG_LEVEL, LOG_MESSAGE } from './contents/enum'
import Database from '@main/database/index'
import './ipc/useNotes'
import 'reflect-metadata'
import { fetchNotesFromSupabase } from './repository/supabaseNoteRepository'
import { syncAllLocalNotesToSupabase } from './repository/supabaseNoteRepository'
import { signInWithEmail } from './auth/supabaseAuth'




/** composable */
import { logger } from './utils/logger'

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 900,
    show: false,
    center: true,
    title: '俺のノート',
    vibrancy: 'appearance-based', // macOS ウインドウに曇ガラスのエフェクトの設定
    visualEffectState: 'active', // macOS ウインドウの動作状態を設定
    titleBarStyle: 'hidden', // タイトルバーを隠す
    titleBarOverlay: true, // ウィンドウコントロールオーバーレイ
    trafficLightPosition: { x: 15, y: 10 }, // フレームレスウインドウの信号機ボタンのカスタム位置を設定
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: true, // サンドボックス
      contextIsolation: true // コンテキストの分離
    }
  })

  mainWindow.on('ready-to-show', async (): Promise<void> => {
    mainWindow.show()
    
    // ウィンドウが表示された後にSupabaseからノートを取得
    try {
      await fetchNotesFromSupabase()
    } catch (error) {
      console.error('Supabaseからのノート取得に失敗しました:', error)
    }
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })


  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    console.log(`URL: `, process.env['ELECTRON_RENDERER_URL'])
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  // デバッグ
  if (is.dev) {
    mainWindow.webContents.openDevTools()
  }

  // 自動アップデート
  if (!is.dev) {
    autoUpdater.checkForUpdates()
  }
}

// クラッシュレポート
crashReporter.start({
  uploadToServer: false
})



app.whenReady().then(async () => {
  await Database.createConnection()

  const user = await signInWithEmail(process.env.SUPABASE_EMAIL!, process.env.SUPABASE_PASSWORD!)
  if (user) {
    console.log('[自動ログイン] 成功:', user.email)

    // ログイン後に同期・取得を実施
    await syncAllLocalNotesToSupabase()
    await fetchNotesFromSupabase()
  } else {
    console.warn('[自動ログイン] 失敗')
  }

  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))
  
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('will-finish-launching', async (): Promise<void> => {

})


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    // macOS 以外の場合、アプリケーションを終了する
    logger(LOG_LEVEL.INFO, LOG_MESSAGE.APP_FINISH)
    app.quit()
  }
})

// DB接続の終了
app.on('will-quit', (): void => {
  Database.close()
})

const isTheLock = app.requestSingleInstanceLock()

// NOTE: 既にアプリが起動されていたら、新規に起動したアプリを終了
if (!isTheLock) {
  app.quit()
}
