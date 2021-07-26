const { app, BrowserWindow, Notification, ipcMain, dialog } = require('electron')
const path = require('path')

let win
app.whenReady().then(() => {
    handleIPC()
    win = new BrowserWindow({
        icon: 'src/icon/icon.jfif',
        width: 250,
        height: 350,
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },

    })
    win.loadFile('src/html/index.html')

})

app.on('window-all-closed', () => {
    app.quit()
});

function handleIPC() {
    ipcMain.on('warning', () => {
        dialog.showErrorBox('提示', '请输入1-48之间的整数')
    })

    ipcMain.handle('work-notification', async function (event, req) {
        let notification
        let { job, left } = req
        let res = await new Promise((resolve) => {
            if (left === 0) {
                notification = new Notification({
                    title: '任务完成',
                    body: '自由时间',
                })
                notification.show()
                notification.on('close', () => {
                    resolve('end')
                })

                notification.on('click', () => {
                    resolve('end')
                })
            } else if (job === 'rest') {
                notification = new Notification({
                    title: '工作结束',
                    body: '开始休息5min',
                })
                notification.show()
                notification.on('close', () => {
                    resolve('rest')
                })

                notification.on('click', () => {
                    resolve('rest')
                })
            } else if (job === 'work') {
                notification = new Notification({
                    title: '休息结束',
                    body: '开始工作25min',
                })
                notification.show()
                notification.on('close', () => {
                    resolve('work')
                })

                notification.on('click', () => {
                    resolve('work')
                })
            }
        })
        return res
    })
}