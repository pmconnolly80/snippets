angular.module('auth')

  .directive('accessRole', ['AuthService',
    function(AuthService) {
      return {
        restrict: 'A',
        link: function($scope, element, attrs) {
          
          var prevDisp = element.css('display'),
              userRoles, accessRole;

          $scope.user = AuthService.user;
          $scope.$watch('user', function(user) {
            if (user.roles)
              userRoles = user.roles;
            updateCSS();
          }, true);

          attrs.$observe('accessRole', function(al) {
            if (al) accessRole = $scope.$eval(al);
            updateCSS();
          });

          function updateCSS() {
            if (userRoles && accessRole) {
              if (!AuthService.authorize(accessRole, userRoles))
                element.css('display', 'none');
              else
                element.css('display', prevDisp);
            }
          }
        }
      };
    }
  ])

  .directive('activeNav', ['$location',
    function($location) {
      return {
        restrict: 'A',
        link: function(scope, element, attrs) {
          var anchor = element[0];
          if (element[0].tagName.toUpperCase() != 'A')
            anchor = element.find('a')[0];
          var path = anchor.href;

          scope.location = $location;
          scope.$watch('location.absUrl()', function(newPath) {
            path = normalizeUrl(path);
            newPath = normalizeUrl(newPath);

            if (path === newPath ||
              (attrs.activeNav === 'nestedTop' && newPath.indexOf(path) === 0)) {
              element.addClass('active');
            } else {
              element.removeClass('active');
            }
          });
        }

      };

      function normalizeUrl(url) {
        if (url[url.length - 1] !== '/')
          url = url + '/';
        return url;
      }

    }
  ]);