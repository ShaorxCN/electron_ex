let { remote, BrowserWindow, ipcRenderer } = require('electron');
const path = require('path')

window.addEventListener('DOMContentLoaded', () => {
    let win_setting = null
    document.getElementById("openNewWindows").addEventListener('click', function () {
        // 不推荐使用remote
        win_setting = new remote.BrowserWindow({
            webPreferences: {
                enableRemoteModule: true,  // 默认关闭 开启才能在preload里使用remote
                nodeIntegration: true,
                contextIsolation: false,
                preload: path.join(__dirname, 'setting_render.js')  // 这个版本 这是在渲染进程里使用node的唯一?方法
            }
        });

        win_setting.loadFile('src/html/setting.html')
    });

    document.getElementById("openDevToolsBtn").addEventListener('click', function () {
        remote.getCurrentWindow().webContents.openDevTools();

    });


    document.getElementById("sendMsg").addEventListener('click', () => {
        ipcRenderer.send('msg1', {
            'name': "evan"
        }, { 'age': 12 })
        console.log('send end')
    });

    // 这里是通过channel[msg1_reply]和ipcMain通信
    ipcRenderer.on('msg1_reply', (event, args) => {
        alert(args);
        //  window.document.getElementById('div1').textContent = 'gone'
    })

    document.getElementById("sendMsg2").addEventListener('click', () => {
        ipcRenderer.sendTo(win_setting.webContents.id, 'msg_msg', {
            'name': "gkond"
        }, { 'age': 121 })
        console.log('send end')
    });




})









