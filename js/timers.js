
var empty = '<li class="list-group-item" id="empty">Nothing to time...</li>';
var timersArray = [];

    $(document).ready(function() {
      loadFromJson();
    });




/*when user firt adds a site*/
    function addTimer() {
       $("#info").show();

        //var url = $("#url").val();
        var task = $("#task").val();
        var min = $("#min").val();
        var sec = $("#sec").val();
        var hour = $("#hour").val();
       

       db.child(task).set({
        task: task,
        hour: hour,
        min: min,
        sec: sec,
        stat:"pause"
       });


      $("#info").hide('fast');

    }



    function pause(id,name) {

       // change the button to play(hide pause button show play button..)
         $('#buttonPause-'+ name).hide(); 
         $('#buttonPlay-'+ name).show();
          
          //pause timer
        timersArray[id].rest();

        db.child(name).update({
          stat: "pause"
        });
    }

    function removeTimer (id,name) {
      // CSS STUFF..
     
     //clear the whole li anf children fron DOM
     //$("li-"+url).remove();

     
       console.log("removing");
       //remove from firebase
      db.child(name).remove();
      
      timersArray.pop(id);

    }

    function editing (id,hour,min,sec,task,status) {
      //preparing modal
      $("#modalLabel").html('Edite '+task);
      $("#editTask").val(task);
      $("#editHour").val(hour);
      $("#editMin").val(min);
      $("#editSec").val(sec);

      //add click event for save button
      $("#editSave").click(function(){
        
        //remove current 
           db.child(task).remove();
           timersArray.pop(id);
        //creat a new one....
        db.child($("#editTask").val()).set({
          name: $("#editTask").val()+'',
          min : $("#editMin").val(),
          sec : $("#editSec").val(),
          hour : $("#editHour").val(),
          stat: status
        });

        $('#editModal').modal('hide');

      });

      $('#editModal').modal('show')
    }


    function play(id,name) {
      // change the button to pause(hide play button show pause button..)
         $('#buttonPlay-'+ name).hide();
         $('#buttonPause-'+ name).show(); 

   //no need to update since its already playing
     if(name !== null){
      db.child(name).update({
               stat: "play"
             });
     }
        console.log("timer stated");

        //start the timer
         timersArray[id].start();
    }


    function print (task,id) {
     var str = '';
     var hour = task.hour;
     var min = task.min;
     var sec = task.sec;
     var name = task.name;
     


     str+= '<li id="li-'+ name +'" class="list-group-item">';
     str+= '<b>';
     str+= name;
     str+= '</b>';
     str+= ' is Set to: <div class="'+name+'-'+id+'"></div>';
     
     str+= '<button id="remove-'+ name +'" class="alert alert-danger remove" onClick="removeTimer('+id+','+"'"+name+"'"+');" title="delete timer">'+
               '<span id="spanRemove-'+ name +'" class="glyphicon glyphicon-remove"></span> </button>';
     str+= '<button id="edit-'+ name +'" class="alert alert-info edit" onClick="editing('+id+','+hour+','+min+','+sec+','+"'"+name+"'"+','+"'"+task.stat+"'"+');" title="edit Task">'+
               '<span id="spanEdit-'+ name +'" class="glyphicon glyphicon-pencil"></span> </button>';
     str+= '<button id="buttonPause-'+ name +'" class="alert alert-warning pause" onClick="pause('+id+','+"'"+name+"'"+');" title="pause timer">'+ 
              '<span id="spanPause-'+ name +'" class="glyphicon glyphicon glyphicon-pause"></span> </button>';
     str+= '<button id="buttonPlay-'+ name +'" class="alert alert-success play" onClick="play('+id+','+"'"+name+"'"+');" title="resume timer">'+ 
              '<span id="spanPlay-'+ name +'" class="glyphicon glyphicon glyphicon-play"></span> </button>';
     str += '</li>';
      $("#timers").append(str);
    
     if(task.stat === 'pause'){
       // change the button to play(hide pause button show play button..)
       
         $('#buttonPause-'+ name).hide(); 
         $('#buttonPlay-'+ name).show(); 
     }


    }


/*load all data from firebase*/
function loadFromJson () {
  var i=0;

  // Attach an asynchronous callback to read data
  db.on("value", function(snapshot) {
   
     if(snapshot.val() !== null){
            // iterate through data
        //clear the list first
          $("#timers").empty();
        snapshot.forEach(function(s) {
          //console.log(s.val().stat);
            var task = s.val();
          
           //print out html with data
           print(task,i);
           
          if(task.stat === 'pause'){
              timersArray.push($('.'+task.name+'-'+i).FlipClock((task.hour*3600 + task.min*60 + task.sec),{
		              clockFace: 'HourlyCounter',
                  autoStart: false,
					        countdown: true
		          }));
          }
          else
          {       
              timersArray.push($('.'+task.name+'-'+i).FlipClock((task.hour*3600 + task.min*60 + task.sec),{
		              clockFace: 'HourlyCounter',
                  autoStart: true,
					        countdown: true
		          }));
          } 
           
           i++;
        });
    }
    else{
         //empty is defined top of the file
       $("#timers").html(empty);
    } 
      console.log(snapshot.val());
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
    
    $("#theError").html(errorObject.code);
    $("#err").show();

  });

   

}

