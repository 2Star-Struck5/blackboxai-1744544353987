findItApp.factory('AuthInterceptor', ['$q', '$location', function($q, $location) {
    return {
        // Add token to all requests
        request: function(config) {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = 'Bearer ' + token;
            }
            return config;
        },

        // Handle 401 unauthorized responses
        responseError: function(rejection) {
            if (rejection.status === 401) {
                localStorage.removeItem('token');
                $location.path('/login');
            }
            return $q.reject(rejection);
        }
    };
}]);
