findItApp.controller('LoginController', ['$scope', '$http', '$location', function($scope, $http, $location) {
    $scope.user = {
        email: '',
        password: ''
    };

    $scope.login = function() {
        $http.post('/api/auth/login', $scope.user)
            .then(function(response) {
                // Successful login
                $location.path('/items');
            })
            .catch(function(error) {
                // Handle error
                $scope.error = error.data.msg || 'Login failed';
            });
    };
}]);
