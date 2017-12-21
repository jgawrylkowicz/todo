angular.module('mainCtrl', [])

  // Controller for the main functionality of the application
  // It contains mostly the functions for manipulating data on the MS2 service (remote)
  // and mongodb (locally)

  .controller('mainCtrl', ['$scope', '$state', '$stateParams', 'Lists', 'User', function($scope, $state, $stateParams, Lists, User) {

    const username = User.getUsername();
    if ($stateParams.sessionType !== undefined){
        User.setType(sessionType);
    }

    $scope.getType = function(){
      return User.getType();
    }

    // if no user has been set, go back to login
    if(username == undefined && User.getType() == undefined){
      console.log('Error: No user or session set')
      var params = {
        err: "Sorry, the user or the session couldn't be restored"
      }
      $state.go('login', params);
    }

    // .success and .error have been deprecated and are removed with the version 1.6
    // .then has to be used instaed

    $scope.username = username;
    $scope.formData = {};
    $scope.formTodo = {};

    // get all lists at the start
    Lists.getAll(username)
      .then(function(data) {
        // pass them to frontend
        allLists = data.data;
        $scope.allLists = allLists;
        // get the first list, as the first one will be displayed on the main page
        if (allLists && allLists.length) {
          if (allLists.length > 0) {
            $scope.list = allLists[0];
          }
        }
    }).catch(function(data) {
      console.log("Error: Couldn't get data from the API");
    });


    //function for changing active list without reloading the whole page
    $scope.changeToList = function(list) {

      if (list != undefined) {

        // _id is for mongodb and id for ms2
        var id = ( User.getType() == 'offline') ? list._id : list.id;

        Lists.getByID(id)
        .then(function(data) {
          $scope.list = data.data;
        }).catch(function(data) {
          console.log("Error: Couldn't get data from the API");
        });
      }
    };

    $scope.createList = function() {

      if ($scope.formData.title &&
        $scope.formData.title.length >= 3 &&
        $scope.formData.title.length <= 20) {

        $scope.formData.date = Lists.getFormatedDate(new Date());
        $scope.formData.user = username;

        Lists.createList($scope.formData)
        .then(function(data) {
          // clear the form so the modal is empty
          $scope.formData = {};
            // get updated lists tree
            $scope.allLists = data.data;
            // make the new list active
            // it should be the last one.
            $scope.list = data.data[data.data.length - 1];
        }).catch(function(data) {
          console.log("Error: Couldn't get data from the API");
        });
      } else {
        console.log("Error: Invalid form data");
      }
    };

    $scope.deleteList = function(listData) {

      Lists.delete(listData)
      .then(function(data) {
        // get updated lists tree
        $scope.allLists = data.data;
        // make the first list from the query active
        $scope.list = data.data[0];
      }).catch(function(data) {
        console.log("Error: Couldn't get data from the API");
      });
    };

    // edit the list and update the whole list.
    // It won't be changed individually.

    $scope.editList = function() {

      if ($scope.list.title &&
        $scope.list.title.length >= 3 &&
        $scope.list.title.length <= 20) {

          Lists.updateList($scope.list)
          .then(function(data) {
            //get updated list from the responsce
            $scope.list = data.data;
          }).catch(function(data) {
            console.log("Error: Couldn't get data from the API");
          });

        } else {
          console.log("Error: Invalid form data, the list have not been updated");
        }
    };

    $scope.updateList = function() {

      Lists.updateList($scope.list)
      .then(function(data) {
        // get updated list from the response
        $scope.list = data.data;
      }).catch(function(data) {
        console.log("Error: Couldn't get data from the API");
      });

    };

    // add new todo to the list and update the whole list
    $scope.addTodo = function(text) {

      if (text &&
        text.length >= 3 &&
        text.length <= 100) {

        var todo = {
          text: text,
          done: false,
          date: Lists.getFormatedDate(new Date())
        }

        if ($scope.list.todos == undefined) {
          $scope.list.todos = [];
        }
        $scope.list.todos.push(todo);
        $scope.formTodo = {};

        Lists.updateList($scope.list)
        .then(function(data) {
          //get updated list from the response
          $scope.list = data.data;

        }).catch(function(data) {
          console.log("Error: Couldn't get data from the API");
        });
      } else {
        console.log("Error: Invalid form data");
      }
    };

    // delete a todo and update the whole list
    $scope.deleteTodo = function(todo) {

      if ($scope.list.todos.length > 0) {
        var index = $scope.list.todos.indexOf(todo);
        $scope.list.todos.splice(index, 1);

        Lists.updateList($scope.list)
        .then(function(data) {
          //get updated list from the response
          $scope.list = data.data;
        }).catch(function(data) {
          console.log("Error: Couldn't get data from the API");
        });
      }
    };

    // logout - clear the local storage and change the application's state to login
    $scope.logout = function() {

      User.logout();
      var params = {
        err: null,
        info: "You've been logged out successfuly"
      }
      $state.go('login', params);

    };

  }]);
