//Cordova specific functions

/*
IDK why, but placing this function call in window.onload or document.onload fails to fire it off,
as does setting the call in the html (which gives a Content Security Policy error).
So just call it here, whatever it works in Cordova
*/
gameContainerLoaded();

// Wait for device API libraries to load
//
function gameContainerLoaded() {
  console.log("DOCUMENT LOADED")
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
