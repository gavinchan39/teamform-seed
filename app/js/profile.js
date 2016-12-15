$(document).ready(function(){
$('#profile_page_controller').hide();

});

angular.module('teamform-profile-app', ['teamform-index-app', 'firebase'])
.controller('profileCtrl', ['$scope', '$firebaseObject', '$firebaseArray', function($scope, $firebaseObject, $firebaseArray) {

	    var self = this;

			$scope.edit = false;
			$scope.content = {text:""};
			var profileId = "";
	    firebase.auth().onAuthStateChanged(function(user) {
	        if (user) {
	          // User is signed in.
							profileId = getURLParameter("uid");

	          user.providerData.forEach(function (profile) {
							if(profileId == null)
							{
								profileId = firebase.auth().currentUser.uid;
							}
							if(profileId == firebase.auth().currentUser.uid)
							{
								$scope.edit = true;
							}
//	          profileId = firebase.auth().currentUser.uid;


	          // Initialize $scope.param as an empty JSON object
	          $scope.param = {};

	          // Call Firebase initialization code defined in site.js

	          var userID, refPath, ref;

	          refPath = "/users/" + profileId;
	          ref = firebase.database().ref(refPath);

	          $scope.param = $firebaseObject(ref);
	          $scope.param.$loaded();


	          var tagsPath = refPath;
						$scope.tags = [];
	          $scope.tags = $firebaseArray(firebase.database().ref(tagsPath).child('tags'));
	          $scope.displayDesc = true;
						$scope.displayTagCtr = true;
	          $scope.newDesc = {text:""};

	          $scope.showName = function() {

	            return $scope.param.name ;

	          }

	          $scope.showDesc = function() {
	             return $scope.param.desc ;
	          }

						$scope.hideTagCtr = function() {
							 $scope.displayTagCtr = !$scope.displayTagCtr;
						}

	          $scope.hideDesc = function() {

	            $scope.displayDesc = !$scope.displayDesc;

	          }

	          $scope.saveDesc = function() {

	            $scope.param.desc = $scope.newDesc.text;
	            $scope.displayDesc = !$scope.displayDesc;
	            $scope.param.$save();
	          }



	        });

	        var path = "/";

	        path = "/users/" + profileId + "/image";
	        var ref = firebase.database().ref(path);

	        $scope.imgs = $firebaseArray(ref);

						$('#profile_page_controller').show();
	        var _validFileExtensions = [".jpg", ".jpeg", ".bmp", ".gif", ".png"];
	        $scope.uploadFile = function() {

	        	path = "/users/" + profileId;

	        	var imgref = firebase.database().ref(path);
	        	imgref.child('image').remove();
	        	path = "/users/" + profileId + "/image";
	        	imgref = firebase.database().ref(path);

	        	$scope.imgs = $firebaseArray(imgref);
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

	      }
	      else {
	        // No user is signed in.
	      }



	  });

		$scope.addTag = function(content2) {

        var index = 0;
          var refPath = "/users/" + profileId + "/tags/";
          firebase.database().ref(refPath).limitToLast(1).on("child_added", function(data) {
            index = parseInt(data.key) + 1;


          });


					var data = {
						type: "custom",
						content: content2
					}


          refPath = "/users/" + profileId + "/tags/" + index;
          var ref = firebase.database().ref(refPath);
          ref.set(data,function (){


          });


		}

		$scope.deleteTag = function(content){

			var refPath = "/users/" + profileId + "/tags/";

			var ref = firebase.database().ref(refPath);
			ref.child(content.$id).remove();



		}



}]);
