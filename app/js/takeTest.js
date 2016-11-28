
var app = angular.module('myApp', []);

app.controller('takeTestCtrl', function($scope) {
    $scope.questionList = [];
    $scope.answerList = [];
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
    $scope.questionList.push(question);
    $scope.questionList.push(question2);
    $scope.questionList.push(question3);

    console.log($scope.questionList.length);
    for( a= 0;a<$scope.questionList.length;++a)
    {
      console.log("haha");
      $scope.answerList.push("");
    };

    $scope.setAnswer = function(index,answer)
    {
      console.log('index');
      console.log(index);
      console.log(answer);
      $scope.answerList[index]=answer;
      console.log($scope.answerList[index]);



    };

    $scope.arrayIndexToChar = function(index)
    {
      var temp = String.fromCharCode(index+65);;

      return temp;
    };


});

var seconds = 60;
function secondPassed() {
    var minutes = Math.round((seconds - 30)/60);
    var remainingSeconds = seconds % 60;
    if (remainingSeconds < 10) {
        remainingSeconds = "0" + remainingSeconds;
    }
    document.getElementById('countdown').innerHTML = minutes + ":" + remainingSeconds;
    if (seconds == 0) {
        clearInterval(countdownTimer);
        document.getElementById('countdown').innerHTML = "Buzz Buzz";
    } else {
        seconds--;
    }
}

var countdownTimer = setInterval('secondPassed()', 1000);
