'use strict';
/**
 * @ngdoc function
 * @name d8intranetApp.filter:filterByPosition
 * @description
 * # filterByPosition
 * Filter of the d8intranetApp
 */

angular.module('d8intranetApp')
    .filter('plural', function () {
      return function (string) {


        // Get number from the string
        var matches = string.match(/\d+/g);

        if (matches == undefined || matches == null) {
          return string;
        }

        else {
          var lastDigit = matches % 10;

          if (lastDigit === 1) {
            return string;
          }

          if (lastDigit >= 2 || lastDigit === 0) {
            return string + 's';
          }
        }
      }
    })

    .filter('teamsOnly', function () {
      return function (teamName, param) {
        var filteredTeam = [];
        angular.forEach(teamName, function (team) {
          if (team.field_team[0].target_id == param) {
            filteredTeam.push(team);
          }

          if (param == 0) {
            filteredTeam.push(team);
          }
        });

        return filteredTeam;
      }
    })

    .filter('htmlToPlaintext', function () {
      return function (content) {
        var convertedString = content.replace(/&gt;/g, '>').replace(/&lt;\//g, '<').replace(/&lt;/g, '<');
        return content ? convertedString.replace(/<[^>]+>/gm, '') : '';
      };
    })

    .filter('htmlCleanUp', function(){
      return function(content) {

        if (content != undefined) {
          var baseContent = content.replace(/<[^>]+>/gm, '');
          var cleanContent = baseContent.replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&nbsp;/gm, ' ').replace(/nbsp;/gm, ' ');
        }
        return cleanContent;
      }
    })


;
