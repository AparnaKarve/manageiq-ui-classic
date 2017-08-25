ManageIQ.angular.app.component('genericObjectDefinitionComponent', {
  bindings: {
    recordId: '@?',
    redirectUrl: '@',
  },
  controllerAs: 'vm',
  controller: genericObjectDefinitionFormController,
  templateUrl: '/static/generic_object/generic_object_definition.html.haml',
});

genericObjectDefinitionFormController.$inject = ['API', 'miqService'];

function genericObjectDefinitionFormController(API, miqService) {
  var vm = this;

  vm.$onInit = function() {
    vm.saveable = miqService.saveable;
    vm.afterGet = false;

    vm.attrArr = [0];
    vm.currentRow = 0;

    vm.types = [
      {id: "integer", name: "integer"},
      {id: "string", name: "string"},
      {id: "boolean", name: "boolean"},
      {id: "datetime", name: "datetime"},
      {id: "json", name: "json"},
      {id: "jsonb", name: "jsonb"},
    ];

    // vm.classes = [
    //   {id: "Vm", name: "Vm"},
    //   {id: "Service", name: "Service"},
    //   {id: "ManageIQ::Providers::InfraManager", name: "ManageIQ::Providers::InfraManager"},
    // ];
    vm.classes = [];

    vm.attributeTableHeaders = [__("Name"), __("Type")];

    vm.associationTableHeaders = [__("Name"), __("Class")];

    vm.methodTableHeaders = [__("Name")];

    vm.genericObjectDefinitionModel = {
      name: '',
      description: '',
      // attributes: [{attribute_name: '', attribute_type: ''}], //array of objects
      attribute_names: [], //array of objects
      attribute_types: [], //array of objects
    };



    // vm.genericObjectDefinitionModel.attributes.attribute_type = [10];
    // vm.genericObjectDefinitionModel.attributes.attribute_type[0].type = "string";
    // push({attribute_type: "string"});

    API.options('/api/generic_object_definitions/')
      .then(getGenericObjectDefinitionOptions)
      .catch(miqService.handleFailure);

    vm.recordId = 3;

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

  vm.addRow = function(_currentRow) {
    vm.genericObjectDefinitionModel.properties.attribute_names.push('');
    vm.genericObjectDefinitionModel.properties.attribute_types.push('string');
    vm.noOfAttributeRows = _.size(vm.genericObjectDefinitionModel.properties.attribute_names);

  };

  vm.deleteRow = function(currentRow) {
    _.pullAt(vm.genericObjectDefinitionModel.properties.attribute_names, [currentRow]);
    _.pullAt(vm.genericObjectDefinitionModel.properties.attribute_types, [currentRow]);
    vm.noOfAttributeRows = _.size(vm.genericObjectDefinitionModel.properties.attribute_names);
  };

  // vm.saveClicked = function() {
  //   var saveObject = {
  //     name: vm.tenantModel.name,
  //     description: vm.tenantModel.description,
  //     use_config_for_attributes: vm.tenantModel.use_config_for_attributes,
  //   };
  //   var saveMsg = sprintf(__('%s \"%s\" has been successfully saved.'), vm.entity, vm.tenantModel.name);
  //   vm.saveWithAPI('put', '/api/tenants/' + vm.recordId, saveObject, saveMsg);
  // };
  //
  // vm.addClicked = function() {
  //   var saveObject = {
  //     name: vm.tenantModel.name,
  //     description: vm.tenantModel.description,
  //     divisible: vm.divisible,
  //     parent: { id: vm.tenantModel.ancestry },
  //   };
  //   var saveMsg = sprintf(__('%s \"%s\" has been successfully added.'), vm.entity, vm.tenantModel.name);
  //   vm.saveWithAPI('post', '/api/tenants/', saveObject, saveMsg);
  // };
  //
  // vm.saveWithAPI = function(method, url, saveObject, saveMsg) {
  //   miqService.sparkleOn();
  //   API[method](url, saveObject)
  //     .then(miqService.redirectBack.bind(vm, saveMsg, 'success', vm.redirectUrl))
  //     .catch(miqService.handleFailure);
  // };
  //
  // vm.resetClicked = function(angularForm) {
  //   vm.tenantModel = angular.copy(vm.modelCopy);
  //   angularForm.$setUntouched(true);
  //   angularForm.$setPristine(true);
  //   miqService.miqFlash('warn', __('All changes have been reset'));
  // };
  //
  // vm.cancelClicked = function() {
  //   miqService.sparkleOn();
  //   if (vm.newRecord) {
  //     miqService.redirectBack(sprintf(__('Creation of new %s was canceled by the user.'), vm.entity), 'warning', vm.redirectUrl);
  //   } else {
  //     miqService.redirectBack(sprintf(__('Edit of %s \"%s\" was canceled by the user.'), vm.entity, vm.tenantModel.name), 'warning', vm.redirectUrl);
  //   }
  // };
  //
  // vm.changeUseConfigForAttributes = function() {
  //   if (vm.tenantModel.use_config_for_attributes) {
  //     vm.tenantModel.name = vm.modelCopy.name;
  //   }
  // };
  //
  // private functions
  function getGenericObjectDefinitionFormData(response) {
    Object.assign(vm.genericObjectDefinitionModel, response);

    vm.genericObjectDefinitionModel.properties.attribute_names = [];
    vm.genericObjectDefinitionModel.properties.attribute_types = [];
    vm.genericObjectDefinitionModel.properties.association_names = [];
    vm.genericObjectDefinitionModel.properties.association_classes = [];
    vm.genericObjectDefinitionModel.properties.method_names = [];

    _.forEach(vm.genericObjectDefinitionModel.properties.attributes, function(value, key) {
      vm.genericObjectDefinitionModel.properties.attribute_names.push(key);
      vm.genericObjectDefinitionModel.properties.attribute_types.push(value);
    });

    _.forEach(vm.genericObjectDefinitionModel.properties.associations, function(value, key) {
      vm.genericObjectDefinitionModel.properties.association_names.push(key);
      vm.genericObjectDefinitionModel.properties.association_classes.push(value);
    });

    _.forEach(vm.genericObjectDefinitionModel.properties.methods, function(key) {
      vm.genericObjectDefinitionModel.properties.method_names.push(key);
    });

    vm.genericObjectDefinitionModel.properties.attributes = {};
    vm.genericObjectDefinitionModel.properties.associations = {};
    vm.genericObjectDefinitionModel.properties.methods = [];

    vm.noOfAttributeRows = _.size(vm.genericObjectDefinitionModel.properties.attribute_names);
    vm.noOfAssociationRows = _.size(vm.genericObjectDefinitionModel.properties.association_names);
    vm.noOfMethodRows = _.size(vm.genericObjectDefinitionModel.properties.method_names);

    vm.afterGet = true;
    vm.modelCopy = angular.copy( vm.genericObjectDefinitionModel );

    miqService.sparkleOff();
  }

  function getGenericObjectDefinitionOptions(response) {
    _.forEach(response.data.reportable_models, function(item) {
      vm.classes.push({id: item[1], name: item[0]});
    });
  }
}
