ManageIQ.angular.app.component('mainCustomButtonFormComponent', {
  bindings: {
    genericObjectDefnRecordId: '@?',
    customButtonRecordId: '@?',
    redirectUrl: '@',
  },
  controllerAs: 'vm',
  controller: mainCustomButtonFormController,
  templateUrl: '/static/generic_object/main_custom_button_form.html.haml',
});

mainCustomButtonFormController.$inject = ['API', 'miqService', '$q'];

function mainCustomButtonFormController(API, miqService, $q) {
  var vm = this;

  var optionsPromise = null;

  vm.$onInit = function() {
    vm.entity = __('Custom Button');
    vm.saveable = miqService.saveable;
    vm.afterGet = false;

    vm.customButtonModel = {
      button_type: 'default',
      name: '',
      description: '',
      display: true,
      button_icon: '',
      button_color: '#4d5258',
      options: {},
      resource_action: {},
      visibility: {},
      dialog_id: undefined,
      open_url: false,
      display_for: 'single',
      submit_how: 'one',
      ae_instance: 'Request',
      ae_message: 'create',
      request: '',
      roles: ['_ALL_'],
      attribute_names: [],
      attribute_values: [],
      attributeValuesTableChanged: false,
      current_visibility: 'all',
    };

    vm.dialogs = [];
    vm.button_types = [];
    vm.ae_instances = [];
    vm.available_roles = [];

    vm.attributeValueTableHeaders = [__("Name"), __("Value")];

    vm.display_for = [
      {id: 'single', name: __('Single Entity')},
      {id: 'list', name: __('List')},
      {id: 'both', name: __('Single and List')},
    ];

    vm.submit_how = [
      {id: 'all', name: __('Submit all')},
      {id: 'one', name: __('One by one')},
    ];

    vm.visibilities = [
      {id: 'all', name: __('<To All>')},
      {id: 'role', name: __('<By Role>')},
    ];

    // vm.customButtonRecordId = '10000000000022';

    // var dialogsPromise = API.get('/api/service_dialogs?expand=resources&attributes=label&sort_by=label&sort_order=asc&sort_options=ignore_case')
    //   .then(getServiceDialogs)
    //   .catch(miqService.handleFailure);

    optionsPromise = API.options('/api/custom_buttons')
      .then(getCustomButtonOptions)
      .catch(miqService.handleFailure);

    if (vm.customButtonRecordId) {
      vm.newRecord = false;
      miqService.sparkleOn();
      var dataPromise = API.get('/api/custom_buttons/' + vm.customButtonRecordId + '?attributes=resource_action')
        .then(getCustomButtonFormData)
        .catch(miqService.handleFailure);


    } else {
      vm.newRecord = true;
      // vm.afterGet = true;

      vm.modelCopy = angular.copy( vm.customButtonModel );
    }

    $q.all([optionsPromise, dataPromise])
      .then(promisesResolvedForLoad);
  };

  vm.cancelClicked = function() {
    miqService.sparkleOn();
    if (vm.newRecord) {
      miqService.redirectBack(sprintf(__('Creation of new %s was canceled by the user.'), vm.entity), 'warning', vm.redirectUrl);
    } else {
      miqService.redirectBack(sprintf(__('Edit of %s \"%s\" was canceled by the user.'), vm.entity, vm.customButtonModel.name), 'warning', vm.redirectUrl);
    }
  };

  vm.resetClicked = function(angularForm) {
    vm.customButtonModel = Object.assign({}, vm.modelCopy);

    assignAllObjectsToKeyValueArrays(true);

    angularForm.$setUntouched(true);
    angularForm.$setPristine(true);



    miqService.miqFlash('warn', __('All changes have been reset'));
  };

  vm.saveClicked = function() {
    vm.customButtonRecordId = '10000000000022';
    var saveMsg = sprintf(__('%s \"%s\" has been successfully saved.'), vm.entity, vm.customButtonModel.name);
    vm.saveWithAPI('put', '/api/custom_buttons/' + vm.customButtonRecordId, vm.prepSaveObject(), saveMsg);
  };

  vm.addClicked = function() {
    console.log(vm.customButtonModel.dialog_id);
    var saveMsg = sprintf(__('%s \"%s\" has been successfully added.'), vm.entity, vm.customButtonModel.name);
    vm.saveWithAPI('post', '/api/custom_buttons/', vm.prepSaveObject(), saveMsg);
  };

  vm.prepSaveObject = function() {
    vm.customButtonModel.options = {};
    vm.customButtonModel.resource_action = {};
    vm.customButtonModel.visibility = {};
    vm.customButtonModel.roles = [];

    vm.customButtonModel.options = {
      button_icon: vm.customButtonModel.button_icon,
      button_color: vm.customButtonModel.button_color,
      button_type: vm.customButtonModel.button_type,
      display: vm.customButtonModel.display,
      open_url: vm.customButtonModel.open_url,
      display_for: vm.customButtonModel.display_for,
      submit_how: vm.customButtonModel.submit_how,
    };

    vm.customButtonModel.resource_action.ae_attributes = _.zipObject(
      vm.customButtonModel.attribute_names,
      vm.customButtonModel.attribute_values);
    vm.customButtonModel.resource_action.ae_attributes.request = vm.customButtonModel.request;

    vm.customButtonModel.resource_action = {
      dialog_id: vm.customButtonModel.dialog_id,
      ae_namespace: 'SYSTEM',
      ae_class: 'PROCESS',
      ae_instance: vm.customButtonModel.ae_instance,
      ae_message: vm.customButtonModel.ae_message,
      ae_attributes: vm.customButtonModel.resource_action.ae_attributes,
    };

    if (vm.customButtonModel.current_visibility === 'role')
    vm.customButtonModel.roles =  _.pluck(_.filter(vm.available_roles, function(role) {
      return role.value === true;
    }), 'name');

    vm.customButtonModel.visibility = {
      roles: vm.customButtonModel.roles,
    };

    return {
      name: vm.customButtonModel.name,
      description: vm.customButtonModel.description,
      applies_to_class: 'GenericObjectDefinition',
      applies_to_id: vm.genericObjectDefnRecordId,
      options: vm.customButtonModel.options,
      resource_action: vm.customButtonModel.resource_action,
      visibility: vm.customButtonModel.visibility,
    };
  };

  vm.saveWithAPI = function(method, url, saveObject, saveMsg) {
    miqService.sparkleOn();
    API[method](url, saveObject)
      .then(miqService.redirectBack.bind(vm, saveMsg, 'success', vm.redirectUrl))
      .catch(miqService.handleFailure);
  };

  // private functions
  function getCustomButtonFormData(response) {
    Object.assign(vm.customButtonModel, response);

    vm.customButtonModel.button_icon = response.options.button_icon;
    vm.customButtonModel.button_color = response.options.button_color;
    vm.customButtonModel.button_type = response.options.button_type;
    vm.customButtonModel.display = response.options.display;
    vm.customButtonModel.open_url = response.options.open_url;
    vm.customButtonModel.display_for = response.options.display_for;
    vm.customButtonModel.submit_how = response.options.submit_how;

    vm.customButtonModel.dialog_id = response.resource_action.dialog_id;
    vm.customButtonModel.ae_instance = response.resource_action.ae_instance;
    vm.customButtonModel.ae_message = response.resource_action.ae_message;
    vm.customButtonModel.request = response.resource_action.ae_attributes.request;

    vm.customButtonModel.current_visibility = response.visibility.roles[0] === '_ALL_' ? 'all' : 'role';

    optionsPromise.then(function() {
      if (vm.customButtonModel.current_visibility === 'role') {
        _.forEach(vm.available_roles, function (role, index) {
          if (_.includes(response.visibility.roles, role.name)) {
            vm.available_roles[index].value = true;
          }
        });
      }
    });

    delete vm.customButtonModel.resource_action.ae_attributes.request;
    vm.customButtonModel.noOfAttributeValueRows = assignObjectToKeyValueArrays(
      vm.customButtonModel.resource_action.ae_attributes,
      vm.customButtonModel.attribute_names,
      vm.customButtonModel.attribute_values);

    vm.modelCopy = Object.assign({}, vm.customButtonModel);
    // vm.afterGet = true;
    miqService.sparkleOff();
  }

  // function getServiceDialogs(response) {
  //   _.forEach(response.resources, function(item) {
  //     vm.dialogs.push({id: item.id, label: item.label});
  //   });
  // }

  function assignAllObjectsToKeyValueArrays(purge) {
    if (purge) {
      vm.customButtonModel.attribute_names = [];
      vm.customButtonModel.attribute_values = [];
    }

    vm.customButtonModel.noOfAttributeValueRows = assignObjectToKeyValueArrays(
      vm.customButtonModel.resource_action.ae_attributes,
      vm.customButtonModel.attribute_names,
      vm.customButtonModel.attribute_values);

    vm.modelCopy = Object.assign({}, vm.customButtonModel);
    vm.modelCopy = Object.freeze(vm.modelCopy);
  }

  function assignObjectToKeyValueArrays(obj, keyArray, valueArray) {
    if (_.size(obj) === 0) {
      keyArray.push('');
    } else {
      _.forEach(obj, function(value, key) {
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

  function getCustomButtonOptions(response) {
    _.forEach(response.data.custom_button_types, function(name, id) {
      vm.button_types.push({id: id, name: name});
    });

    _.forEach(response.data.service_dialogs, function(item) {
      vm.dialogs.push({id: item[0].toString(), label: item[1]});
    });

    _.forEach(response.data.distinct_instances_across_domains, function(item) {
      vm.ae_instances.push({id: item, name: item});
    });

    _.forEach(response.data.user_roles, function(item) {
      vm.available_roles.push({name: item, value: false});
    });
  }

  function promisesResolvedForLoad() {
    vm.afterGet = true;
    miqService.sparkleOff();
  }
}
