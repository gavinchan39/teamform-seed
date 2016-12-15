
var app = angular.module('test', ['teamform-index-app','firebase']);

<!-- question only as it is for saving single question-->
app.service('backup', function() {
  var question ;
  var questionNo;
  console.log('in the backup');



  var saveQuestion = function(newObj , index, questionNum) {
    if(index == 1)
    {
      questionNo = questionNum;
      console.log('saveEmptyQuestion');
      question ={
        title : "",
        type : "",
        choice: [
          {text:"A"},
          {text:"B"},
          {text:"C"},
          {text:"D"},
        ],
        answer: ""
      };
    }
    else
    {
      questionNo = questionNum;
      console.log('saveRealQuestion');
      question =jQuery.extend(true,{},newObj);
    }

  };

  var getQuestion = function(){
  <!--console.log('question return'); -->
  <!--console.log(question);-->
      return question;
  };

  var getQuestionNumber = function()
  {
    return questionNo;
  };

  var isQuestionEmpty = function(){
    if(typeof question =='undefined'||question == null)
    {
      return true;
    }
    else
    {
      if(question.title===''||question.choice[0]===''||question.answer==='')
      {
        return true;
      }
      else
      {
        var temp = false
        for(a=0;a<question.choice.length;++a)
        {
          if(question.choice[a]==='')
          temp = true;
        }
        return temp;
      }
    }

  };

  return {
    saveQuestion: saveQuestion,
    getQuestion: getQuestion,
    isQuestionEmpty: isQuestionEmpty,
    getQuestionNumber: getQuestionNumber
  };

});




app.controller('testCtrl', ["$scope","$firebaseObject","$firebaseArray", "backup",function($scope, $firebaseObject, $firebaseArray, backup) {

    var id = "";
    firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      id = firebase.auth().currentUser.uid;

      $scope.tests = [];
      var path = "/tests";
      var ref = firebase.database().ref(path);
      $scope.tests = $firebaseArray(ref);
      $scope.results = [];


      $scope.tests.$loaded()
    		.then( function(data) {

          for(var i = 0; i < $scope.tests.length; i++)
          {
            if($scope.tests[i].uid == id)
            {
              $scope.results.push($scope.tests[i]);
              console.log($scope.results);
            }
          }
    		})
    		.catch(function(error) {
    			// Database connection error handling...
    			//console.error("Error:", error);
    		});



    }

    });



}]);
