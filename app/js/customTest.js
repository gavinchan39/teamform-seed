
var app = angular.module('myApp', []);

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
        choice: [""],
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


app.controller('testCtrl', function($scope, backup) {
    $scope.questionList = [];
    <!--$scope.tempQuestion ='';-->
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

    console.log($scope.questionList);

    $scope.goBackup = function(questionNo, index,questionNo)
    {
      console.log('goBackup called');
      console.log($scope.questionList[questionNo]);

      backup.saveQuestion($scope.questionList[questionNo], index, questionNo);

      <!--this can be delete late possibly -->
      $scope.tempQuestion = backup.getQuestion();
    };

    $scope.getBackup = function()
    {
      $scope.tempQuestion = backup.getQuestion();
      console.log('temp Question setted');
      console.log($scope.tempQuestion);
      return backup.getQuestion();
    };

    $scope.cancelEditedQuestion = function()
    {
      <!--did nothing as cancel did not need to perform any operation right now-->
      $scope.emptyTempquestion();
    };

    $scope.saveEditedQuestion = function()
    {
      console.log('saveEditedQuestion called');
      console.log(backup.getQuestionNumber());
      if(backup.getQuestionNumber() !== -1)
      $scope.questionList[backup.getQuestionNumber()] = backup.getQuestion();
      else
      {
          $scope.questionList.push(backup.getQuestion());
      }


      <!--left for backup old version-->
      <!--$scope.questionList[questionNo] = $scope.tempQuestion;-->
    };


    $scope.deleteQuestion = function(index,number)
    {

    $scope.questionList.splice(index,number);
    };

    $scope.emptyTempquestion = function()
    {
      console.log('try to empty tempQuestion');
      tempQuestion ={
        title : "",
        type : "MC",
        choice: ["A","B","C","D"],
        answer: ""
      };

    };

    $scope.addQuestion = function()
    {
      console.log('addQuestion called');
      <!--consider to delete it-->
      $scope.emptyTempquestion();

      var emptyQuestion ={
        title : "",
        type : "",
        choice: ["","","",""],
        answer: ""
      };
      $scope.questionList.push(emptyQuestion) ;


    };

    $scope.isInvalidQuestion = function()
    {
      return  backup.isQuestionEmpty();

    }

    $scope.addChoice = function()
    {
      backup.getQuestion().choice.push('');
    };

    $scope.deleteChoice = function()
    {
      console.log('deleteChoice called');
      console.log(backup.getQuestion().choice.length);
       backup.getQuestion().choice.splice(backup.getQuestion().choice.length-1,1);
    };

    $scope.cancelQuestion = function()
    {
      console.log('called invalid question');
      console.log($scope.isInvalidQuestion());
      if(!$scope.isInvalidQuestion())
      {
        console.log('true section');
      // do nothing
      }
      else
      {
        console.log('false section');

      }
    };


});
