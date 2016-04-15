//Cordova specific functions



// Wait for device API libraries to load
//
function onLoad() {
  document.addEventListener("deviceready", onDeviceReady, false);
}


// device APIs are available
//
function onDeviceReady() {
  console.log("CORDOVA DEVICE APIS READY AND AVAILABLE");
  document.addEventListener("pause", onPause, false);
}


function  onPause(){
  console.log("ANDROID PAUSE SUCCESSFUL!!!!!!! YAAAAAAAAAAAY");
  alert("Pause worked");
}
