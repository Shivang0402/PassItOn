const authApp = angular.module("authApp", []);

authApp.controller("AuthController", [
  "$scope",
  "$http",
  "$window",
  function ($scope, $http, $window) {
    $scope.user = {};
    $scope.isSaving = false;
    $scope.error = null;

    const apiBase = `${window.location.origin}/api`;

    const handleResponse = (promise, successCallback) => {
      $scope.isSaving = true;
      $scope.error = null;
      promise
        .then((response) => {
          successCallback(response.data);
        })
        .catch((response) => {
          const message =
            (response.data && response.data.message) ||
            response.statusText ||
            "Something went wrong.";
          $scope.error = message;
        })
        .finally(() => {
          $scope.isSaving = false;
        });
    };

    $scope.login = function () {
      if (!$scope.loginForm.$valid) {
        $scope.loginForm.$setSubmitted();
        return;
      }

      handleResponse(
        $http.post(
          `${apiBase}/auth/login`,
          {
            email: $scope.user.email,
            password: $scope.user.password,
          },
          { headers: { "Content-Type": "application/json" } },
        ),
        (data) => {
          localStorage.setItem("passiton_token", data.token);
          $window.location.href = "dashboard.html";
        },
      );
    };

    $scope.register = function () {
      if (!$scope.registerForm.$valid) {
        $scope.registerForm.$setSubmitted();
        return;
      }

      if ($scope.user.password !== $scope.user.confirmPassword) {
        $scope.error = "Passwords do not match.";
        return;
      }

      handleResponse(
        $http.post(
          `${apiBase}/auth/register`,
          {
            name: $scope.user.name,
            email: $scope.user.email,
            password: $scope.user.password,
          },
          { headers: { "Content-Type": "application/json" } },
        ),
        (data) => {
          localStorage.setItem("passiton_token", data.token);
          $window.location.href = "dashboard.html";
        },
      );
    };

    $scope.resetPassword = function () {
      if (!$scope.forgotForm.$valid) {
        $scope.forgotForm.$setSubmitted();
        return;
      }

      handleResponse(
        $http.post(
          `${apiBase}/auth/forgot-password`,
          {
            email: $scope.user.email,
            newPassword: $scope.user.newPassword,
          },
          { headers: { "Content-Type": "application/json" } },
        ),
        () => {
          $window.location.href = "login.html";
        },
      );
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

      scope.$watch("ngMatch", function () {
        ctrl.$validate();
      });
    },
  };
});
