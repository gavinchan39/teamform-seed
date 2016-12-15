$(document).ready(function(){

$('#admin_page_controller').hide();
$(".btn-pref .btn").click(function () {
    $(".btn-pref .btn").removeClass("btn-primary").addClass("btn-default");
    // $(".tab").addClass("active"); // instead of this do the below
    $(this).removeClass("btn-default").addClass("btn-primary");
});

});



angular.module('teamform-events-app', ['teamform-index-app', 'firebase'])
.controller('eventCtrl', ['$scope', '$firebaseObject', '$firebaseArray', function($scope, $firebaseObject, $firebaseArray) {


  $scope.role = "";
  $scope.formData = {};
  $scope.free = [];
  $scope.joined = [];
  var eventName = getURLParameter("e");
  $scope.eventName = eventName;
  var id = "";
  firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    id = firebase.auth().currentUser.uid;
  }

  });

  var path = "events/" + eventName + "/param";

  var ref = firebase.database().ref(path);

  // Link and sync a firebase object
  var maxTeamSize = 0;
  var minTeamSize = 0;
  $scope.param = $firebaseObject(ref);
  $scope.param.$loaded()
    .then( function(data) {
        maxTeamSize = $scope.param.maxTeamSize;
        minTeamSize = $scope.param.minTeamSize;
    })
    .catch(function(error) {
      // Database connection error handling...
      //console.error("Error:", error);
    });



  path = "events/" + eventName;

  firebase.database().ref(path).orderByChild("param").on("child_added", function(data) {
    if(data.val().admin == id)
    {
      $scope.role = "admin";
      $scope.$apply();
    }
  });

  path = "events/" + eventName + '/teams';
  ref = firebase.database().ref(path);
  $scope.items = [];
  $scope.items = $firebaseArray(ref);
   $scope.items.$loaded()
    .then( function(data) {
/*
      for(var i = 0; i < data.length; i++)
      {

        if(data[i].requests)
        {
          for(var j = 0; j < data[i].requests.length; j++)
          {

            if($scope.free.length == 0)
            {
              $scope.free.push(data[i].requests[j].uid);
            }
            var length = $scope.free.length;

            for(var k = 0; k < length; k++)
            {

              if(data[i].requests[j].uid == $scope.free[k])
              {
                break;
              }
              else if(data[i].requests[j].uid != $scope.free[k] && k == $scope.free.length - 1)
              {

                $scope.free.push(data[i].requests[j].uid);

              }
            }
          }
        }
        if(data[i].members)
        {
          for(var j = 0; j < data[i].members.length; j++)
          {

            if($scope.joined.length == 0)
            {
              $scope.joined.push(data[i].members[j].uid);
            }
            var length = $scope.joined.length;
            for(var k = 0; k < length; k++)
            {

              if(data[i].members[j] == $scope.joined[k])
              {
                break;
              }
              else if(data[i].members[j].uid != $scope.joined[k] && k == $scope.joined.length - 1)
              {

                $scope.joined.push(data[i].members[j].uid);

              }
            }
          }
        }
        console.log($scope.free);
        console.log($scope.joined);

      }
*/

      // Enable the UI when the data is successfully loaded and synchornized
      $('#admin_page_controller').show();
    })
    .catch(function(error) {
        // Database connection error handling...
        //console.error("Error:", error);
      });



  $scope.save = function(item) {



  }

  $scope.teamMember = [];


  $scope.add_member = function(){
    var newVal = $scope.teamMember.length;



    if(newVal < $scope.param.maxTeamSize - 1)
    {



        var newData = {
          'uid': "",
          'role': "member",
          'testId': 0,
          "position" : "",
          'postId' : newVal
        };

        $scope.teamMember.push(newData);

        var path = "/tests/";
        $scope.tests = [];
        firebase.database().ref(path).on("child_added", function(data) {

          var testId = data.key;
          path = "/tests/" + testId;

          if(data.val().uid == id)
            {
              $scope.tests.push({"id": testId, "name" : data.val().testName});
            }
        });



    }
  }

  $scope.assign = function(test,mName){
    var refPath = "events/" + eventName + "/teams/" + teamName + "/members/" + mName.index;
    var ref = firebase.database().ref(refPath);
    $scope.index = $firebaseObject(ref);
    $scope.index.$loaded()
    .then( function(data){

      $scope.index.testId = test.id;
      $scope.index.$save();
    })
    .catch(function(error) {
      // Database connection error handling...
      //console.error("Error:", error);
    });

  }

  $scope.remove_member = function(item){
    if($scope.teamMember.length > $scope.param.minTeamSize - 1)
    {
      var index = $scope.teamMember.indexOf(item);
      $scope.teamMember.splice(index, 1);
  }
}


  $scope.create_Team = function(teamName){


    path = "events/" + eventName + '/teams/' + teamName + "/members/" + 0;
    ref = firebase.database().ref(path);
      var newData2 = {
        'uid': id,
        'role': "leader",
        'testId': 0,
        "position" : "",
        'postId' : 0
      };

      ref.set(newData2, function(){

        // console.log("Success..");

        // Finally, go back to the front-end
        // window.location.href= "index.html";
      });

    for(var i = 0; i < $scope.teamMember.length ; i++)
    {
      var index = i + 1;
      path = "events/" + eventName + '/teams/' + teamName + "/members/" + index;
      ref = firebase.database().ref(path);
      var newData = {
        'uid': $scope.teamMember[i].uid,
        'role': $scope.teamMember[i].role,
        'testId': 0,
        "position" : $scope.teamMember[i].position,
        'postId' : $scope.teamMember[i].postId
      }
      ref.set(newData, function(){

        // console.log("Success..");

        // Finally, go back to the front-end
        // window.location.href= "index.html";
      });
    }

  			window.location.href= "event.html?e=" + $scope.eventName + "&t=" + teamName;

  }

  $scope.join_event = function(item){

    var index = 0;
    var refPath = "/events/" + $scope.eventName + "/teams/" + item.$id + "/requests/";
    if(item.requests == null)
    {
      index = 0;
    }
    else
    {
      firebase.database().ref(refPath).limitToLast(1).on("child_added", function(data) {
        index = parseInt(data.key) + 1;
      });

    }

    var newData = {};
    newData["uid"] = id;
    newData["postId"] = $scope.formData.position;

    //refPath = "/events/" + $scope.eventName + "/teams/" + item.$id + "/requests/" + index;


    var x = parseInt($scope.formData.position) + 1;
    refPath = "/events/" + $scope.eventName + "/teams/" + item.$id + "/members/" + x;
    var ref = firebase.database().ref(refPath);
    $scope.abc = $firebaseObject(ref);
    $scope.abc.$loaded().then(function(){
    window.location.href= "takeTest.html?uid=" + id + "&eid=" + $scope.eventName + "&tmid=" +  item.$id + "&tid=" + $scope.abc.testId + "&rid=" + index + "&pid=" + $scope.formData.position ;
    });

    /*
    ref.push(newData);
    ref.set(newData,function (){
    });
    */

  }

  $scope.change_min = function(num){
    var newMin = $scope.param.minTeamSize + num;
    if (newMin >=1 && newMin <= $scope.param.maxTeamSize ) {
      $scope.param.minTeamSize = newMin;
    }
    $scope.param.$save();
  }

  $scope.change_max = function(num){
    var newMax = $scope.param.maxTeamSize + num;
    if (newMax >=1 && newMax >= $scope.param.minTeamSize ) {
      $scope.param.maxTeamSize = newMax;
    }
    $scope.param.$save();
  }

        $scope.delTeam = function(i){
          refPath = "/events/" + eventName + "/teams/";
          ref = firebase.database().ref(refPath);
          ref.child(i.$id).remove();
        }





}]);
