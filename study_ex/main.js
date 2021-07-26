const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')


let win
app.on('ready', () => {
    win = new BrowserWindow({
        width: 600,
        height: 800,
        webPreferences: {
            enableRemoteModule: true,  // 默认关闭 开启才能在preload里使用remote
            nodeIntegration: true,
            contextIsolation: false,
            preload: path.join(app.getAppPath(), 'src/js/renderer.js')  // 这个版本 这是在渲染进程里使用node的唯一?方法
        }

    });
    win.loadFile('src/html/index.html')
    console.log("this is after create and load browserWindow")
    // sleep(5000)  // 发现这里执行完成渲染win里load的文件才显示出来  主进程先执行完毕
    win.on('closed', () => {
        win = null
    });
})

app.on('window-all-closed', () => {
    app.quit()
});


// 接受msg1的信息并且返回信息(msg1_reply)
// 几个参数 就几个arg
ipcMain.on('msg1', (event, arg1, arg2) => {
    console.log("got it", arg1, arg2)

    // 通过sender 可以给指定的渲染进程发送消息
    event.sender.send('msg1_reply', arg1.name + arg2.age)
})


function sleep(numberMillis) {
    var now = new Date();
    var exitTime = now.getTime() + numberMillis;
    while (true) {
        now = new Date();
        if (now.getTime() > exitTime)
            return;
    }
}