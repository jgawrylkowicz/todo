angular.module('listService', [])

  .factory('Lists', function($http, User) {

    var mongodbRegex = new RegExp("[0-9a-fA-F]{24}$");
    //URL of the MS2
    const serviceURL = 'http://10.102.107.9:8081/';

    // Service handles the requests differently dependent on the user type
    // offline or online
    // offline (local) requests will be sent to the local mongodb
    // online (remote) requests will be sent to the MS2


    function validateObjectID(id) {
      if (mongodbRegex.test(id)) return true;
      else false;
    }

    function formatDate(date) {

      var day = date.getDate();
      var month = date.getMonth() + 1;
      var year = date.getFullYear();

      return day + '-' + month + '-' + year;
    }


    return {
      getAll: function(_username) {

        if (User.getType() === 'offline'){
          var config = {
            params: {
              username: _username
            }
          };
          return $http.get('/api/lists', config);
        }
        else return $http.get(serviceURL + _username, {timeout: 10*1000});

      },
      getByID: function(listID) {

        if (User.getType() === 'offline') return $http.get('/api/lists/' + listID);
        else return $http.get(serviceURL + "lists/" + listID);

      },
      createList: function(listData) {

        if (User.getType() === 'offline')
          return $http.post('/api/lists', listData);
        else return $http.post(serviceURL + 'lists', listData);

      },
      delete: function(listData) {

        if (User.getType() === 'offline') {
          var config = {
            params : {
              listID : listData._id,
              username : listData.user
            }
          };
          return $http.delete('/api/lists/' + config.params.listID , config);
        } else {

          //TODO listData._id wont work on ms2
          var listID = listData.id
          // config is for storing queries
          // req.query.
          var config = {}

          return $http.delete(serviceURL + "lists/" + listID);
        }

      },
      updateList: function(listData) {
        if (User.getType() === 'offline')
          return $http.put('/api/lists/' + listData._id, listData);
        else return $http.put(serviceURL + 'lists/' + listData.id, listData);
      },
      validateObjectID: function(id) {
        return validateObjectID(id);
      },
      getFormatedDate: function(date) {
        return formatDate(date);
      }
    }


  });
