var app = angular.module('appRoutes', ['ngRoute'])

.config(function($routeProvider, $locationProvider){
    
    $routeProvider
    
    .when('/', {
        templateUrl: 'app/views/pages/home.html'
    })

    .when('/about', {
        templateUrl: 'app/views/pages/about.html'
    })

    .when('/register', {
        templateUrl: 'app/views/pages/users/register.html',
        controller: 'regCtrl',
        controllerAs: 'register',
        authenticated: false
    })

    .when('/login', {
        templateUrl: 'app/views/pages/users/login.html',
        authenticated: false
    })

    .when('/logout', {
        templateUrl: 'app/views/pages/users/logout.html',
        authenticated: true
    })

    .when('/profile', {
        templateUrl: 'app/views/pages/users/profile.html',
        authenticated: true
    })

    .otherwise({redirctTo: '/'});

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });

});

app.run(['$rootScope', 'Auth', '$location', function($rootScope, Auth, $location){
    $rootScope.$on('$routeChangeStart', function(event, next, current){
        if(next.$$route.authenticated === true){
            if(!Auth.isLoggedIn()){
                event.preventDefault();
                $location.path('/');
            }
        }else if(next.$$route.authenticated === false){
            if(Auth.isLoggedIn()){
                event.preventDefault();
                $location.path('/');
            }
        }
    })
}])