ManageIQ.angular.app.component('widgetMenu', {
  bindings: {
    widgetId: '@',
  },
  controllerAs: 'vm',
  controller: ['$http', 'miqService', function($http, miqService) {
    var vm = this;
    vm.widgetMenuModel = {shortcuts: []};

    vm.shortcutsMissing = function() {
      return vm.widgetMenuModel.shortcuts.length === 0;
    };

    this.$onInit = function() {
      $http.get('/dashboard/widget_menu_data/' + vm.widgetId)
        .then(function(response) { vm.widgetMenuModel = response.data; })
        .catch(miqService.handleFailure);
      vm.div_id = 'dd_w' + vm.widgetId + '_box';
    };
  }],
  template: [
    '<div class="mc" id="{{vm.div_id}}" ng-class="{ hidden: vm.widgetMenuModel.minimized }">',
    '  <table class="table table-hover">',
    '    <tbody>',
    '      <div ng-if="vm.shortcutsMissing()">',
    __('No shortcuts are authorized for this user, contact your Administrator'),
    '      </div>',
    '      <tr ng-if="!vm.shortcutsMissing()" ng-repeat="shortcut in vm.widgetMenuModel.shortcuts">',
    '        <td>',
    '          <a title="' + __("Click to go this location") + '" href="{{shortcut.href}}">',
    '{{shortcut.description}}',
    '          </a>',
    '        </td>',
    '      </tr>',
    '    </tbody>',
    '  </table>',
    '</div>',
  ].join("\n"),
});
