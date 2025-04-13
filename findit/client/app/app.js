const findItApp = angular.module('findItApp', ['ngRoute']);

// Configure routes with route protection
findItApp.config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
    // Add auth interceptor
    $httpProvider.interceptors.push('AuthInterceptor');
    
    $routeProvider
        .when('/', {
            templateUrl: 'views/home.html',
            controller: 'HomeController'
        })
        .when('/login', {
            templateUrl: 'views/login.html',
            controller: 'LoginController'
        })
        .when('/register', {
            templateUrl: 'views/register.html',
            controller: 'RegisterController'
        })
        .when('/items', {
            templateUrl: 'views/items.html',
            controller: 'ItemsController'
        })
        .when('/items/:id', {
            templateUrl: 'views/itemDetails.html',
            controller: 'ItemDetailsController'
        })
        .otherwise({
            redirectTo: '/'
        });
}]);
