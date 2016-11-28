
var app = angular.module('test', ['login','search','firebase']);

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
    $scope.questionList = [];
    $scope.id = "";
    $scope.testName = "";
    initalizeFirebase();
    var id = "";
    firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      id = firebase.auth().currentUser.uid;
      $scope.id = id;
    }

    });

    $scope.submitTest = function(){
      console.log("gdfgfd");
      var data = {
        uid: $scope.id,
        testName: $scope.testName,
        questionList: $scope.questionList,
      };

      var newTestKey = firebase.database().ref().child('/').push().key;
      console.log(newTestKey);
      // var updates = {};
      // updates['/tests/' + newTestKey] = data;
      // updates['/user-posts/' + newTestKey] = data;
      // firebase.database().ref().update(updates);

      var ref = firebase.database().ref('/tests/' + newTestKey);
      var obj = $firebaseObject(ref);
      Object.assign(obj, data);
      obj.$save();
      console.log("gdfgfd");

    }


    <!--$scope.tempQuestion ='';-->
    var question = {
      title : "Can you feel my heart beat?",
      type : "MC",
      choice: [
        {text:"A"},
        {text:"B"},
        {text:"C"},
        {text:"D"},
      ],
      answer: "A"
    };
    var question2 = {
      title : "Can you feel my head beat?",
      type : "MC",
      choice: [
        {text:"A"},
        {text:"B"},
        {text:"C"},
        {text:"D"},
      ],
      answer: "A"
    };
    var question3 = {
      title : "Can you feel my hand beat?",
      type : "MC",
      choice: [
        {text:"A", image:"jfdoifjdsoifdsiohfidhfio"},
        {text:"B"},
        {text:"C"},
        {text:"D"},
      ],
      answer: "A"
    };
    $scope.questionList.push(question);
    $scope.questionList.push(question2);
    $scope.questionList.push(question3);

    console.log($scope.questionList);
    $scope.arrayIndexToChar = function(index)
    {
      var temp = String.fromCharCode(index+65);;

      return temp;
    };
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
        choice: [
          {text:"A"},
          {text:"B"},
          {text:"C"},
          {text:"D"},
        ],
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
        choice: [
          {text:"A"},
          {text:"B"},
          {text:"C"},
          {text:"D"},
        ],
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
      backup.getQuestion().choice.push({text:""});
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



    $scope.imgs = [];


    var _validFileExtensions = [".jpg", ".jpeg", ".bmp", ".gif", ".png"];
    $scope.uploadFile = function() {

    	var sFileName = $("#nameImg").val();
    	if (sFileName.length > 0) {
    		var blnValid = false;
    		for (var j = 0; j < _validFileExtensions.length; j++) {
    			var sCurExtension = _validFileExtensions[j];
    			if (sFileName.substr(sFileName.length - sCurExtension.length, sCurExtension.length).toLowerCase() == sCurExtension.toLowerCase()) {
    				blnValid = true;
    				var filesSelected = document.getElementById("nameImg").files;
    				if (filesSelected.length > 0) {
    					var fileToLoad = filesSelected[0];

    					var fileReader = new FileReader();

    					fileReader.onload = function(fileLoadedEvent) {
    						var textAreaFileContents = document.getElementById(
    							"textAreaFileContents"
    						);


    						$scope.imgs.$add({
    							base64: fileLoadedEvent.target.result
    						});
    					};

    					fileReader.readAsDataURL(fileToLoad);
    				}
    				break;
    			}
    		}

    		if (!blnValid) {
    			alert('File is not valid');
    			return false;
    		}
    	}

    	return true;
    }

    $scope.deleteimg = function(imgid) {
    	var r = confirm("Do you want to remove this image ?");
    	if (r == true) {
    		$scope.imgs.forEach(function(childSnapshot) {
    			if (childSnapshot.$id == imgid) {
    					$scope.imgs.$remove(childSnapshot).then(function(ref) {
    						ref.key() === childSnapshot.$id; // true
    					});
    			}
    		});
    	}
    }



}]);
