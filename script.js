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
function openContact(){
    const contacs = await navigator.contacs.select(['name', 'email'], {multiple: true})

    if(!contacs.length){
        return 
    }

    populateRecipents(contacs)
}

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

