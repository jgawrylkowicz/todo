angular.module('userService', [])

  // This service is responsible for providing user's information
  // to the front-end of the web application. I have decided against state machines
  // because all processes didn't requiere a lot of complexity.

  // The url is the adress and port of the API of the MS1.

  .factory('User', function($http) {

    const url = 'http://10.102.107.13:8080/';

    // I've decided to use localStorage instead of sessionStorage
    // because then I can test more efficiently.

    // Also no JSON parser, since editing these values (through web console)
    // would be more difficult.  
    var localStorage = window.localStorage;

    return {
      submit: function(formData) {
        return $http.post(url + 'login', formData, {timeout: 5*1000 });
      },
      submitOffline: function(formData) {
        return $http.post('/api/login', formData);
      },
      register: function(formData) {
        //TODO register code here
        return $http.post(url + 'register', formData, {timeout: 5*1000 });
      },
      //creates a user session
      setSession: function(_user, _type){
        //create a session and save it to local storage,
        //so the session data wont be lost after the browser windows closes
        localStorage.setItem('sessionType', _type);
        localStorage.setItem('username', _user);

      },
      getUsername: function(){

        try {
          var user = localStorage.getItem('username');
          return user;
        } catch (e) {
          console.log('Session could not be restored.');
          return undefined;
        }
      },
      getType: function(){

        var session = {};
        try {
          session = localStorage.getItem('sessionType');
          return session;
        } catch (e) {
          console.log('Session could not be restored.');
          return undefined;
        }

      },
      setType: function(_type){
        localStorage.setItem('sessionType', _type);
      },
      setUsername: function(_name){
        localStorage.setItem('username', _name);
      },
      //deletes the session completely
      logout: function(){
        localStorage.clear();
      },
      createOfflineUser:function(){
        return $http.post('/api/users');
      }

    }


  });
