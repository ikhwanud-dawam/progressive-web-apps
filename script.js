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
    icon: 'images/pwa-512x512.png',
    vibrate: [100, 50, 100],
    data: {
        primaryKey: 1
    },
    actions: [{
            action: 'explore',
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

// Microphone access
const recBut = document.querySelector("#start-rec")
const stopBut = document.querySelector("#stop-rec")
const soundClips = document.querySelector(".sound-clips")

stopBut.disabled = true

if (navigator.mediaDevices) {
    console.log('getUserMedia supported')
    var constraints = {
        audio: true
    }
    var chunks = []

    stopBut.disabled = false

    navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
        var mediaRec = new MediaRecorder(stream);
        var stateRec = document.querySelector('#rec-state')

        recBut.onclick = function () {
            mediaRec.start()
            console.log(mediaRec.state)
            console.log("recorder started")
            stateRec.classList.replace('rec-stopped', 'rec-start')
            stateRec.innerHTML = "Recording ..."
        }

        stopBut.onclick = function () {
            mediaRec.stop()
            console.log(mediaRec.state)
            console.log("recored stopped")
            stateRec.classList.replace('rec-start', 'rec-stopped')
            stateRec.innerHTML = "Recorder stopped"
        }

        mediaRec.onstop = function (e) {
            var clipName = prompt("Enter a name for your sound", "my unnamed clip")

            var clipCont = document.createElement('article')
            var clipLabel = document.createElement('p')
            var audio = document.createElement('audio')
            var playBut = document.createElement('button')
            var delBut = document.createElement('button')

            clipLabel.innerHTML = clipName
            delBut.innerHTML = "Delete audio"
            playBut.innerHTML = "Play audio"

            clipCont.appendChild(audio)
            clipCont.appendChild(clipLabel)
            clipCont.appendChild(playBut)
            clipCont.appendChild(delBut)
            soundClips.appendChild(clipCont)

            var blob = new Blob(chunks, {
                'type': 'audio/ogg; codecs=opus'
            })
            chunks = []
            var audioUrl = window.URL.createObjectURL(blob)
            audio.src = audioUrl

            console.log("recorder stop")

            playBut.onclick = function () {
                audio.play()
            }

            delBut.onclick = function (e) {
                let evtTgt = e.target
                evtTgt.parentNode.parentNode.removeChild(evtTgt.parentNode)
            }
        }

        mediaRec.ondataavailable = function (e) {
            chunks.push(e.data);
        }
    }).catch(function (err) {
        console.log('The following error ocured : ' + err)
    })
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
function checkConn() {
    var connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection
    var type = connection.type
    var eftype = connection.effectiveType
    var downMax = connection.downlinkMax

    console.log(type)
    if (type == 'wifi') {
        document.getElementById("conn-type").innerHTML = "No Cellular Connection"
        document.getElementById("conn-ef-type").innerHTML = ""
        document.getElementById("conn-down").innerHTML = ""
    } else if(type == 'none'){
        document.getElementById("conn-type").innerHTML = "No Cellular Connection"
        document.getElementById("conn-ef-type").innerHTML = ""
        document.getElementById("conn-down").innerHTML = ""
    } else {
        document.getElementById("conn-type").innerHTML = "Connection type : " + type + ""
        document.getElementById("conn-ef-type").innerHTML = "Connection effective type : " + eftype + ""
        document.getElementById("conn-down").innerHTML = "Connection download speed : " + downMax + ""
    }

    function updateConnectionStatus() {
        console.log("Connection type change from " + type + " to " + connection.type)
        type = connection.type
    }

    connection.addEventListener('change', updateConnectionStatus)
}

// Wifi Acesss
function checkConnW() {
    var connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection
    var type = connection.type
    var eftype = connection.effectiveType
    var downMax = connection.downlinkMax

    if (type == 'wifi') {
        document.getElementById("conn-type-2").innerHTML = "Connection type : " + type + ""
        document.getElementById("conn-ef-type-2").innerHTML = "Connection effective type : " + eftype + ""
        document.getElementById("conn-down-2").innerHTML = "Connection download speed : " + downMax + ""
    } else {
        document.getElementById("conn-type-2").innerHTML = "No Wifi Connection"
        document.getElementById("conn-ef-type-2").innerHTML = ""
        document.getElementById("conn-down-2").innerHTML = ""
    }


    function updateConnectionStatus() {
        console.log("Connection type change from " + type + " to " + connection.type)
        type = connection.type
    }

    connection.addEventListener('change', updateConnectionStatus)
}

// Fingerprint Access
if(!window.PublicKeyCredential){
    console.log('Not Supported');
}

function createCred(){
    var publicKey = {
        // The challenge is produced by the server; see the Security Considerations
        challenge: new Uint8Array([21,31,105 /* 29 more random bytes generated by the server */]),
      
        // Relying Party:
        rp: {
          name: "ACME"
        },
      
        // User:
        user: {
          id: new Uint8Array(16),
          name: "ikhwanud-dawam.github.io",
          displayName: "",
        },
      
        // This Relying Party will accept either an ES256 or RS256 credential, but
        // prefers an ES256 credential.
        pubKeyCredParams: [
          {
            type: "public-key",
            alg: -7 // "ES256" as registered in the IANA COSE Algorithms registry
          },
          {
            type: "public-key",
            alg: -257 // Value registered by this specification for "RS256"
          }
        ],
      
        timeout: 360000, 
        
        challenge: new Uint8Array([ // must be a cryptographically random number sent from a server
            0x8C, 0x0A, 0x26, 0xFF, 0x22, 0x91, 0xC1, 0xE9, 0xB9, 0x4E, 0x2E, 0x17, 0x1A, 0x98, 0x6A, 0x73,
            0x71, 0x9D, 0x43, 0x48, 0xD5, 0xA7, 0x6A, 0x15, 0x7E, 0x38, 0x94, 0x52, 0x77, 0x97, 0x0F, 0xEF
        ]).buffer
      };

      var getCredentialDefaultArgs = {
        publicKey: {
            timeout: 60000,
            // allowCredentials: [newCredential] // see below
            challenge: new Uint8Array([ // must be a cryptographically random number sent from a server
                0x79, 0x50, 0x68, 0x71, 0xDA, 0xEE, 0xEE, 0xB9, 0x94, 0xC3, 0xC2, 0x15, 0x67, 0x65, 0x26, 0x22,
                0xE3, 0xF3, 0xAB, 0x3B, 0x78, 0x2E, 0xD5, 0x6F, 0x81, 0x26, 0xE2, 0xA6, 0x01, 0x7D, 0x74, 0x50
            ]).buffer
        },
    };
      
      // Note: The following call will cause the authenticator to display UI.
      navigator.credentials.create({ publicKey })
        .then(function (cred) {
          console.log('new credential', cred);

          var idList = [{
              id: cred.rawId,
              transports: ['usb', 'nfc', 'ble'],
              type: 'public-key'
          }]

          getCredentialDefaultArgs.publicKey.allowCredentials = idList
          return navigator.credentials.get(getCredentialDefaultArgs)
        }).then(function (assertion){
            console.log('Assertion', assertion);
            const registered = document.getElementById('register')
            registered.innerHTML = 'Credential Created'
        }).catch(function (err) {
          console.log("Error", err);
        });
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

// Infra Red
function getIR(){
    // NOT SUPPORTED
}

//NFC Access
async function nfcAccess() {
    const ndef = new NDEFReader();
    await ndef.scan();
    ndef.onreading = async (event) => {
        const decoder = new TextDecoder();
        for (const record of event.message.records) {

            document.getElementById("nfc-record-type").innerHTML = "Record type : " + record.recordType + ""
            document.getElementById("nfc-media-type").innerHTML = "Media type : " + record.mediaType + ""
            document.getElementById("nfc-data").innerHTML = "NFC Data : " + decoder.decode(record.data) + ""

            console.log("Record type:  " + record.recordType);
            console.log("MIME type:    " + record.mediaType);
            console.log("=== data ===\n" + decoder.decode(record.data));
        }

        try {
            await ndef.write("Overriding data is fun!");
        } catch (error) {
            console.log(`Write failed :-( try again: ${error}.`);
        }
    };
}

//Accelerometer
function accelerometer() {
    let acl = new Accelerometer({
        frequency: 60
    })
    acl.addEventListener('reading', () => {
        console.log("ACL:" + acl)
        console.log("Acceleration along the X-axis " + acl.x);
        console.log("Acceleration along the Y-axis " + acl.y);
        console.log("Acceleration along the Z-axis " + acl.z);

        document.getElementById("acl-x").innerHTML = "Acl X-axis " + acl.x + ""
        document.getElementById("acl-y").innerHTML = "Acl Y-axis " + acl.y + ""
        document.getElementById("acl-z").innerHTML = "Acl Z-axis " + acl.z + ""
    })
    acl.start();
}

//Magnetometer
function magnetometer() {
    let magSensor = new Magnetometer({
        frequency: 60
    });

    magSensor.addEventListener('reading', e => {
        console.log("Magnetic field along the X-axis " + magSensor.x);
        console.log("Magnetic field along the Y-axis " + magSensor.y);
        console.log("Magnetic field along the Z-axis " + magSensor.z);

        document.getElementById("mag-x").innerHTML = "Mag X-axis " + magSensor.x + ""
        document.getElementById("mag-y").innerHTML = "Mag Y-axis " + magSensor.y + ""
        document.getElementById("mag-z").innerHTML = "Mag Z-axis " + magSensor.z + ""
    });
    magSensor.start();
}

//Gyroscope
function gyroscope() {
    let gyroscope = new Gyroscope({
        frequency: 60
    });

    gyroscope.addEventListener('reading', e => {
        console.log("Angular velocity along the X-axis " + gyroscope.x);
        console.log("Angular velocity along the Y-axis " + gyroscope.y);
        console.log("Angular velocity along the Z-axis " + gyroscope.z);

        document.getElementById("gyro-x").innerHTML = "Gyro X-axis " + gyroscope.x + ""
        document.getElementById("gyro-y").innerHTML = "Gyro Y-axis " + gyroscope.y + ""
        document.getElementById("gyro-z").innerHTML = "Gyro Z-axis " + gyroscope.z + ""
    });
    gyroscope.start();
}


// Serial Number
function getSerial() {
    var serialNumber = navigator.device.getSerialNumber()

    console.log(serialNumber)
}

// IMEI
function getImei() {
    var imeiDial = "*#06#"
    window.open('tel:' + imeiDial)
}

// Non connection Use
var conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection
var type = conn.type

console.log(type)

if (type == 'none') {
    document.getElementById("no-conn-uses").innerHTML = "No Connection detected"
    document.getElementById("feature").innerHTML = "but some features still can be used"
}