findItApp.controller('RegisterController', ['$scope', '$http', '$location', function($scope, $http, $location) {
    $scope.user = {
        username: '',
        email: '',
        password: ''
    };

    $scope.register = function() {
        $http.post('/api/auth/register', $scope.user)
            .then(function(response) {
                // Successful registration
                $location.path('/login');
            })
            .catch(function(error) {
                // Handle error
                $scope.error = error.data.msg || 'Registration failed';
            });
    };
}]);
