ManageIQ.angular.app.component('genericObjectDefinitionComponent', {
  bindings: {
    recordId: '@?',
    redirectUrl: '@',
  },
  controllerAs: 'vm',
  controller: genericObjectDefinitionFormController,
  templateUrl: '/static/generic_object/generic_object_definition.html.haml',
});

genericObjectDefinitionFormController.$inject = ['API', 'miqService', '$q', '$timeout'];

function genericObjectDefinitionFormController(API, miqService, $q, $timeout) {
  var vm = this;

  vm.$onInit = function() {
    vm.entity = __('Generic Object Class');
    vm.saveable = miqService.saveable;
    vm.afterGet = false;

    vm.imageUploadStatus = "";
    vm.imageUploaded = false;
    vm.changeImage = false;

    vm.pictureReset = false;

    vm.attributeTableHeaders = [__("Name"), __("Type")];
    vm.associationTableHeaders = [__("Name"), __("Class")];
    vm.methodTableHeaders = [__("Name")];

    vm.types = [];
    vm.classes = [];

    vm.genericObjectDefinitionModel = {
      name: '',
      description: '',
      picture_url_path: '',
      picture: {},
      pictureUpladed: false,
      properties: {},
      attribute_names: [],
      attribute_types: [],
      attributesTableChanged: false,
      association_names: [],
      association_classes: [],
      associationsTableChanged: false,
      method_names: [],
      methodsTableChanged: false,
    };

    vm.tableRendered = false;

    var optionsPromise = API.options('/api/generic_object_definitions/')
      .then(getGenericObjectDefinitionOptions)
      .catch(miqService.handleFailure);

    if (vm.recordId) {
      vm.newRecord = false;
      miqService.sparkleOn();
      var dataPromise = API.get('/api/generic_object_definitions/' + vm.recordId + '?attributes=picture_url_path')
        .then(getGenericObjectDefinitionFormData)
        .catch(miqService.handleFailure);

      $q.all([optionsPromise, dataPromise])
        .then(promisesResolvedForLoad);
    } else {
      vm.newRecord = true;
      vm.afterGet = true;

      vm.modelCopy = angular.copy( vm.genericObjectDefinitionModel );
    }
  };

  vm.cancelClicked = function() {
    miqService.sparkleOn();
    if (vm.newRecord) {
      miqService.redirectBack(sprintf(__('Creation of new %s was canceled by the user.'), vm.entity), 'warning', vm.redirectUrl);
    } else {
      miqService.redirectBack(sprintf(__('Edit of %s \"%s\" was canceled by the user.'), vm.entity, vm.genericObjectDefinitionModel.name), 'warning', vm.redirectUrl);
    }
  };

  vm.resetClicked = function(angularForm) {
    vm.genericObjectDefinitionModel = Object.assign({}, vm.modelCopy);

    assignAllObjectsToKeyValueArrays(true);

    vm.pictureReset = ! vm.pictureReset;

    angularForm.$setUntouched(true);
    angularForm.$setPristine(true);

    miqService.miqFlash('warn', __('All changes have been reset'));
  };

  vm.saveClicked = function() {
    var saveMsg = sprintf(__('%s \"%s\" has been successfully saved.'), vm.entity, vm.genericObjectDefinitionModel.name);
    vm.saveWithAPI('put', '/api/generic_object_definitions/' + vm.recordId, vm.prepSaveObject(), saveMsg);
  };

  vm.addClicked = function() {
    var saveMsg = sprintf(__('%s \"%s\" has been successfully added.'), vm.entity, vm.genericObjectDefinitionModel.name);
    vm.saveWithAPI('post', '/api/generic_object_definitions/', vm.prepSaveObject(), saveMsg);
  };

  vm.uploadClicked = function() {
    var reader = new FileReader();
    var imageFile = angularForm.generic_object_definition_image_file.files[0];

    vm.imageUploadStatus = "";

    if (imageFile.type === 'image/png') {
      vm.genericObjectDefinitionModel.picture.extension = 'png';
    } else if (imageFile.type === 'image/jpg') {
      vm.genericObjectDefinitionModel.picture.extension = 'jpg';
    } else if (imageFile.type === 'image/jpeg') {
      vm.genericObjectDefinitionModel.picture.extension = 'jpeg';
    } else {
      // $timeout(function(){
        vm.imageUploadStatus = __("Incompatible image type");
        angular.element('generic_object_definition_image_file').$setValidity("incompatibleFileType", false);
        return;
      // });
      // vm.imageUploadStatus = __("Incompatible image type");
      // angularForm['generic_object_definition_image_file'].$setValidity("incompatibleFileType", false);
      // return;
    }

    reader.onload = function(event) {
      vm.genericObjectDefinitionModel.picture.content = btoa(event.target.result);

      $timeout(function(){
        vm.imageUploadStatus = __("Image upload complete");
      });
    };

    if (imageFile) {
      // reader.readAsDataURL(imageFile); readAsBinaryString
      reader.readAsBinaryString(imageFile);
    } else {
      vm.imageUploadStatus = __("No file chosen");
    }
  };

  vm.prepSaveObject = function() {
    vm.genericObjectDefinitionModel.properties.attributes = {};
    vm.genericObjectDefinitionModel.properties.associations = {};
    vm.genericObjectDefinitionModel.properties.methods = [];

    vm.genericObjectDefinitionModel.properties.attributes = _.zipObject(
      vm.genericObjectDefinitionModel.attribute_names,
      vm.genericObjectDefinitionModel.attribute_types);

    vm.genericObjectDefinitionModel.properties.associations = _.zipObject(
      vm.genericObjectDefinitionModel.association_names,
      vm.genericObjectDefinitionModel.association_classes);

    if (vm.genericObjectDefinitionModel.method_names[0] !== '') {
      vm.genericObjectDefinitionModel.properties.methods = vm.genericObjectDefinitionModel.method_names;
    }

    var preppedObject =  {
      name: vm.genericObjectDefinitionModel.name,
      description: vm.genericObjectDefinitionModel.description,
      properties: vm.genericObjectDefinitionModel.properties,
    };

    if (vm.genericObjectDefinitionModel.picture !== {}) {
      preppedObject.picture = vm.genericObjectDefinitionModel.picture;
    }

    return preppedObject;
  };

  vm.saveWithAPI = function(method, url, saveObject, saveMsg) {
    miqService.sparkleOn();
    API[method](url, saveObject)
      .then(miqService.redirectBack.bind(vm, saveMsg, 'success', vm.redirectUrl))
      .catch(miqService.handleFailure);
  };

  vm.uniqueProperty = function(keyType) {
    var primaryArray;
    var secondaryArrays = [];
    if (keyType === "Attributes") {
      primaryArray = vm.genericObjectDefinitionModel.attribute_names;
      secondaryArrays.push(vm.genericObjectDefinitionModel.association_names);
      secondaryArrays.push(vm.genericObjectDefinitionModel.method_names);
    }
    if (keyType === "Associations") {
      primaryArray = vm.genericObjectDefinitionModel.association_names;
      secondaryArrays.push(vm.genericObjectDefinitionModel.attribute_names);
      secondaryArrays.push(vm.genericObjectDefinitionModel.method_names);
    }
    if (keyType === "Methods") {
      primaryArray = vm.genericObjectDefinitionModel.method_names;
      secondaryArrays.push(vm.genericObjectDefinitionModel.attribute_names);
      secondaryArrays.push(vm.genericObjectDefinitionModel.association_names);
    }
    return getCurrentUniqueOrCommonProperties(primaryArray, secondaryArrays);
  };

  // private functions
  function getGenericObjectDefinitionFormData(response) {
    Object.assign(vm.genericObjectDefinitionModel, response);

    assignAllObjectsToKeyValueArrays();
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

    vm.modelCopy = Object.assign({}, vm.genericObjectDefinitionModel);
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

  function getCurrentUniqueOrCommonProperties(primaryArray, secondaryArrays) {
    return _.union(
      _.intersection(primaryArray, secondaryArrays[0]),
      _.intersection(primaryArray, secondaryArrays[1]));
  }

  function getGenericObjectDefinitionOptions(response) {
    buildOptionObject(response.data.allowed_association_types, vm.classes);
    buildOptionObject(response.data.allowed_types, vm.types);
  }

  function buildOptionObject(optionData, optionObject) {
    _.forEach(optionData, function(item) {
      optionObject.push({id: item[1], name: item[0]});
    });
  }

  function promisesResolvedForLoad() {
    vm.afterGet = true;
    miqService.sparkleOff();
  }
}
