const authApp = angular.module("authApp", []);

authApp.controller("AuthController", [
  "$scope",
  "$window",
  function ($scope, $window) {
    $scope.user = {};

    $scope.login = function () {
      if ($scope.loginForm.$valid) {
        $window.alert("Login successful!");
        $window.location.href = "dashboard.html";
      }
    };

    $scope.register = function () {
      if ($scope.registerForm.$valid) {
        $window.alert("Registration successful!");
        $window.location.href = "dashboard.html";
      }
    };
  },
]);

authApp.directive("ngMatch", function () {
  return {
    require: "ngModel",
    scope: {
      ngMatch: "=",
    },
    link: function (scope, element, attrs, ctrl) {
      ctrl.$validators.match = function (modelValue, viewValue) {
        return viewValue === scope.ngMatch;
      };

      scope.$watch("ngMatch", function (newVal) {
        ctrl.$validate();
      });
    },
  };
});
