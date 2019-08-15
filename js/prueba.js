'use strict';


var app = angular.module('testMovil', []);

app.controller('testCtrl', function ($scope){
        $scope.check = function() {
            var text = document.createTextNode("This just got added");
            if (/Mobi|Android/i.test(navigator.userAgent)) 
            {
                $scope.respuesta = "estas en celular";
            }
            else
            {
                $scope.respuesta = "estas en desktop";
            }
        }
    });

app.controller('restCtrl', function ($scope, $http) {
    $http.get("https://jsonplaceholder.typicode.com/todos/1")
    .then(function(response){
        $scope.hola = response.data;
    })
    .catch(function (err) { $scope.hola = err;});;
});