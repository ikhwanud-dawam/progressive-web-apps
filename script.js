// Geo Access
let geo = document.getElementById("geo");

function getLocation() {
    if (navigator.geolocation) {
        console.log(navigator.geolocation.getCurrentPosition)
        navigator.geolocation.getCurrentPosition(showPosition)
    } else {
        geo.innerHTML = "Geolocation is not supported by this browser."
    }
}

function showPosition(position) {
    geo.innerHTML = "Latitude: " + position.coords.latitude +
        "<br>Longitude: " + position.coords.longitude
}


// Camera Access
let camera = document.querySelector("#cameraElement");

function cameraOn() {
    if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({
                video: {
                    width: {
                        ideal: 200
                    },
                    height: {
                        ideal: 200
                    },
                    facingMode: {
                        exact: 'environment'
                    }
                }
            })
            .then(function (stream) {
                camera.srcObject = stream;
            })
            .catch(function (err) {
                console.log("Something went wrong!");
            });
    }
}

// Notification Access
const options = {
    body: 'Congratulation, notification success',
    vibrate: [100, 50, 100],
    data: {
        primaryKey: 1
    },
    actions: [{
            action: 'go',
            title: 'Go to the site'
        },
        {
            action: 'close',
            title: 'No thank you'
        }
    ]
}

function notifyMe() {
    Notification.requestPermission(function (result) {
        if (result === 'granted') {
            navigator.serviceWorker.ready.then(function (reg) {
                reg.showNotification('Hello There', options)
            })
        }
    })
}

// Speaker
function playSound() {
    var audio = document.getElementById("audio")
    audio.volume = 0.1
    audio.play()
}

function stopSound() {
    var audio = document.getElementById("audio")
    audio.pause()
}

// Contact Book
const supported = ('contacts' in navigator || 'ContactManager' in window)
const result = document.getElementsByClassName("result")

console.log(supported)

if (supported == false) {
    var notSupp = document.getElementById("not-supp")
    notSupp.removeAttribute('hidden')
    console.log("not supp")
}

async function selectContact() {
    var contacts = await navigator.contacts.select(['name'], {
        multiple: true
    })

    if (contacts.length) {
        renderResults(contacts)

        document.getElementById('del').removeAttribute('hidden')
        var del = document.getElementById("btn-del")
        del.addEventListener('click', () => {
            document.getElementById('del').setAttribute('hidden', true)
            var el = document.getElementById("result")

            while (el) {
                el.removeChild(el.childNodes[0])
            }
        })
    }

    if (!contacts.length) {
        return
    }
}

function renderResults(contacts) {
    contacts.forEach(contact => {
        var node = document.createElement('li')
        var textNode = document.createTextNode(contact.name)
        node.appendChild(textNode)

        document.getElementById('result').appendChild(node)
    });
}

// Cellular Access
function checkConn(){
    var connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection
    var type = connection.type
    var eftype = connection.effectiveType
    var downMax = connection.downlinkMax

    console.log(type)
    if(type == 'wifi'){
        document.getElementById("conn-type").innerHTML = "No Cellular Connection"
    } else{
        document.getElementById("conn-type").innerHTML = "Connection type : " + type + ""
        document.getElementById("conn-ef-type").innerHTML = "Connection effective type : " + eftype + ""
        document.getElementById("conn-down").innerHTML = "Connection download speed : " + downMax + ""
    }

    function updateConnectionStatus(){
        console.log("Connection type change from " + type + " to " + connection.type)
        type = connection.type
    }

    connection.addEventListener('change', updateConnectionStatus)
}

// Wifi Acesss
function checkConnW(){
    var connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection
    var type = connection.type
    var eftype = connection.effectiveType
    var downMax = connection.downlinkMax

    if(type == 'wifi'){
        document.getElementById("conn-type-2").innerHTML = "Connection type : " + type + ""
        document.getElementById("conn-ef-type-2").innerHTML = "Connection effective type : " + eftype + ""
        document.getElementById("conn-down-2").innerHTML = "Connection download speed : " + downMax + ""
    } else{
        document.getElementById("conn-type-2").innerHTML = "No Wifi Connection"
    }

    
    function updateConnectionStatus(){
        console.log("Connection type change from " + type + " to " + connection.type)
        type = connection.type
    }

    connection.addEventListener('change', updateConnectionStatus)
}

//Face Detection
const video = document.getElementById('video')
let model;
const canvas = document.getElementById('canvas')
let ctx = canvas.getContext('2d')

const setupCamera = () => {
    navigator.mediaDevices.getUserMedia({
            video: {
                width: {
                    ideal: 300
                },
                height: {
                    ideal: 300
                }
            },
            audio: false
        })
        .then(stream => {
            video.srcObject = stream
        })
}
const detectFaces = async () => {
    const prediction = await model.estimateFaces(video, false)
    // console.log(prediction)

    ctx.drawImage(video, 0, 0, 300, 300)

    prediction.forEach(pred => {
        ctx.beginPath()
        ctx.lineWidth = '4'
        ctx.strokeStyle = 'blue'
        ctx.rect(
            pred.topLeft[0],
            pred.topLeft[1],
            pred.bottomRight[0] - pred.topLeft[0],
            pred.bottomRight[1] - pred.topLeft[1],
        )
        ctx.stroke()

        ctx.fillStyle = 'red'
        pred.landmarks.forEach(landmark => {
            ctx.fillRect(landmark[0], landmark[1], 5, 5)
        })
    })
}
video.addEventListener('loadeddata', async () => {
    model = await blazeface.load()
    setInterval(detectFaces, 100)
})

//Bluetooth
function getBluetoothAccess() {
    navigator.bluetooth.requestDevice({
            filters: [{
                services: ['battery_service']
            }]
        })
        .then(device => {
            console.log(device.name)
        })
        .catch(error => {
            console.error(error);
        });
}