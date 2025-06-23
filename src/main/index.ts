import { app, shell, BrowserWindow, ipcMain, crashReporter } from 'electron'
import { autoUpdater } from 'electron-updater'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { LOG_LEVEL, LOG_MESSAGE } from './contents/enum'
import Database from '@main/database/index'
import 'reflect-metadata'


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
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
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





// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('will-finish-launching', async (): Promise<void> => {
  // DB接続
  await Database.createConnection()
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
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

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
