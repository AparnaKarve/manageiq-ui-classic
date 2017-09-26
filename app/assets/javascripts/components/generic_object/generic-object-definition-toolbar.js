ManageIQ.angular.app.component('genericObjectDefinitionToolbar', {
  bindings: {
    genericObjectDefinitionId: '=?',
    redirectUrl: '@?',
  },
  controllerAs: 'toolbar',
  controller: genericObjectDefinitionToolbarController,
});

genericObjectDefinitionToolbarController.$inject = ['API', 'miqService'];

function genericObjectDefinitionToolbarController(API, miqService) {
  var toolbar = this;

  ManageIQ.angular.rxSubject.subscribe(function(event) {
    toolbar.action = event.type;

    if (toolbar.action) {
      if (toolbar.genericObjectDefinitionId) {
        toolbar.genericObjectDefinitions = _.union(toolbar.genericObjectDefinitions, [toolbar.genericObjectDefinitionId]);
      } else {
        toolbar.genericObjectDefinitions = ManageIQ.gridChecks;
      }
      postGenericObjectDefinitionAction();
    }
  });

  // private functions
  function postGenericObjectDefinitionAction() {
    if (toolbar.action === 'delete' && ! toolbar.genericObjectDefinitionId) {
      _.forEach(toolbar.genericObjectDefinitions, function(genericObjectDefinitionId) {
        API.get('/api/generic_object_definitions/' + genericObjectDefinitionId + '?expand=resources&attributes=generic_objects_count')
          .then(checkGenericObjectCountAndDelete)
          .catch(miqService.handleFailure);
      });
    } else if (toolbar.action === 'delete' && toolbar.genericObjectDefinitionId) {
      deleteWithAPI(toolbar.genericObjectDefinitionId);
    }
  }

  function checkGenericObjectCountAndDelete(response) {
    if (response.generic_objects_count === 0) {
      deleteWithAPI(response.id);
    } else {
      miqService.miqFlashLater({ message: sprintf(__('Generic Object Class "%s" with %s instances cannot be deleted'), response.name, response.generic_objects_count) });
      miqService.miqFlashSaved();
    }
  }

  function deleteWithAPI(id) {
    API.post('/api/generic_object_definitions/' + id, { action: 'delete' })
      .then(postAction)
      .catch(miqService.handleFailure);
  }

  function postAction(response) {
    var saveMsg = sprintf(__('Generic Object Class:"%s" was successfully deleted'), response.name);
    if (toolbar.redirectUrl) {
      miqService.redirectBack(saveMsg, 'success', toolbar.redirectUrl);
    } else {
      miqService.miqFlashLater({message: saveMsg});
      miqService.miqFlashSaved();
    }
  }
}
