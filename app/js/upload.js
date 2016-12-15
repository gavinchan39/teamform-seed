$(document).ready(function(){



});



angular.module('image', ['firebase'])
.controller('base64Ctrl', ['$scope', '$firebaseObject', '$firebaseArray',  function($scope, $firebaseObject, $firebaseArray) {


        var path = "/";
        var ref = firebase.database().ref(path);
        path = "/images/a";
        var imgref = firebase.database().ref(path);

        $scope.imgs = $firebaseArray(imgref);

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
                      date: Firebase.ServerValue.TIMESTAMP,
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
