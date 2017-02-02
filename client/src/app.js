import angular from 'angular'
import 'angular-ui-router'
angular.module('olympics', ["ui.router"])

.config(($stateProvider, $urlRouterProvider) => {
  $urlRouterProvider.otherwise('/sports')

  $stateProvider
  .state('sports', { 
    url:'/sports', 
    templateUrl: 'sports/sports-nav.html',
    resolve: {
      sportsService: function($http){
        return $http.get('/sports');
      }
    },
    controller: function(sportsService){
      // if no http request hard code sports
      // this.sports = ["Weightlifting", "Cycling"];
      // $http.get('/sports').then((response) => {
      //     this.sports = response.data;
      // });
      this.sports = sportsService.data;
    },
    controllerAs: 'sportsCtrl'
  })
  .state('sports.medals', {
    // under sub router so already under /sports/:sportName
    url: '/:sportName',
    templateUrl: 'sports/sports-medals.html',
    resolve: {
      sportService: function($http, $stateParams) {
        // the first $ from ES6
        return $http.get(`/sports/${$stateParams.sportName}`)
      }
    },
    controller: function(sportService){
      this.sport = sportService.data;
    },
    controllerAs: 'sportCtrl'
  })
  .state('sports.new', {
    url: '/:sportName/medal/new',
    templateUrl: 'sports/new-medal.html',
    controller: function($stateParams, $state, $http){
      this.sportName = $stateParams.sportName;

      this.saveMedal = function(medal){
        // for test when no post endpoint from the backend
        //console.log('medal', medal);
        $http({method: 'POST', url: `/sports/${$stateParams.sportName}/medals`, 
          data: {medal}}).then(function(){
          $state.go('sports.medals', {sportName: $stateParams.sportName});
        });
      };
    },
    controllerAs: 'newMedalCtrl'
  })
})

