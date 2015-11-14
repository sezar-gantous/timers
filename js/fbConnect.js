/*
*This file is all about firebase
*
*Apr 12 2015
*/

var db = new Firebase("https://wakeupheroku.firebaseio.com/timers");
var sites

// Attach an asynchronous callback to read data
db.on("value", function(snapshot) {
  sites = snapshot.val(); 
  console.log(sites);
}, function (errorObject) {
  console.log("The read failed: " + errorObject.code);
});

