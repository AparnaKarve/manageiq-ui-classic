ManageIQ.angular.app.component('widgetMenu', {
  bindings: {
    widgetId: '@',
    widgetModel: '<',
  },
  controllerAs: 'vm',
  controller: ['$http', 'miqService', function($http, miqService) {
    var vm = this;

    vm.shortcutsMissing = function() {
      return vm.widgetModel.shortcuts.length === 0;
    };
  }],
  template: [
    '  <table class="table table-hover">',
    '    <tbody>',
    '      <div ng-if="vm.shortcutsMissing()">',
    __('No shortcuts are authorized for this user, contact your Administrator'),
    '      </div>',
    '      <tr ng-if="!vm.shortcutsMissing()" ng-repeat="shortcut in vm.widgetModel.shortcuts">',
    '        <td>',
    '          <a title="' + __("Click to go this location") + '" href="{{shortcut.href}}">',
    '{{shortcut.description}}',
    '          </a>',
    '        </td>',
    '      </tr>',
    '    </tbody>',
    '  </table>',
  ].join("\n"),
});
