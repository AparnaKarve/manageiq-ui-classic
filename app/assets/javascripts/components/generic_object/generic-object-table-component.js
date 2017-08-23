ManageIQ.angular.app.component('genericObjectTableComponent', {
  bindings: {
    keys: '=',
    values: '=',
    defaultValue: '@?',
    tableHeaders: '=',
    valueOptions: '=',
    noOfRows: '=',
  },
  controllerAs: 'vm',
  controller: genericObjectTableController,
  templateUrl: '/static/generic_object/generic_object_table.html.haml',
});

genericObjectTableController.$inject = ['$timeout'];

function genericObjectTableController($timeout) {
  var vm = this;

  vm.$onInit = function() {
    vm.tableHeaders.push('', '');
    vm.origNoOfRows = vm.noOfRows;
  };

  vm.addRow = function(_currentRow, element) {
    vm.keys.push('');
    vm.values.push(vm.defaultValue);
    vm.noOfRows = _.size(vm.keys);

    $timeout(function () {
      angular.element('#' + element).focus();
    }, -1);
  };

  vm.deleteRow = function(currentRow) {
    _.pullAt(vm.keys, [currentRow]);
    _.pullAt(vm.values, [currentRow]);
    vm.noOfRows = _.size(vm.keys);
  };
}
