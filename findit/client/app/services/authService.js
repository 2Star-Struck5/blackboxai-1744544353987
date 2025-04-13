findItApp.factory('AuthService', ['$http', '$location', function($http, $location) {
    const service = {};

    service.login = function(user) {
        return $http.post('/api/auth/login', user);
    };

    service.register = function(user) {
        return $http.post('/api/auth/register', user);
    };

    service.logout = function() {
        return $http.get('/api/auth/logout')
            .then(function() {
                $location.path('/login');
            });
    };

    service.isAuthenticated = function() {
        return $http.get('/api/auth/check')
            .then(function(response) {
                return response.data.authenticated;
            });
    };

    return service;
}]);
