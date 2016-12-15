$(document).ready(function(){
$('#admin_page_controller').hide();

});

angular.module('teamform-event-app', ['teamform-index-app','firebase'])
.controller('eventCtrl', ['$scope', '$firebaseObject', '$firebaseArray', function($scope, $firebaseObject, $firebaseArray) {


        $scope.role = "";
        $scope.formData = {};
        var eventName = getURLParameter("e");
        var teamName = getURLParameter("t");
        $scope.e_Name = eventName;
        $scope.t_Name = teamName;

        var id = "";
        firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          // User is signed in.
          id = firebase.auth().currentUser.uid;
        }

        });
        $scope.member = [];
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
          path = "events/" + eventName + "/teams/" + teamName + "/requests/" ;
          ref = firebase.database().ref(path);
          $scope.requests = [];

          firebase.database().ref(path).on("child_added", function(data) {



            path = "users/";
            var uid = data.val().uid;
            var postId = data.val().postId;
            var index = data.key;

            firebase.database().ref(path).on("child_added", function(data) {

              if(uid == data.key)
              {
                $scope.requests.push({"uid" : uid,  "index" : index, "name": data.val().name, "postId" : postId});
                $scope.$apply();
              }

            });


          });

        path = "events/" + eventName + "/teams/" + teamName + "/members/" ;

        firebase.database().ref(path).orderByChild("teams").on("child_added", function(data) {

          if(id == data.val().uid)
          {
            $scope.role = data.val().role;

          }

          path = "users/";
          var uid = data.val().uid;
          var position = data.val().position;
          var role = data.val().role;
          var testId = data.val().testId;
          var index = data.key;
          var postId = data.val().postId;
          if(uid == "")
          {
            $scope.member.push({"name": "", "position" : position, "role" : role, "testId" : testId, "uid" : "", "index" : index, "postId" : postId , "disabled" : true});

          }
          else
          {
            firebase.database().ref(path).on("child_added", function(data) {
              if(role == "member" && uid == data.key)
              {
                $scope.member.push({"name": data.val().name, "position" : position, "role" : role, "testId" : testId, "uid": data.key, "index" : index, "postId" : postId ,"disabled" : true});
                $scope.$apply();
              }
              else if(role == "leader" && uid == data.key)
              {
                $scope.leaderName = data.val().name;
                $scope.$apply();
              }


            });
          }

          $('#admin_page_controller').show();
        });


        $scope.save = function(item) {
          var index = $scope.member.indexOf(item);

          var refPath = "events/" + eventName + "/teams/" + teamName + "/members/" + $scope.member[index].index ;
          $scope[index] = $firebaseObject(firebase.database().ref(refPath));
          $scope[index].$loaded()
          .then( function(data) {
          $scope[index].uid = $scope.member[index].uid;
          $scope[index].role = $scope.member[index].role;
          $scope[index].testId = $scope.member[index].testId;
          $scope[index].position = $scope.member[index].position;
          $scope[index].postId = $scope.member[index].postId;
          $scope[index].$save();
          $scope.member[index].disabled = true;
          })
          .catch(function(error) {
            // Database connection error handling...
            //console.error("Error:", error);
          });


      	}


        $scope.admit = function(item) {
          var index = $scope.member.indexOf(item);

          var refPath = "events/" + eventName + "/teams/" + teamName + "/requests/" + $scope.formData.request ;
          $scope.data = $firebaseObject(firebase.database().ref(refPath));

          $scope.data.$loaded()
            .then( function(data) {
              var uid = data.uid;
              refPath = "events/" + eventName + "/teams/" + teamName + "/members/" + $scope.member[index].index;
              $scope[index] = $firebaseObject(firebase.database().ref(refPath));
              $scope[index].$loaded()
              .then( function(data) {
              $scope[index].uid = uid;
              $scope[index].role = $scope.member[index].role;
              $scope[index].testId = $scope.member[index].testId;
              $scope[index].position = $scope.member[index].position;
              $scope[index].postId = $scope.member[index].postId;
              $scope[index].$save();

              refPath = "/events/" + eventName + "/teams/" + teamName + "/requests/";
              var ref = firebase.database().ref(refPath);
              ref.child($scope.formData.request).remove();

              angular.forEach($scope.requests, function (value, index) {
                  var index = $scope.requests.indexOf(value);
                  $scope.requests.splice($scope.requests.indexOf(value), 1);
              });


              refPath = "users/" + uid;
              ref = firebase.database().ref(refPath);
              $scope.name = $firebaseObject(ref);
              $scope.name.$loaded().then(function(data){

                $scope.member[index].name = data.name;
              }).catch(function(error){

              });



              })
              .catch(function(error) {
                // Database connection error handling...
                //console.error("Error:", error);
              });

            })
            .catch(function(error) {
              // Database connection error handling...
              //console.error("Error:", error);
            });




      	}


        $scope.add_member = function(){

          if($scope.member.length < $scope.param.maxTeamSize -1 )
          {

            var index = 0;
              var refPath = "/events/" + eventName + "/teams/" + teamName + "/members/";
              firebase.database().ref(refPath).limitToLast(1).on("child_added", function(data) {
                index = parseInt(data.key) + 1;


              });


              var newData = {
                'uid': "",
                'role': "member",
                'testId': 456,
                "position" : "",
                'postId' : index
              };


              refPath = "/events/" + eventName + "/teams/" + teamName + "/members/" + index;
              var ref = firebase.database().ref(refPath);
              ref.set(newData,function (){



              });
          }
        }

        $scope.remove_member = function(item){
          if($scope.member.length > $scope.param.minTeamSize - 1)
          {
            var index = $scope.member.indexOf(item);
            $scope.member.splice(index, 1);

            var refPath = "/events/" + eventName + "/teams/" + teamName + "/requests/";
            ref = firebase.database().ref(refPath);
            $scope.delete = [];
            $scope.delete = $firebaseArray(ref);

            $scope.delete.$loaded().then(function(){

              for(var j = 0; j < $scope.delete.length; j++)
              {
                if($scope.delete[j].postId == item.postId)
                {

                  refPath = "/events/" + eventName + "/teams/" + teamName + "/requests/";
                  ref = firebase.database().ref(refPath);
                  ref.child($scope.delete[j].$id).remove();
                }
              }


            });


            refPath = "/events/" + eventName + "/teams/" + teamName + "/members/";
            var i = parseInt(item.index) - 1;

            var ref = firebase.database().ref(refPath);
            ref.child(item.index).remove();

        }
      }



        $scope.rmdisabled = function(item) {
          var index = $scope.member.indexOf(item);
          $scope.member[index].disabled = false;

        }

        path = "/tests/";
        $scope.tests = [];
        firebase.database().ref(path).on("child_added", function(data) {

          var testId = data.key;
          path = "/tests/" + testId;

          if(data.val().uid == id)
            {
              $scope.tests.push({"id": testId, "name" : data.val().testName});
            }
        });

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

}]);
