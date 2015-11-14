/*
*This file is all about firebase
*
*Apr 12 2015
*/

var db = new Firebase("https://wakeupheroku.firebaseio.com/timers");
var timers

// Attach an asynchronous callback to read data
db.on("value", function(snapshot) {
  timers = snapshot.val(); 
  console.log(timers);
}, function (errorObject) {
  console.log("The read failed: " + errorObject.code);
});

