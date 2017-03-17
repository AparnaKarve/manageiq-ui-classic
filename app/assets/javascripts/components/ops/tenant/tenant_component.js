ManageIQ.angular.app.component('tenantComponent', {
  bindings: {
    id: '=?',
    parent: '=?',
    redirectUrl: '@',
    editUrl: '@',
  },
  controllerAs: 'vm',
  controller: tenantFormController,
  templateUrl: '/static/ops/tenant/tenant.html.haml',
});

tenantFormController.$inject = ['API', 'miqService', 'postService'];

/** @ngInject */
function tenantFormController(API, miqService, postService) {
  var vm = this;

  vm.$onInit = function() {
    vm.saveable = miqService.saveable;
    vm.angularForm = miqService.angularForm;
    vm.afterGet = false;

    vm.tenantModel = {
      name: '',
      description: '',
      parent: vm.parent,
      use_config_for_attributes: '',
      default: ''
    };

    if (angular.isDefined(vm.id)) {
      vm.newRecord = false;
      vm.tenantUrl = '/api/tenants/' + vm.id;
      fetchTenantInfo();
    } else {
      vm.newRecord = true;
      vm.afterGet = true;
      vm.modelCopy = angular.copy( vm.tenantModel );
      vm.tenantUrl = '/api/tenants';
    }

    vm.resetClicked = function(angularForm) {
      vm.tenantModel = angular.copy(vm.modelCopy );
      angularForm.$setUntouched(true);
      angularForm.$setPristine(true);
      miqService.miqFlash("warn", __("All changes have been reset"));
    };

    vm.cancelClicked = function() {
      var cancelMsg = sprintf(__("Add of Tenant was canceled by user"));
      postService.cancelOperation(vm.redirectUrl + '?button=cancel', cancelMsg);
    };

    vm.saveClicked = function() {
      var successMsg = sprintf(__("Tenant %s was saved"), vm.tenantModel.name);
      postService.saveRecord(vm.tenantUrl,
        vm.redirectUrl + '?button=save',
        setTenantInfo(vm.tenantModel),
        successMsg);
    };

    vm.addClicked = function() {
      var successMsg = sprintf(__("Tenant %s was added"), vm.tenantModel.name);
      postService.createRecord(vm.tenantUrl,
        vm.redirectUrl + '?button=add',
        setTenantInfo(vm.tenantModel),
        successMsg);
    };
  };

  // private functions
  function fetchTenantInfo() {
    API.get(vm.tenantUrl)
      .then(getTenantData)
      .catch(miqService.handleFailure);
  }

  function getTenantData(response) {
    vm.tenantModel.name = response.name;
    vm.tenantModel.description = response.description;
    vm.tenantModel.use_config_for_attributes = response.use_config_for_attributes;
    vm.tenantModel.parent = response.ancestry;
    vm.tenantModel.default = !angular.isDefined(response.ancestry);

    vm.afterGet = true;

    vm.modelCopy = angular.copy( vm.tenantModel );
  }

  function setTenantInfo(tenantData) {
    var tenant = {
      name: tenantData.name,
      description: tenantData.description,
      parent: {id: tenantData.parent},
    };
    return tenant;
  }
}
