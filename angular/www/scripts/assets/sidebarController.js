'use strict';

/**
 * @ngdoc function
 * @name d8intranetApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the d8intranetApp
 */
angular.module('d8intranetApp')
    .controller('sidebarController', function (config, checkState, $scope, $rootScope, $cookies, $location) {
      $scope.menuStates = {};
      $scope.menuStates.activeItem = '#' + ($location.$$url).slice(1);

      $scope.loginUrl = config.loginPathUrl;
      $scope.logoutUrl = config.loginPathUrl;

      $scope.menuIsOpen = false;

      $scope.menuItemsList = [
        {
          icon: 'dashboard',
          title: 'Dashboard',
          url: config.frontUrl
        },
        {
          icon: 'employees',
          title: 'Employees',
          url: config.employeesUrl
        },
        {
          icon: 'rest',
          title: 'Statistic',
          url: config.vacationsUrl
        },
        {
          icon: 'edit',
          title: 'Petitions',
          url: config.petitionsUrl
        },
        {
          icon: 'doc',
          title: 'Documents',
          url: config.documentsUrl
        }
      ];


      $scope.setActiveMenuItem = function (menuItemUrl, menuState) {
        $scope.menuStates.activeItem = menuItemUrl;
        $scope.menuIsOpen = menuState;
      };

      $rootScope.jira = '';

      checkState.getState(config.status).then(function (data) {
        $rootScope.logged = data.logged;
        $rootScope.checkedIn = data.checked_in;
        $rootScope.jira = data.jira;
        $rootScope.currentUserId = data.uid;
        $scope.currentUserPic = data.field_image;
        $scope.isAway = data.field_presence_status;

        $scope.sidebarLoaded = true;
      });

    });
