angular.module('listCtrl', [])

  // Controller for the lists

  .controller('listCtrl', ['$scope', '$state', '$stateParams', 'Lists',
    function($scope, $state, $stateParams, Lists) {

      // function need for displaying the tasks properly
      $scope.unfinishedTasks = function() {
        var numOfUnfinishedTasks = 0;

        if ($scope.list.todos.length === undefined) return 0;
        if ($scope.list.todos.length === 0) return 0;

        for (var i = 0; i < $scope.list.todos.length; i++) {
          if ($scope.list.todos[i].done == false) {
            ++numOfUnfinishedTasks;
          }
        }
        return numOfUnfinishedTasks;
      };

    }
  ]);
