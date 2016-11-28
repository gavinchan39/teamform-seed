
var app = angular.module('myApp', []);

app.controller('takeTestCtrl', function($scope) {
    $scope.questionList = [];
    $scope.answerList = [];
    $scope.mark=-1;
    $scope.finish = false;
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

    $scope.calculatingMark = function()
    {
      var counter = 0;
      for(var x in $scope.questionList){
        console.log($scope.questionList);
        console.log(x);
        console.log('answer');
        console.log($scope.questionList[x]['answer']);
        console.log('user answer');
        console.log($scope.answerList[x]);
        if($scope.questionList[x].answer == $scope.answerList[x])
        counter++;
      }


      $scope.mark = (counter/$scope.questionList.length) * 100;
      console.log('mark set');
      console.log($scope.mark);
    };

    $scope.isPass = function()
    {

      $scope.calculatingMark();
      if($scope.mark>= 50)
      {
        $scope.finished();
        console.log('pass la');
        console.log('see see finish');
        console.log($scope.finish);
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
      console.log('good result');
      console.log(!($scope.finish && $scope.isPass()));
      return !($scope.finish && $scope.isPass());
    };

    $scope.hideBadResult = function()
    {
      console.log('good result');
      console.log(!($scope.finish && $scope.isPass()));
      return !($scope.finish && !($scope.isPass()));
    };


});

var seconds = 3*60;

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
        angular.element(document.getElementById('testArea')).scope().finished();
        angular.element(document.getElementById('testArea')).scope().isPass();
        angular.element(document.getElementById('testArea')).scope().$apply();
    } else {
        seconds--;
    }
}

var countdownTimer = setInterval('secondPassed()', 1000);
