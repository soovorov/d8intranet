'use strict';
/**
 * @ngdoc function
 * @name d8intranetApp.directive:inputEffects
 * @description
 * # inputEffects
 * Directive of the d8intranetApp
 */

angular.module('d8intranetApp')
    .directive('rollMenu', ['$document', function ($document) {
      return {
        link: function (scope, element) {
          $(element).on('click', function () {
            $('.global-wrapper').toggleClass('rolled-bar');
          })
        }
      }
    }])

    .directive('ngBlur', ['$document', function ($document) {
      return {
        link: function (scope, element) {
          element.bind('blur', function () {
            scope.inputSelected = true;
            element[0].value ? scope.inputSelected = true : scope.inputSelected = false;
          });
        }
      };
    }])

    .directive('chosen', function () {
      var linker = function (scope, element, attr) {
        scope.$watch('teamFilter', function () {
          element.trigger('chosen:updated');
        });
        // Enable Choosen jQuery plugin for styling select element
        element.chosen();
      };

      return {
        restrict: 'A',
        link: linker
      };
    })

    .directive('vacationsLeft', function () {
      var progressLeft = function (scope, element, attrs) {
        var barHeight = (attrs.daysLeft / attrs.daysTotal) * 100 + '%';
        element.height(barHeight);
      };

      return {
        restrict: 'A',
        link: progressLeft
      };
    })

    .directive('tableHeadline', function () {
      return {
        restrict: 'AE',
        replace: true,
        templateUrl: 'templates/tableHeader.html'
      };
    })

    .directive('showTableData', function () {
      var hideShowElement = function (scope, element) {
        element.bind('click', function () {
          if ($(this).next().hasClass('show-table-data')) {
            $(this).removeClass('active-table-data');
            $(this).next().removeClass('show-table-data');
          }
          else {
            $('.year-table').find('.months').removeClass('show-table-data');
            $('.year-table').find('.user-name').removeClass('active-table-data');
            $(this).addClass('active-table-data');
            $(this).next().addClass('show-table-data');
          }
        });
      };

      return {
        restrict: 'A',
        link: hideShowElement
      };
    })

    .directive('modal', function () {
      return {
        templateUrl: 'templates/modalMessage.html',
        restrict: 'E',
        transclude: true,
        replace: true,
        scope: true,
        link: function posLink(scope, element, attrs) {
          scope.$watch(attrs.visible, function (value) {
            if (!value) {
              element.hide();
            }
            else {
              element.show();
            }
          });
        }
      };
    })

    .directive('backbutton', function ($window) {
      return {
        template: '<span class="back-button-wrapper"><span class="back-button"></span></span>',
        restrict: 'E',
        replace: true,

        link: function (scope, element) {
          element.on('click', function () {
            $window.history.back();
          })
        }
      }
    })

    .directive('petitionLike', function ($http, $cookies, modalWindow) {
      return {
        restrict: 'E',
        templateUrl: 'templates/petition-like.html',
        replace: true,
        scope: {updateLikes: '&'},

        link: function (scope, element, attrs) {
          scope.isLike = true;

          element.bind('click', function () {
            var request = {'like': 'request'};
            var likeRequest = $http.post('admin/api/petition/' + attrs.petitionId + '/like', request);

            likeRequest.success(function (data) {
              scope.updateLikes();

              modalWindow.setMessage(
                  'success',
                  'Sucess',
                  data.message
              );
            });

            likeRequest.error(function (data) {
              modalWindow.setMessage(
                  'error',
                  'Erorr',
                  data.message
              );
            });
          })
        }
      }
    })

    .directive('insertPetition', function ($compile) {
      return {
        restrict: 'AE',

        link: function (scope, element, attrs) {
          element.bind('click', function () {
            var petitionForm = angular.element(document.getElementById('petitionForm')).find('#formPetition');

            element.toggleClass(attrs.insertPetition);

            if (petitionForm.length == 0) {
              angular.element(document.getElementById('petitionForm'))
                  .append(
                  $compile('<petition-form></petition-form>')(scope));
            }
            else {
              petitionForm.remove();
            }
          });

        }
      }
    })

    .directive('petitionForm', function () {
      return {
        templateUrl: 'templates/petitionForm.html',
        restrict: 'E',
        replace: true,
        scope: true,
        transclude: true
      }
    })

    .directive('insertModal', function ($compile) {
      return function (scope, element) {
        element.bind('click', function () {
          angular.element(document.getElementById('modal-wrapper'))
              .append(
              $compile('<modal title="{{modalHeaderTitle}}" data-type="{{modalMessageType}}" visible="showModalWindow"></modal>')(scope)
          );
        })
      };
    })

    .directive('removeModal', function () {
      return {
        link: function (scope, element) {
          element.bind('click', function () {
            angular.element(document.getElementsByClassName('modal')).remove();
          })
        }
      }
    })

    .directive('updateStatus', function ($rootScope, $timeout, config, getCheckedInUsers) {
      return function (scope, element, attr) {
        element.bind('click', function () {
          element.prop('disabled', true).addClass('checkin-progress');
          getCheckedInUsers.getCheckedIn(config.checkedInList).then(function (data) {
            $rootScope.checkedInUserList = data;

            $timeout(function () {
              element.prop('disabled', false).removeClass('checkin-progress');
            }, 863);

          });
        });
      };
    })

    .directive('errSrc', function () {
      return {
        link: function (scope, element, attrs) {
          element.bind('error', function () {
            if (attrs.src != attrs.errSrc) {
              attrs.$set('src', attrs.errSrc);
            }
          });

          attrs.$observe('ngSrc', function (value) {
            if (!value && attrs.errSrc) {
              attrs.$set('src', attrs.errSrc);
            }
          });
        }
      };
    })

    .directive('staticHeader', function ($window, $timeout) {
      return function (scope, element) {
        $timeout(function () {
          var headerTop = element.offset().top,
              tableWidth = angular.element('.table-data'),
              w = angular.element($window);

          scope.getTableWidth = function () {
            return tableWidth.outerWidth();
          };


          w.bind('scroll', function () {
            if (this.pageYOffset >= headerTop) {
              element.css({
                width: scope.getTableWidth,
                position: 'fixed',
                top: 0
              })
            }
            else {
              element.removeAttr('style');
            }
          });

          w.bind('resize', function () {
            if (this.pageYOffset >= headerTop) {
              element.css({
                width: scope.getTableWidth
              });
            }
          });

        }, 100);
      };
    })

;
