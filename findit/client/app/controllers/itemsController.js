findItApp.controller('ItemsController', ['$scope', '$http', '$location', function($scope, $http, $location) {
    $scope.items = [];
    $scope.searchText = '';

    // Load all items
    $http.get('/api/items')
        .then(function(response) {
            $scope.items = response.data;
        })
        .catch(function(error) {
            console.error('Error loading items:', error);
        });

    // View item details
    $scope.viewItem = function(itemId) {
        $location.path('/items/' + itemId);
    };

    // Delete item
    $scope.deleteItem = function(itemId) {
        if (confirm('Are you sure you want to delete this item?')) {
            $http.delete('/api/items/' + itemId)
                .then(function() {
                    // Remove item from local array
                    $scope.items = $scope.items.filter(item => item._id !== itemId);
                })
                .catch(function(error) {
                    console.error('Error deleting item:', error);
                });
        }
    };
}]);
