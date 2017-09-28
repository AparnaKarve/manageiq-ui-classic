ManageIQ.angular.app.component('genericObjectDefinitionTreeviewComponent', {
  bindings: {
      currentController: '@',
  },
  controllerAs: 'vm',
  controller: genericObjectDefinitionTreeviewController,
  templateUrl: '/static/generic_object/generic_object_definition_treeview.html.haml',
});

genericObjectDefinitionTreeviewController.$inject = ['$http', '$scope', 'API', 'miqService'];

function genericObjectDefinitionTreeviewController($http, $scope, API, miqService) {
  var vm = this;
  vm.$http = $http;
  vm.$scope = $scope;
  vm.selectedNodes = {};
  vm.data = {};
  vm.godNodes = [];

  vm.treeData1 = '[{"key":"root",' +
                  '"nodes":[{"key":"xx-fr",' +
                            '"text":"Red Hat Satellite Providers",' +
                            '"tooltip":"Red Hat Satellite Providers",' +
                            '"icon":"pficon pficon-folder-close",' +
                            '"selectable":true,' +
                            '"nodes":[{"key":"fr-10r16",' +
                                      '"text":"Satellite 6 Configuration Manager",' +
                                      '"tooltip":"Provider: Satellite 6 Configuration Manager",' +
                                      '"selectable":true,' +
                                      '"image":"/assets/svg/vendor-foreman_configuration-78df9cb4e2856c5532cbe8c0f3df34da14bbd3e5b4135e619bf5f3ff69b795ce.svg",' +
                                      '"lazyLoad":true,' +
                                      '"state":{"expanded":false},' +
                                               '"class":""}' +
                                     '],' +
                            '"state":{"expanded":false},' +
                                     '"class":""}' +
                           '],' +
                  '"text":"All Generic Object Classes",' +
                  '"tooltip":"All Generic Object Classes",' +
                  '"icon":"pficon pficon-folder-close",' +
                  '"state":{"expanded":true},' +
                           '"class":""}' +
                 ']';

  // vm.treeDataObj = [{
  //   key: 'root',
  //   text: 'All Generic Object Classes',
  //   tooltip: 'All Generic Object Classes',
  //   icon: 'pficon pficon-folder-close',
  //   state: {expanded: true},
  //   nodes: [{key: 'node1', text: 'node1', tooltip: 'node1', icon: 'fa fa-remove', state: {expanded: false}},
  //           {key: 'node2', text: 'node2', tooltip: 'node2', icon: 'fa fa-plus', state: {expanded: false}}]
  // }];
  //
  // vm.treeData = JSON.stringify(vm.treeDataObj);
  // console.log(vm.treeData);

  vm.$onInit = function() {
    getGenericObjectDefinitionNodes();



  };

  // ManageIQ.angular.rxSubject.subscribe(function(payload) {
  //   if (payload.reloadTrees && _.isObject(payload.reloadTrees) && Object.keys(payload.reloadTrees).length > 0) {
  //     _.forEach(payload.reloadTrees, function(value, key) {
  //       vm.data[key] = value;
  //     });
  //     vm.$scope.$apply();
  //   }
  // });

  // vm.initSelected = function(tree, node) {
  //   vm.selectedNodes[tree] = vm.selectedNodes[tree] || { key: node };
  // };

  // vm.initData = function(tree, data, selected) {
  //   vm.data[tree] = vm.data[tree] || data;
  //   vm.selectedNodes[tree] = vm.selectedNodes[tree] || { key: selected };
  // };

  // vm.lazyLoad = function(node, name, url) {
  //   return new Promise(function(resolve) {
  //     vm.$http.post(url, {
  //       id: node.key,
  //       tree: name,
  //       mode: 'all',
  //     }).then(function(response) {
  //       resolve(response.data);
  //     });
  //   });
  // };

  vm.nodeSelect = function(node, path) {
    // var url = path + '?id=' + encodeURIComponent(node.key.split('__')[0]);
    // miqJqueryRequest(url, {beforeSend: true});

    // $http.get('/generic_object_definition/show/10000000000001')
    //   .then(setNodes)
    //   .catch(miqService.handleFailure);

    miqService.sparkleOn();
    window.location.href = '/generic_object_definition/show/10000000000001';
  };


  // private functions

  function getGenericObjectDefinitionNodes() {
    API.get('/api/generic_object_definitions?expand=resources&attributes=name,picture.image_href&sort_by=name&sort_options=ignore_case&sort_order=asc')
      .then(setNodes)
      .catch(miqService.handleFailure);
  }

  function setNodes(response) {
    var image;
    var icon;
    _.forEach(response.resources, function(resource) {
      if (resource.picture && resource.picture.image_href) {
        image = resource.picture.image_href;
        icon = undefined;
      } else {
        image = undefined;
        icon = 'fa fa-file-text-o';
      }
      vm.godNodes.push({
        key: 'god_' + resource.id,
        text: resource.name,
        tooltip: resource.name,
        image: image,
        icon: icon,
        state: {expanded: false}
      });
    });

    vm.treeDataObj = [{
      key: 'root',
      text: 'All Generic Object Classes',
      tooltip: 'All Generic Object Classes',
      icon: 'pficon pficon-folder-close',
      state: {expanded: true},
      nodes: vm.godNodes,
    }];

    vm.treeData = JSON.stringify(vm.treeDataObj);
  }
}
