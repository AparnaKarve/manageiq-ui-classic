ManageIQ.angular.app.component('genericObjectDefinitionComponent', {
  bindings: {
    recordId: '@?',
    redirectUrl: '@',
  },
  controllerAs: 'vm',
  controller: genericObjectDefinitionFormController,
  templateUrl: '/static/generic_object/generic_object_definition.html.haml',
});

genericObjectDefinitionFormController.$inject = ['API', 'miqService', '$timeout'];

function genericObjectDefinitionFormController(API, miqService, $timeout) {
  var vm = this;

  vm.$onInit = function() {
    vm.entity = __('Generic Object Class');
    vm.saveable = miqService.saveable;
    vm.afterGet = false;

    vm.attributeTableHeaders = [__("Name"), __("Type")];
    vm.associationTableHeaders = [__("Name"), __("Class")];
    vm.methodTableHeaders = [__("Name")];

    vm.types = [
      {id: "integer", name: "integer"},
      {id: "string", name: "string"},
      {id: "boolean", name: "boolean"},
      {id: "datetime", name: "datetime"},
    ];

    vm.classes = [
      {id: "Service", name: "Service"},
      {id: "Vm", name: "Vm"},
    ];


    vm.genericObjectDefinitionModel = {
      name: '',
      description: '',
      attribute_names: [],
      attribute_types: [],
      association_names: [],
      association_classes: [],
      method_names: [],
    };

    if (vm.recordId) {
      vm.newRecord = false;
      miqService.sparkleOn();
      API.get('/api/generic_object_definitions/' + vm.recordId)
        .then(getGenericObjectDefinitionFormData)
        .catch(miqService.handleFailure);
    } else {
      vm.newRecord = true;
      vm.afterGet = true;

      vm.modelCopy = angular.copy( vm.genericObjectDefinitionModel );
    }
  };

  vm.resetClicked = function(angularForm) {
    vm.genericObjectDefinitionModel = angular.copy(vm.modelCopy);

    assignAllObjectsToKeyValueArrays(true);

    $timeout(function () {
      angularForm.$setUntouched(true);
      angularForm.$setPristine(true);
    }, -1);

    miqService.miqFlash('warn', __('All changes have been reset'));
  };

  vm.cancelClicked = function() {
    miqService.sparkleOn();
    if (vm.newRecord) {
      miqService.redirectBack(sprintf(__('Creation of new %s was canceled by the user.'), vm.entity), 'warning', vm.redirectUrl);
    } else {
      miqService.redirectBack(sprintf(__('Edit of %s \"%s\" was canceled by the user.'), vm.entity, vm.genericObjectDefinitionModel.name), 'warning', vm.redirectUrl);
    }
  };


  // private functions
  function getGenericObjectDefinitionFormData(response) {
    Object.assign(vm.genericObjectDefinitionModel, response);

    assignAllObjectsToKeyValueArrays();

    vm.afterGet = true;
    vm.modelCopy = angular.copy( vm.genericObjectDefinitionModel );

    miqService.sparkleOff();
  }

  function assignAllObjectsToKeyValueArrays(purge) {
    if (purge) {
      vm.genericObjectDefinitionModel.attribute_names = [];
      vm.genericObjectDefinitionModel.attribute_types = [];
      vm.genericObjectDefinitionModel.association_names = [];
      vm.genericObjectDefinitionModel.association_classes = [];
      vm.genericObjectDefinitionModel.method_names = [];
    }

    vm.genericObjectDefinitionModel.noOfAttributeRows = assignObjectToKeyValueArrays(
      vm.genericObjectDefinitionModel.properties.attributes,
      vm.genericObjectDefinitionModel.attribute_names,
      vm.genericObjectDefinitionModel.attribute_types);

    vm.genericObjectDefinitionModel.noOfAssociationRows = assignObjectToKeyValueArrays(
      vm.genericObjectDefinitionModel.properties.associations,
      vm.genericObjectDefinitionModel.association_names,
      vm.genericObjectDefinitionModel.association_classes);

    vm.genericObjectDefinitionModel.noOfMethodRows = assignObjectToKeyValueArrays(
      vm.genericObjectDefinitionModel.properties.methods,
      vm.genericObjectDefinitionModel.method_names);
  }

  function assignObjectToKeyValueArrays(obj, keyArray, valueArray) {
    if (_.size(obj) == 0) {
      keyArray.push('');
    } else {
      _.forEach(obj, function (value, key) {
        if (valueArray) {
          keyArray.push(key);
          valueArray.push(value);
        } else {
          keyArray.push(value);
        }
      });
    }
    return _.size(keyArray);
  }
}
