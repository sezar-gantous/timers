
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
         $('#buttonPlay-'+ id).show();
         $('#buttonPause-'+ id).hide(); 
          console.dir("in Pause: "+id);
          //reset timer
          //timersArray[id].countdown(new Date(new Date().valueOf() + time * 1000));
         // pause timer
          //timersArray[id].countdown('pause');
      
         $("#"+id).countdown('option', {significant: 3,until: "+'"+time +"'"});
         $("#"+id).countdown('pause').removeClass('highlight');
        db.child(name).update({
          stat: "pause"
        });
    }

    function removeTimer (id,name) {
      // CSS STUFF..
     
     //clear the whole li anf children fron DOM
     //$("li-"+url).remove();

      //timersArray.pop(id);
     
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
           //timersArray.pop(id);
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


    function play(id,name,time) {
      // change the button to pause(hide play button show pause button..)
         $('#buttonPause-'+ id).show(); 
         $('#buttonPlay-'+ id).hide();

               
   //no need to update since its already playing
     // if(name !== null){
      // db.child(name).update({
      //          stat: "play"
      //        });
     // }
         console.log("timer stated:"+id);
     $('#'+id).countdown('option',{onExpiry: function(){
                 //alert('done');
                 console.log("expiring:"+name);
                  
                pause(id,name, time);
                 document.getElementById("alarm").play();
               }});
                $('#'+id).countdown('resume');
        //start the timer
         //timersArray[id].countdown('resume');
    }


    function print (task,id) {
     var str = '';
     var hour = task.hour;
     var min = task.min;
     var sec = task.sec;
     var name = task.name;
     var date =task.hour+"h +"+task.min+"m+ "+task.sec+"s";

     str+= '<li id="li-'+ name +'" class="list-group-item">';
     str+= '<b>';
     str+= name;
     str+= '</b>';
     str+= ' is Set to: <div class="lead" id="'+id+'"></div>';
     
     str+= '<div class="controls"><button id="remove-'+ id +'" class="alert alert-danger remove" onClick="removeTimer('+id+','+"'"+name+"'"+');" title="delete timer">'+
               '<span id="spanRemove-'+ id +'" class="glyphicon glyphicon-remove"></span> </button>';
     str+= '<button id="edit-'+ id +'" class="alert alert-info edit" onClick="editing('+id+','+hour+','+min+','+sec+','+"'"+name+"'"+','+"'"+task.stat+"'"+');" title="edit Task">'+
               '<span id="spanEdit-'+ id +'" class="glyphicon glyphicon-pencil"></span> </button>';
     str+= '<button id="buttonPause-'+id +'" class="alert alert-warning pause" onClick="pause('+id+','+"'"+name+"',"+"'"+date+"'"+');" title="pause timer">'+ 
              '<span id="spanPause-'+ id +'" class="glyphicon glyphicon glyphicon-stop"></span> </button>';
     str+= '<button id="buttonPlay-'+id +'" class="alert alert-success play" onClick="play('+id+','+"'"+name+"',"+"'"+date+"'"+');" title="resume timer">'+ 
              '<span id="spanPlay-'+ id +'" class="glyphicon glyphicon glyphicon-play"></span> </button>';
     str += '</div></li>';
      $("#timers").append(str);
    
     if(task.stat === 'pause'){
       // change the button to play(hide pause button show play button..)
       
         $('#buttonPause-'+ id).hide(); 
         $('#buttonPlay-'+ id).show(); 
     }


    }


/*load all data from firebase*/
function loadFromJson () {
  var index=0;
 var time;
  // Attach an asynchronous callback to read data
  db.on("value", function(snapshot) {
   
     if(snapshot.val() !== null){
            // iterate through data
        //clear the list first
          $("#timers").empty();
           
          index=0;
          
          //empty array first
          timersArray = [];
          
        snapshot.forEach(function(s) {
          //console.log(s.val().stat);
            var task = s.val();
          timersArray.push(index);
           //print out html with data
           print(task,index);
          time ="+'"+task.hour+"h +"+task.min+"m+ "+task.sec+"s'";
       //   console.log(time);
           $('#'+index).countdown({significant: 3,onTick:almostUp,until: time,  
               onExpiry: function(){
                 //alert('done');
                 //console.log("expiring");
                pause(index,task.name, time);
                   
                 document.getElementById("alarm").play();
               }}); 
            if(task.stat === 'pause'){
               $('#'+index).countdown('pause').removeClass('highlight');
            }                   
           
           index++;
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



function almostUp(periods) { 
    if ($.countdown.periodsToSeconds(periods) <= 5) { 
        $(this).addClass('highlight'); 
    } 
} 

