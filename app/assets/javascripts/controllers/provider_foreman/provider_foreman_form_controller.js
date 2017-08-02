ManageIQ.angular.app.controller('providerForemanFormController', ['$http', '$scope', 'providerForemanFormId', 'miqService', function($http, $scope, providerForemanFormId, miqService) {
  var vm = this;

  vm.providerForemanModel = {
    name: '',
    url: '',
    zone: '',
    verify_ssl: '',
    default_userid: '',
    default_password: '',
    default_auth_status: false,
  };

  vm.formId = providerForemanFormId;
  vm.afterGet = false;
  // vm.validateClicked = miqService.validateWithAjax;
  vm.modelCopy = angular.copy( vm.providerForemanModel );
  vm.model = 'providerForemanModel';
  $scope.checkAuthentication = true;

  vm.saveable = miqService.saveable;

  ManageIQ.angular.scope = vm;


  if (providerForemanFormId == 'new') {
    vm.newRecord = true;

    $http.get('/provider_foreman/form_fields/' + providerForemanFormId)
      .then(getProviderForemanFormData)
      .catch(miqService.handleFailure);
  } else {
    vm.newRecord = false;

    miqService.sparkleOn();

    $http.get('/provider_foreman/form_fields/' + providerForemanFormId)
      .then(getProviderForemanFormData)
      .catch(miqService.handleFailure);
  }

  vm.canValidateBasicInfo = function (angularForm) {
    if (vm.isBasicInfoValid(angularForm))
      return true;
    else
      return false;
  }

  vm.isBasicInfoValid = function(angularForm) {
    if(angularForm.url.$valid &&
      angularForm.default_userid.$valid &&
      angularForm.default_password.$valid)
      return true;
    else
      return false;
  };

  var providerForemanEditButtonClicked = function(buttonName, serializeFields) {
    miqService.sparkleOn();
    var url = '/provider_foreman/edit/' + providerForemanFormId + '?button=' + buttonName;
    if (serializeFields === undefined) {
      miqService.miqAjaxButton(url);
    } else {
      miqService.miqAjaxButton(url, vm.providerForemanModel);
    }
  };

  vm.cancelClicked = function(angularForm) {
    providerForemanEditButtonClicked('cancel');
    angularForm.$setPristine(true);
  };

  vm.resetClicked = function(angularForm) {
    $scope.$broadcast ('resetClicked');
    vm.providerForemanModel = angular.copy( vm.modelCopy );
    angularForm.$setPristine(true);
    miqService.miqFlash("warn", __("All changes have been reset"));
  };

  vm.saveClicked = function(angularForm) {
    providerForemanEditButtonClicked('save', true);
    angularForm.$setPristine(true);
  };

  vm.addClicked = function(angularForm) {
    vm.saveClicked(angularForm);
  };

  $scope.postValidationModelRegistry = function(prefix) {
    if (vm.postValidationModel === undefined) {
      vm.postValidationModel = {}
    }
      if (vm.newRecord) {
        var default_password = vm.providerForemanModel.default_password;
      } else {
        var default_password = vm.providerForemanModel.default_password === "" ? "" : miqService.storedPasswordPlaceholder;
      }
      vm.postValidationModel = {
        name: vm.providerForemanModel.name,
        url: vm.providerForemanModel.url,
        zone: vm.providerForemanModel.zone,
        verify_ssl: vm.providerForemanModel.verify_ssl,
        default_userid: vm.providerForemanModel.default_userid,
        default_password: default_password,
      };
  };

  vm.populatePostValidationModel = function() {
    if (vm.providerForemanModel.default_auth_status === true) {
      $scope.postValidationModelRegistry();
    }
  };

  vm.validateClicked = function($event, authType, url, formSubmit, angularForm) {
    miqService.validateWithREST($event, 'default', url, formSubmit)
      .then(function success(data) {
        $scope.$apply(function() {
          if(data.level == "error") {
            vm.updateAuthStatus(false, angularForm);
          } else {
            vm.updateAuthStatus(true, angularForm);
          }
          miqService.miqFlash(data.level, data.message);
          miqSparkleOff();
        });
      });
  };

  vm.updateAuthStatus = function(updatedValue, angularForm) {
    angularForm.default_auth_status.$setViewValue(updatedValue);
  };

  vm.adjustValidationStatus = function(field, angularForm) {
    // console.log("here");

    // if (vm.modelCopy[field] !== vm.providerForemanModel[field]) {
    var match = _.isMatch(vm.providerForemanModel, vm.postValidationModel);
    if (!match) {
      vm.updateAuthStatus(false, angularForm);
    } else {
      vm.updateAuthStatus(vm.modelCopy.default_auth_status, angularForm);
    }
    if (angular.equals(vm.modelCopy, vm.providerForemanModel)) {
      angularForm.$setPristine(true);
    }
  };

  function getProviderForemanFormData(response) {
    var data = response.data;

    if (! vm.newRecord) {
      vm.providerForemanModel.name = data.name;
      vm.providerForemanModel.url = data.url;
      vm.providerForemanModel.verify_ssl = data.verify_ssl === 1;

      vm.providerForemanModel.default_userid = data.default_userid;
      vm.providerForemanModel.default_auth_status = data.default_auth_status;

      if (vm.providerForemanModel.default_userid !== '') {
        vm.providerForemanModel.default_password = miqService.storedPasswordPlaceholder;
      }
    }

    vm.providerForemanModel.zone = data.zone;
    vm.afterGet = true;
    // vm.updateAuthStatus(vm.providerForemanModel.default_auth_status, $scope.angularForm);
    vm.modelCopy = angular.copy( vm.providerForemanModel );

    vm.populatePostValidationModel();
    miqService.sparkleOff();
  }
}]);
