ManageIQ.angular.app.controller('bootstrapTreeController', ['$http', '$scope', 'bootstrapTreeSubscriptionService', 'treeDiv', 'initialTreeData', 'railsControllerName', function($http, $scope, bootstrapTreeSubscriptionService, treeDiv, initialTreeData, railsControllerName) {
  var init = function() {
    updateTree(initialTreeData);

    bootstrapTreeSubscriptionService.subscribeToTreeUpdates(updateTree);
    bootstrapTreeSubscriptionService.subscribeToCancelClicks(selectRootNode);
    bootstrapTreeSubscriptionService.subscribeToDeselectTreeNodes(unselectAllNodes);
    bootstrapTreeSubscriptionService.subscribeToSingleItemSelected(selectSingleNode);
  };

  var updateTree = function(data) {
    $(treeDiv).treeview({
      collapseIcon: 'fa fa-angle-down',
      data: data,
      expandIcon: 'fa fa-angle-right',
      nodeIcon: 'fa fa-folder',
      showBorder: false,
      onNodeSelected: nodeSelectedCallback
    });

    $scope.rootNode = $(treeDiv).treeview('getNodes')[0];
    $(treeDiv).treeview('selectNode', $scope.rootNode);
  };

  var nodeSelectedCallback = function(_event, data) {
    if (data.id) {
      $http.get('/' + railsControllerName + '/object_data/' + data.id).then(sendTreeClickedEvent);
    } else {
      $http.get('/' + railsControllerName + '/all_object_data?root=god').then(sendRootTreeClickedEvent);
    }
  };

  var sendTreeClickedEvent = function(response) {
    sendDataWithRx({eventType: 'treeClicked', response: response.data});
  };

  var sendRootTreeClickedEvent = function(response) {
    sendDataWithRx({eventType: 'rootTreeClicked', response: response.data});
  };

  var unselectAllNodes = function(_response) {
    var selectedNodes = $(treeDiv).treeview('getSelected');
    $(treeDiv).treeview('unselectNode', selectedNodes);
  };

  var selectSingleNode = function(response) {
    var node = _.find($scope.rootNode.nodes, {text: response});
    $(treeDiv).treeview('selectNode', node);
  };

  var selectRootNode = function() {
    $(treeDiv).treeview('selectNode', $scope.rootNode);
  };

  init();
}]);
