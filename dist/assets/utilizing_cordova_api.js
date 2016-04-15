//Cordova specific functions

  console.log("YESYESYESYESYESYESYES");
  document.addEventListener("deviceready", onDeviceReady,false);
// Wait for device API libraries to load
//
function onLoad() {
  console.log("ON LOAD - ITS LOADED!!!!");
    document.addEventListener("deviceready", onDeviceReady, false);
}
// device APIs are available
//
function onDeviceReady() {
  console.log("DEVICE APIS READY AND AVAILABLE");
  document.addEventListener("pause", onPause, false);
}
function  onPause(){
  console.log("ANDROID PAUSE SUCCESSFUL!!!!!!! YAAAAAAAAAAAY");
  alert("Pause worked");
}
