
var app = angular.module('test', ['teamform-index-app', 'firebase']);

app.controller('takeTestCtrl', function($scope, $firebaseObject, $firebaseArray, $interval) {

    $scope.questionList = [];
    $scope.answerList = [];
    $scope.mark=-1;
    $scope.finish = false;
    $scope.seconds =100;
    $scope.countDownDisplay="";

	var userId = getURLParameter("uid");
  var eventId = getURLParameter("eid");
  var teamId = getURLParameter("tmid");
	var testId = getURLParameter("tid");
  var requestId = getURLParameter("rid");
  var postId = getURLParameter("pid");
  var isFinished = false;
          var path = "/tests/" + testId;
          var ref = firebase.database().ref(path);
          $scope.test = $firebaseObject(ref);
          $scope.results = [];


          $scope.test.$loaded()
        		.then( function(data) {

                for(var i = 0; i < data.questionList.length; i++)
                {
                    $scope.questionList.push(data.questionList[i]);
                }

                    $scope.seconds = $scope.questionList.length*60;

        		})
        		.catch(function(error) {
        			// Database connection error handling...
        			//console.error("Error:", error);
        		});


    var question = {
      title : "Can you feel my heart beat?",
      type : "MC",
      choice: ["A","B","C","D"],
      answer: "A"
    };
    var question2 = {
      title : "Can you feel my head beat?",
      type : "MC",
      choice: ["A","B","C","D"],
      answer: "A"
    };
    var question3 = {
      title : "Can you feel my hand beat?",
      type : "MC",
      choice: ["A","B","C","D"],
      answer: "A"
    };


    for( a= 0;a<$scope.questionList.length;++a)
    {

      $scope.answerList.push("");
    };

    $scope.setAnswer = function(index,answer)
    {

      $scope.answerList[index]=answer;




    };

    $scope.arrayIndexToChar = function(index)
    {
      var temp = String.fromCharCode(index+65);;

      return temp;
    };

    $scope.calculatingMark = function()
    {
      var counter = 0;
      for(var x in $scope.questionList){

        if($scope.questionList[x].answer == $scope.answerList[x])
        counter++;
      }


      $scope.mark = (counter/$scope.questionList.length) * 100;

    };

    $scope.isPass = function()
    {

      $scope.calculatingMark();
      if($scope.mark>= 50)
      {
        $scope.finished();
        if(!isFinished)
        {
          console.log('pass la');
          var refPath = "/events/" + eventId + "/teams/" + teamId + "/requests/" + requestId;
          var ref = firebase.database().ref(refPath);

          var newData = {};
          newData["uid"] = id;
          newData["postId"] = postId;

          console.log(refPath);
          ref.push(newData);
          ref.set(newData,function (){
          });
          isFinished = true;
        }
        return true;
      }
      else
      {
        console.log('fail la');
        return false;
      }
    };

    $scope.finished = function()
    {
      $scope.finish = true;
    };

    $scope.hideGoodResult = function()
    {
      return !($scope.finish && $scope.isPass());
    };

    $scope.hideBadResult = function()
    {
      return !($scope.finish && !($scope.isPass()));
    };

    $scope.secondPassed = function() {
        var minutes = Math.round(($scope.seconds - 30)/60);
        var remainingSeconds = $scope.seconds % 60;
        if (remainingSeconds < 10) {
            remainingSeconds = "0" + remainingSeconds;
        }
        $scope.countDownDisplay = minutes + ":" + remainingSeconds;
        if ($scope.seconds == 0) {
            countDownDisplay = "Buzz Buzz";
            $interval.cancel(interval);
            $scope.finished();
            $scope.isPass();




        } else {
            $scope.seconds--;
        }
    };
    var interval =$interval($scope.secondPassed, 1000);


});
