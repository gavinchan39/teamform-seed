(()=>{
  angular.module('teamform-index-app', ['firebase'])
  .controller('switch', ['$scope', '$rootScope', '$firebaseObject', '$firebaseArray', ($scope, $rootScope, $firebaseObject, $firebaseArray)=>{
    initializeFirebase();
    $rootScope.page = "";
    $rootScope.params = {};
    $rootScope.switchPage = switchPage;
    $rootScope.switchPage("index");
    $scope.signin = signin;
    $scope.signout = signout;
    firebase.auth().onAuthStateChanged(function(user){
      if(user){
        $rootScope.login = true;
        $rootScope.user = user.providerData[0];
        user.providerData.forEach(function (profile) {

        var refPath;
        id = firebase.auth().currentUser.uid;
        $scope.id = id;
        console.log(id);
        refPath = "/users/" + id;
        // Link and sync a firebase object

          $scope[id] = $firebaseObject(firebase.database().ref(refPath));
          $scope[id].$loaded()
          .then( function(data) {
          $scope[id].name = profile.displayName;
          $scope[id].$save();
          return id;
          })
          .catch(function(error) {
            // Database connection error handling...
            //console.error("Error:", error);
          });

      });
      }else{
        $rootScope.login = false;
        $rootScope.user = {};
      }
      $rootScope.$apply();
    });
    function signin(){
      firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider());
    }
    function signout(){
      firebase.auth().signOut();
    }
    function switchPage(page, param){
      $rootScope.page = page;
      $rootScope.params[page] = param;
      $rootScope.$broadcast("switchPage");
    }
  }])
  .controller('sidebar', ['$rootScope', '$scope', ($rootScope, $scope)=>{
    firebase.auth().onAuthStateChanged(function(user){
      if(user){
        var id = firebase.auth().currentUser.uid;

        var path = "events/";
        $scope.team = [];
        $scope.member = [];

        firebase.database().ref(path).orderByChild("eventName").on("child_added", function(data) {

          path = "events/" + data.key + "/teams/";
          var eventKey = data.key;

          firebase.database().ref(path).orderByChild("teams").on("child_added", function(data) {
            path = "events/" + eventKey + "/teams/" + data.key + "/members/" ;
            var team = data.key;
            firebase.database().ref(path).orderByChild("members").on("child_added", function(data) {
              if(id == data.val().uid)
              {
                if(data.val().role == "leader")
                {
                    $scope.team.push({"event": eventKey, "team" : team, "link" : "event.html?e=" + eventKey + "&t=" + team });
                }
                else if(data.val().role == "member"){
                    $scope.member.push({"event": eventKey, "team" : team, "link" : "event.html?e=" + eventKey + "&t=" + team });
                }
                $scope.$apply();
              }
            });
          });
        });

        path = "events/";
        $scope.admin = [];

        firebase.database().ref(path).orderByChild("eventName").on("child_added", function(data) {

          var eventKey = data.key;
          path = "events/" + data.key;

          firebase.database().ref(path).orderByChild("param").on("child_added", function(data) {
            if(data.val().admin == id)
            {
              $scope.admin.push({"event": eventKey, "link" : "events.html?e=" + eventKey});
              $scope.$apply();
            }
          });
        });
      }
      else{
        $scope.team = [];
        $scope.member = [];
        $scope.admin = [];
      }
      $rootScope.$apply();
    });
  }])
  .controller('index', ['$rootScope', '$firebaseObject', '$firebaseArray', ($rootScope, $firebaseObject, $firebaseArray)=>{
  }])
  .controller('event', ['$scope', '$rootScope', '$firebaseObject', '$firebaseArray', ($scope, $rootScope, $firebaseObject, $firebaseArray)=>{
    var event = $rootScope.params.event.event;
  }])
  .controller('team', ['$scope', '$rootScope', '$firebaseObject', '$firebaseArray', ($scope, $rootScope, $firebaseObject, $firebaseArray)=>{
    $scope.$on("switchPage", ()=>{
      $scope.role = "";
      $scope.formData = {};
      var eventName = $rootScope.params.team.event;
      var teamName = $rootScope.params.team.team;
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

          }

        });


      });

      path = "events/" + eventName + "/teams/" + teamName + "/members/" ;

      firebase.database().ref(path).orderByChild("teams").on("child_added", function(data) {


        if(id == data.val().uid)
        {
          $scope.role = data.val().role;
          $scope.$apply();
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

            }
            else if(role == "leader" && uid == data.key)
            {
              $scope.leaderName = data.val().name;

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
    });
  }])
  .controller('search', ['$scope', '$firebaseObject', '$firebaseArray', ($scope, $firebaseObject, $firebaseArray)=>{

    $scope.items = [];
    var path = "events/";
    firebase.database().ref(path).orderByChild("name").on("child_added", function(data) {
      $scope.items.push({"name" : data.key, "link" : "events.html?e=" + data.key , "type": "event"});
      path = "events/" + data.key + "/teams/";
      var event = data.key;
      firebase.database().ref(path).orderByChild("name").on("child_added", function(data) {
        $scope.items.push({"name" : data.key, "link" : "event.html?e=" + event + "&t=" + data.key, "type" : "team"});
      });
    });
    path = "users/";
    firebase.database().ref(path).orderByChild("name").on("child_added", function(data) {
      $scope.items.push({"name" : data.val().name, "link" : "profile.html?uid=" + data.key, "type" : "user"});
    });
  }])
  .filter('searchFor', function(){
    return function (items, searchString) {
      var filtered = [];
      if(searchString == null)
      {
        return null;
      }
      var letterMatch = new RegExp(searchString, 'i');
      for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if (letterMatch.test(item.name.substring(0, searchString.length))) {
          filtered.push(item);
        }
      }
      return filtered;
    };
  })
})();
