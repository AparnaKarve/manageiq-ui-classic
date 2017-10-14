ManageIQ.angular.app.component('customButtonGroupFormComponent', {
  bindings: {
    // genericObjectDefnRecordId: '@?',
    // customButtonGroupRecordId: '@?',
    angularForm: '<',
    model: '=',
    // redirectUrl: '@',
  },
  controllerAs: 'vm',
  controller: customButtonGroupFormController,
  templateUrl: '/static/generic_object/custom_button_group_form.html.haml',
});

// customButtonGroupFormController.$inject = ['API', 'miqService', '$q'];

function customButtonGroupFormController() {
  var vm = this;

  vm.$onInit = function() {
    // vm.entity = __('Custom Button Group');
    // vm.saveable = miqService.saveable;
    // vm.afterGet = false;

    // vm.customButtonGroupModel = {
    //   name: '',
    //   description: '',
    //   display: true,
    //   button_icon: '',
    //   button_color: '#4d5258',
    //   set_data: {},
    // };

    // vm.customButtonGroupRecordId = '10000000000129';

    // if (vm.customButtonGroupRecordId) {
    //   vm.newRecord = false;
    //   miqService.sparkleOn();
    //   API.get('/api/custom_button_sets/' + vm.customButtonGroupRecordId)
    //     .then(getCustomButtonGroupFormData)
    //     .catch(miqService.handleFailure);
    // } else {
    //   vm.newRecord = true;
    //   vm.afterGet = true;
    //
    //   vm.modelCopy = angular.copy( vm.customButtonGroupModel );
    // }
  };

  vm.iconSelect = function(selectedIcon) {
    vm.model.button_icon = selectedIcon;
  };

  // vm.cancelClicked = function() {
  //   miqService.sparkleOn();
  //   if (vm.newRecord) {
  //     miqService.redirectBack(sprintf(__('Creation of new %s was canceled by the user.'), vm.entity), 'warning', vm.redirectUrl);
  //   } else {
  //     miqService.redirectBack(sprintf(__('Edit of %s \"%s\" was canceled by the user.'), vm.entity, vm.customButtonGroupModel.name), 'warning', vm.redirectUrl);
  //   }
  // };

  // vm.resetClicked = function(angularForm) {
  //   vm.customButtonGroupModel = Object.assign({}, vm.modelCopy);
  //
  //   angularForm.$setUntouched(true);
  //   angularForm.$setPristine(true);
  //
  //   miqService.miqFlash('warn', __('All changes have been reset'));
  // };

  // vm.saveClicked = function() {
  //   vm.customButtonGroupRecordId = '10000000000129';
  //   var saveMsg = sprintf(__('%s \"%s\" has been successfully saved.'), vm.entity, vm.customButtonGroupModel.name);
  //   vm.saveWithAPI('put', '/api/custom_button_sets/' + vm.customButtonGroupRecordId, vm.prepSaveObject(), saveMsg);
  // };
  //
  // vm.addClicked = function() {
  //   var saveMsg = sprintf(__('%s \"%s\" has been successfully added.'), vm.entity, vm.customButtonGroupModel.name);
  //   vm.saveWithAPI('post', '/api/custom_button_sets/', vm.prepSaveObject(), saveMsg);
  // };

  // vm.prepSaveObject = function() {
  //   vm.customButtonGroupModel.set_data = {
  //     button_icon: vm.customButtonGroupModel.button_icon,
  //     button_color: vm.customButtonGroupModel.button_color,
  //     display: vm.customButtonGroupModel.display,
  //     applies_to_class: 'GenericObjectDefinition',
  //     applies_to_id: vm.genericObjectDefnRecordId,
  //   };
  //
  //   return {
  //     name: vm.customButtonGroupModel.name,
  //     description: vm.customButtonGroupModel.description,
  //     set_data: vm.customButtonGroupModel.set_data,
  //     owner_type: 'GenericObjectDefinition',
  //     owner_id: vm.genericObjectDefnRecordId,
  //   };
  // };

  // vm.saveWithAPI = function(method, url, saveObject, saveMsg) {
  //   miqService.sparkleOn();
  //   API[method](url, saveObject)
  //     .then(miqService.redirectBack.bind(vm, saveMsg, 'success', vm.redirectUrl))
  //     .catch(miqService.handleFailure);
  // };

  // private functions
  // function getCustomButtonGroupFormData(response) {
  //   Object.assign(vm.customButtonGroupModel, response);
  //
  //   vm.customButtonGroupModel.button_icon = response.set_data.button_icon;
  //   vm.customButtonGroupModel.button_color = response.set_data.button_color;
  //   vm.customButtonGroupModel.display = response.set_data.display;
  //
  //   vm.customButtonGroupModel.set_data = {};
  //
  //   vm.modelCopy = Object.assign({}, vm.customButtonGroupModel);
  //   vm.afterGet = true;
  //   miqService.sparkleOff();
  // }
}
