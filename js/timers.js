
var empty = '<li class="list-group-item" id="empty">Nothing to time...</li>';
var timersArray = [];

    $(document).ready(function() {
      loadFromJson();
    });




/*when user firt adds a site*/
    function addTimer() {
      var temp;
       $("#info").show();

        //var url = $("#url").val();
        var task = $("#task").val();
        var min = $("#min").val();
        var sec = $("#sec").val();
        var hour = $("#hour").val();
       

       db.child(task).set({
        name: task,
          min : temp = (min === "")?0:min,
          sec : temp = (sec==="")?0:sec,
          hour : temp = (hour==="")?0:hour,
        stat:"pause"
       });


      $("#info").hide('fast');

    }



    function pause(id,name,time) {

       // change the button to play(hide pause button show play button..)
         $('#buttonPause-'+ name).hide(); 
         $('#buttonPlay-'+ name).show();
          
          //reset timer
          //timersArray[id].countdown(new Date(new Date().valueOf() + time * 1000));
         // pause timer
          //timersArray[id].countdown('pause');
          
         $('#'+name+'-'+id).countdown('option', {until: time });
         $('#'+name+'-'+id).countdown('pause');  

        db.child(name).update({
          stat: "pause"
        });
    }

    function removeTimer (id,name) {
      // CSS STUFF..
     
     //clear the whole li anf children fron DOM
     //$("li-"+url).remove();

      timersArray.pop(id);
     
       console.log("removing");
       //remove from firebase
      db.child(name).remove();
      

    }

    function editing (id,hour,min,sec,task,status) {
      var temp;
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
          name: $("#editTask").val(),
          min : temp = ($("#editMin").val() === "")?0:$("#editMin").val(),
          sec : temp = ($("#editSec").val()==="")?0:$("#editSec").val(),
          hour : temp = ($("#editHour").val())===""?0:$("#editHour").val(),
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
         //timersArray[id].countdown('resume');
    }


    function print (task,id) {
     var str = '';
     var hour = task.hour;
     var min = task.min;
     var sec = task.sec;
     var name = task.name;
     var date = new Date(new Date().valueOf() + (task.hour*3600 + task.min*60 + task.sec) * 1000);


     str+= '<li id="li-'+ name +'" class="list-group-item">';
     str+= '<b>';
     str+= name;
     str+= '</b>';
     str+= ' is Set to: <div class="lead" id="'+name+'-'+id+'"></div>';
     
     str+= '<button id="remove-'+ name +'" class="alert alert-danger remove" onClick="removeTimer('+id+','+"'"+name+"'"+');" title="delete timer">'+
               '<span id="spanRemove-'+ name +'" class="glyphicon glyphicon-remove"></span> </button>';
     str+= '<button id="edit-'+ name +'" class="alert alert-info edit" onClick="editing('+id+','+hour+','+min+','+sec+','+"'"+name+"'"+','+"'"+task.stat+"'"+');" title="edit Task">'+
               '<span id="spanEdit-'+ name +'" class="glyphicon glyphicon-pencil"></span> </button>';
     str+= '<button id="buttonPause-'+ name +'" class="alert alert-warning pause" onClick="pause('+id+','+"'"+name+"',"+hour*3600 + min*60 + sec+');" title="pause timer">'+ 
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
 var shortly;
  // Attach an asynchronous callback to read data
  db.on("value", function(snapshot) {
   
     if(snapshot.val() !== null){
            // iterate through data
        //clear the list first
          $("#timers").empty();
           shortly = new Date(); 
          
        snapshot.forEach(function(s) {
          //console.log(s.val().stat);
            var task = s.val();
          //empty array first
          timersArray = [];
          
           //print out html with data
           print(task,i);
           shortly.setSeconds(shortly.getSeconds() + (task.hour*3600 + task.min*60 + task.sec));
           $('#'+task.name+'-'+i).countdown({until: + (task.hour*360 + task.min*6 + task.sec),  
               onExpiry: function(){
                 alert('done');
                pause(i,task.name, (task.hour*3600 + task.min*60 + task.sec));
               }}); 
            if(task.stat === 'pause'){
               $('#'+task.name+'-'+i).countdown('pause');
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

