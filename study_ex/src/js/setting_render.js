let { remote, BrowserWindow, ipcRenderer } = require('electron');


window.addEventListener('DOMContentLoaded', () => {
    let win = null



    document.getElementById("sendMsg").addEventListener('click', () => {
        ipcRenderer.send('msg1', {
            'name': "evan2"
        }, { 'age': 122 })
        console.log('send end')
    });


    // 这里是通过channel[msg1_reply]和ipcMain通信
    ipcRenderer.on('msg1_reply', (event, args) => {
        alert(args);
        //  window.document.getElementById('div1').textContent = 'gone'
    })


    // 这里是通过channel[msg_msg]和另外一个渲染进程通信
    ipcRenderer.on('msg_msg', (event, arg1, arg2) => {
        console.log("got it", arg1, arg2)
        alert(arg1.name + arg2.age);
        //  window.document.getElementById('div1').textContent = 'gone'
    })
})









