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

  vm.$onInit = function() {
    vm.entity = __('Custom Button');
    vm.saveable = miqService.saveable;
    vm.afterGet = false;

    vm.customButtonModel = {
      name: '',
      description: '',
      display: true,
      button_icon: '',
      button_color: '#4d5258',
      options: {},
      resource_actions: {},
      dialog_id: undefined,
      open_url: false,
      display_for: undefined,
      submit_how: undefined,
    };

    vm.dialogs = [];

    vm.display_for = [
      {id: 'single', name: __('Single Entity')},
      {id: 'list', name: __('List')},
      {id: 'both', name: __('Single and List')},
    ];

    vm.submit_how = [
      {id: 'all', name: __('Submit all')},
      {id: 'one', name: __('One by one')},
    ];

    // vm.customButtonRecordId = '10000000000129';

    var dialogsPromise = API.get('/api/service_dialogs?expand=resources&attributes=label&sort_by=label&sort_order=asc&sort_options=ignore_case')
      .then(getServiceDialogs)
      .catch(miqService.handleFailure);

    if (vm.customButtonRecordId) {
      vm.newRecord = false;
      miqService.sparkleOn();
      API.get('/api/custom_buttons/' + vm.customButtonRecordId)
        .then(getCustomButtonFormData)
        .catch(miqService.handleFailure);
    } else {
      vm.newRecord = true;
      vm.afterGet = true;

      vm.modelCopy = angular.copy( vm.customButtonModel );
    }
  };

  // vm.iconSelect = function(selectedIcon) {
  //   vm.customButtonGroupModel.button_icon = selectedIcon;
  // };

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

    angularForm.$setUntouched(true);
    angularForm.$setPristine(true);



    miqService.miqFlash('warn', __('All changes have been reset'));
  };

  vm.saveClicked = function() {
    // vm.customButtonRecordId = '10000000000129';
    var saveMsg = sprintf(__('%s \"%s\" has been successfully saved.'), vm.entity, vm.customButtonModel.name);
    vm.saveWithAPI('put', '/api/custom_buttons/' + vm.customButtonRecordId, vm.prepSaveObject(), saveMsg);
  };

  vm.addClicked = function() {
    console.log(vm.customButtonModel.dialog_id);
    var saveMsg = sprintf(__('%s \"%s\" has been successfully added.'), vm.entity, vm.customButtonModel.name);
    vm.saveWithAPI('post', '/api/custom_buttons/', vm.prepSaveObject(), saveMsg);
  };

  vm.prepSaveObject = function() {
    vm.customButtonModel.options = {
      button_icon: vm.customButtonModel.button_icon,
      button_color: vm.customButtonModel.button_color,
      display: vm.customButtonModel.display,
      applies_to_class: 'GenericObjectDefinition',
      applies_to_id: vm.genericObjectDefnRecordId,
      open_url: vm.customButtonModel.open_url,
      display_for: vm.customButtonModel.display_for,
      submit_how: vm.customButtonModel.submit_how,
    };

    vm.customButtonModel.resource_actions = {
      dialog_id: vm.customButtonModel.dialog_id,
    };

    return {
      name: vm.customButtonModel.name,
      description: vm.customButtonModel.description,
      options: vm.customButtonModel.options,
      resource_actions: vm.customButtonModel.resource_actions,
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
    vm.customButtonModel.display = response.options.display;

    vm.customButtonModel.options = {};

    vm.modelCopy = Object.assign({}, vm.customButtonModel);
    vm.afterGet = true;
    miqService.sparkleOff();
  }

  function getServiceDialogs(response) {
    _.forEach(response.resources, function(item) {
      vm.dialogs.push({id: item.id, label: item.label});
    });
  }
}
