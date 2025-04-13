findItApp.factory('ItemService', ['$http', function($http) {
    const service = {};

    service.getAllItems = function() {
        return $http.get('/api/items');
    };

    service.getItem = function(id) {
        return $http.get('/api/items/' + id);
    };

    service.createItem = function(item) {
        return $http.post('/api/items', item);
    };

    service.updateItem = function(id, item) {
        return $http.put('/api/items/' + id, item);
    };

    service.deleteItem = function(id) {
        return $http.delete('/api/items/' + id);
    };

    service.submitClaim = function(itemId, claimData) {
        return $http.post('/api/items/' + itemId + '/claims', claimData);
    };

    return service;
}]);
