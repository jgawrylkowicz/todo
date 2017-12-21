angular.module('loginCtrl', [])

  // This controller is responsible for the login, registration and creating
  // user's sessions. It takes the data from the userService
  // (states and json via HTTP).

  .controller('loginCtrl', ['$scope', '$state', '$stateParams', 'User', 'Lists',
    function($scope, $state, $stateParams, User, Lists) {

      $scope.formLogin = {};
      $scope.formOfflineLogin = {};
      $scope.action = 'login';
      $scope.loading = false;
      // getting passed info and errors
      $scope.err = $stateParams.err;
      $scope.info = $stateParams.info;

      // I've been plannig to use simple state machines, but in the end I used
      // simple strings. I ended up having only 2 states in which the last
      // one had the same outcome, no matter the input.

      // current states of both state machines
      $scope.currentLoginState = 'login';
      $scope.currentRegisterState = 'register';
      $scope.currentOfflineLoginState = 'login';

      $scope.changeForm = function(action) {
        $scope.action = action;
      }

      // Creating a session without the MS1 authorization
      $scope.createOfllineSession = function() {

        // create a new user
        User.createOfflineUser()
          .then(function(data) {

            var user = {
              username: data.data[0].username,
              password: data.data[0].password,
            };

            $scope.currentOfflineLoginState = 'loading';
            $scope.loading = true;

            User.setType('online');
            User.setUsername(user.username);

            Lists.getAll(user.username)
              .then(function(data) {
                // pass them to frontend
                // just check if there is a response from the service
                // might pass data later
                var params = {
                  sessionType: 'online',
                }
                $state.go('lists', params);

            }).catch(function(data) {
                console.log("Error: Couldn't get data from the API, fallback to offline mode");
                var params = {
                  sessionType: 'offline',
                }
                User.setType('offline');
                $state.go('lists', params);
            });

          }).catch(function(data) {
            $scope.currentOfflineLoginState = 'login';
            $scope.loading = false;
            console.log("Error: An offline session couldn't be created");
          });


      }

      // Login into MS2 using the authorization of MS1
      $scope.submitCredentials = function() {

        if ($scope.formLogin.username !== undefined &&
          $scope.formLogin.password !== undefined) {

          var credentials = {
            username: $scope.formLogin.username,
            password: $scope.formLogin.password
          };

          $scope.currentLoginState = 'loading';
          $scope.loading = true;

          User.submit(credentials)
          .then(function(data) {
            //set the username
            if (data.status == 200) {

              // try to get resources from the service, if the service is unavailable
              // change to the offline mode
              User.setType('online');
              User.setUsername(credentials.username);

              Lists.getAll(credentials.username)
                .then(function(data) {
                  // pass them to frontend
                  // just check if there is a response from the service
                  // might pass data later
                  var params = {
                    sessionType: 'online',
                  }
                  $state.go('lists', params);

              }).catch(function(data) {
                  // Handling the case where MS2 is unavailable
                  console.log("Error: Couldn't get data from the API, fallback to offline mode");
                  var params = {
                    sessionType: 'offline',
                  }
                  User.setType('offline');
                  $state.go('lists', params);
              });
            } else {
              $scope.info = "Wrong credentials. Please try again.";
            }
          })
          .catch(function(data) {

              // Handling the case where MS1 is unavailable
              $scope.formLogin.password = "";
              $scope.currentLoginState = 'login';
              $scope.loading = false;
              $scope.info = "Sorry, the authorization service is unavailable. Please try again later or create an offline session";
          });
        }
      };

      // Login into the 'temporary' session saved on MS2 without MS1
      $scope.restoreOfflineSession = function() {

        if ($scope.formOfflineLogin.username !== undefined &&
          $scope.formOfflineLogin.password !== undefined) {

          var credentials = {
            username: $scope.formOfflineLogin.username,
            password: $scope.formOfflineLogin.password
          };

          $scope.currentOfflineLoginState = 'loading';
          $scope.loading = true;

          User.submitOffline(credentials).
          then(function(data) {
            //set the username
            if (data.status == 200) {

              // try to get resources from the service, if the service is unavailable
              // change to the offline mode
              User.setType('online');
              User.setUsername(credentials.username);

              Lists.getAll(credentials.username)
                .then(function(data) {
                  // pass them to frontend
                  // just check if there is a response from the service
                  // might pass data later
                  var params = {
                    sessionType: 'online',
                  }
                  $state.go('lists', params);

              }).catch(function(data) {
                // User found but, the service MS2 seems unreachable, fallback to offline
                  console.log("Error: Couldn't get data from the API, fallback to offline mode");
                  var params = {
                    sessionType: 'offline',
                  }
                  User.setType('offline');
                  $state.go('lists', params);
              });
            } else {
              // No user found under this name
              $scope.currentOfflineLoginState = 'login';
              $scope.loading = false;
              $scope.info = "Wrong credentials. The session couldn't be resorted";

            }
          })
          .catch(function(data) {
            // The session could be neither restored nor created
            $scope.currentOfflineLoginState = 'login';
            $scope.loading = true;
            console.log("Error: Couldn't create an offline session");
          });
        }
      };

      // Register an account via MS1 and log in automatically into the MS2.
      // Register means creating a new account, so there I'm not checking
      // if there is data for the user in MS2

      $scope.registerAccount = function() {

        if ($scope.formRegister.username !== undefined &&
          $scope.formRegister.password !== undefined &&
          $scope.formRegister.forename !== undefined &&
          $scope.formRegister.surname !== undefined) {

          var account = {
            username: $scope.formRegister.username,
            password: $scope.formRegister.password,
            forename: $scope.formRegister.forename,
            surname: $scope.formRegister.surname,
          };

          User.register(account)
          .then(function(data) {

            if (data.status == 200) {
                // register successful
                User.setType('online');
                User.setUsername(account.username);

                var params = {
                  sessionType: 'online',
                }
                $state.go('lists', params);
            }

          })
          .catch(function(data) {
            console.log("Error: Couldn't get data from the API");
          });

        }
      };
    }
  ]);
