findItApp.controller('ItemDetailsController', ['$scope', '$http', '$routeParams', 'ItemService', function($scope, $http, $routeParams, ItemService) {
    const itemId = $routeParams.id;
    
    // Load item details
    ItemService.getItem(itemId)
        .then(function(response) {
            $scope.item = response.data;
        })
        .catch(function(error) {
            console.error('Error loading item:', error);
        });

    // Claim item
    $scope.claimItem = function(itemId) {
        const claimData = {
            description: prompt('Please describe why you are claiming this item:'),
            contact: prompt('Please provide your contact information:')
        };

        if (claimData.description && claimData.contact) {
            ItemService.submitClaim(itemId, claimData)
                .then(function() {
                    alert('Claim submitted successfully!');
                })
                .catch(function(error) {
                    console.error('Error submitting claim:', error);
                    alert('Failed to submit claim');
                });
        }
    };
}]);
