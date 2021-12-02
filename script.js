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

if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({
            video: true
        })
        .then(function (stream) {
            camera.srcObject = stream;
        })
        .catch(function (err) {
            console.log("Something went wrong!");
        });
}