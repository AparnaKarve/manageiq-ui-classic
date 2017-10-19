ManageIQ.angular.app.component('genericObjectDefinitionTreeviewComponent', {
  bindings: {

  },
  controllerAs: 'vm',
  controller: genericObjectDefinitionTreeviewController,
  templateUrl: '/static/generic_object/generic_object_definition_treeview.html.haml',
});

genericObjectDefinitionTreeviewController.$inject = ['$http', '$scope', 'API', 'miqService', '$timeout'];

function genericObjectDefinitionTreeviewController($http, $scope, API, miqService, $timeout) {
  var vm = this;
  vm.$http = $http;
  vm.$scope = $scope;
  vm.selectedNodes = {};
  vm.data = {};
  vm.godNodes = [];
  vm.treeData = [];

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

  vm.$onInit = function() {
    $timeout(function() {
      getGenericObjectDefinitionNodes();
    });
    // getGenericObjectDefinitionNodes();
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
  //
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

  vm.nodeSelect = function(node) {
    var key = node.key.split('_');
    // miqService.sparkleOn();
    switch(key[0]) {
      case 'god':
        if (key[1] === 'root') {
          window.location.href = '/generic_object_definition/show_list';
        } else {
          window.location.href = '/generic_object_definition/show/' + key[1];
          // $timeout(function() {
          //   window.location.href = '/generic_object_definition/show/' + key[1];
          // });
          // window.location.href = '/generic_object_definition/show/' + key[1];
          // history.pushState({ path: this.path }, '', '/generic_object_definition/show/' + key[1]);
          // window.location.href = '/generic_object_definition/show/' + key[1];
          // $.get('/generic_object_definition/show/' + key[1], function(data) {
          //   // $('#center_div').slideTo(data)
          //   $('#center_div').html(data);
          // });
        }
        break;
      case 'cbs':
        var parentKey = node.key.split('-');
        var urlParams = new URLSearchParams(window.location.search);
        console.log(urlParams);
        // window.location.href = '/generic_object_definition/show/' + parentKey[1] + '?attributes=' + node.key;
        window.location.href = node.link;
        // if (key[1] === 'root') {
        //   window.location.href = '/generic_object_definition/show_list';
        // } else {
        //   window.location.href = '/generic_object_definition/show/' + key[1];
        // }
        break;
      default:
        window.location.href = '/generic_object_definition/show_list';
    }
  };


  // private functions

  function getGenericObjectDefinitionNodes() {
    API.get('/api/generic_object_definitions?expand=resources&attributes=name,picture.image_href,custom_button_sets&sort_by=name&sort_options=ignore_case&sort_order=asc')
      .then(setNodes)
      .catch(miqService.handleFailure);
  }

  function setNodes(response) {
    var image;
    var icon;
    var selected;
    // console.log(window.location.href);
    _.forEach(response.resources, function(resource) {
      if (resource.picture && resource.picture.image_href) {
        image = resource.picture.image_href;
        icon = undefined;
      } else {
        image = undefined;
        icon = 'fa fa-file-text-o';
      }

      if (resource.id === window.location.href.split("/").pop()) {
        selected = true;
      } else {
        selected = false;
      }

      vm.godNodes.push({
        key: 'god_' + resource.id,
        text: resource.name,
        tooltip: resource.name,
        image: image,
        icon: icon,
        state: {expanded: false, selected: selected},
        nodes: createCbsNodes(resource.custom_button_sets, resource.id),
      });
    });

    if ('show_list' === window.location.href.split("/").pop()) {
      selected = true;
    } else {
      selected = false;
    }

    vm.treeDataObj = [{
      key: 'god_root',
      text: 'All Generic Object Classes',
      tooltip: 'All Generic Object Classes',
      icon: 'pficon pficon-folder-close',
      state: {expanded: true, selected: selected},
      nodes: vm.godNodes,
    }];

    vm.treeData = JSON.stringify(vm.treeDataObj);
  }

  function createCbsNodes(cbs, parentId) {
    var cbsChildNodes = [];

    if (cbs.length > 0) {
      _.forEach(cbs, function(set) {
        cbsChildNodes.push({
          // key: 'cbs_' + set.id + '-' + parentId,
          key: 'cbs_' + set.id,
          // link: '/generic_object_definition/show/' + parentId + '?attributes=' + 'cbs_' + set.id,
          text: set.name,
          tooltip: set.name,
          icon: set.set_data.button_icon,
          state: {expanded: false}
        });
      });

      return [{
        // key: 'cbs_root' + '-' + parentId,
        key: 'cbs_root',
        // link: '/generic_object_definition/show/' + parentId + '?attributes=' + 'cbs_root',
        text: 'Actions',
        tooltip: 'All Actions',
        icon: 'pficon pficon-folder-close',
        state: {expanded: false},
        nodes: cbsChildNodes,
      }];
    } else {
      return undefined;
    }
  }
}
