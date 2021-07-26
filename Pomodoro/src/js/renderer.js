const Timer = require('timer.js')
const { ipcRenderer } = require('electron')
const { remote } = require('electron')
const ProgressBar = require('progressbar.js/dist/progressbar.js')


const workTime = 25 * 60, restTime = 5 * 60

let count = 0
let progressBar
let state = {}
let startButton
let settingdiv
let timeingdiv
let workerTimer




function end() {
    workerTimer = null
    settingdiv.style.display = 'block'
    timeingdiv.innerHTML = ''
}

function updateTime(ms, maxtime) {
    let s = (ms / 1000).toFixed(0)
    let ss = s % 60
    let mm = (s / 60).toFixed(0)
    progressBar.set(1 - s / maxtime)
    progressBar.setText(`${mm.toString().padStart(2, '0')}:${ss.toString().padStart(2, '0')}`)
}

async function notification(job) {
    let res = await ipcRenderer.invoke('work-notification', { job: job, left: count })
    if (res === 'work') {
        startWork()
    } else if (res == 'rest') {
        startrest()
    } else if (res == 'end') {
        end()
    }
}



function startWork() {
    workTimer = new Timer({
        ontick: (ms) => {
            updateTime(ms, workTime)
        },
        onend: () => {
            count--
            console.log(count)
            notification('rest')
        }
    })
    workTimer.start(workTime)
}

function startrest() {
    workTimer = new Timer({
        ontick: (ms) => {
            updateTime(ms, restTime)
        },
        onend: () => {
            notification('work')
        }
    })
    workTimer.start(restTime)
}



window.addEventListener('load', () => {
    settingdiv = window.document.getElementById('setting')
    timeingdiv = window.document.getElementById('timing')
    startButton = document.getElementById('start-button')
    startButton.onclick = function () {
        count = Number(document.getElementById('count').value)
        if (isNaN(count) || count <= 0 || count > 48) {
            ipcRenderer.send('warning', { type: 0 })
        }

        settingdiv.style.display = 'none'
        timeingdiv.style.display = 'block'

        progressBar = new ProgressBar.Circle('#timing', {
            strokeWidth: 2,
            color: '#F44336',
            trailColor: '#eee',
            trailWidth: 1,
            svgStyle: null
        })

        startWork()
    }
})


