ManageIQ.angular.app.component('genericObjectTableComponent', {
  bindings: {
    keys: '=',
    values: '=',
    keyType: '@',
    tableHeaders: '=',
    valueOptions: '=',
    newRecord: '=',
    noOfRows: '=',
    afterGet: '<',
    tableRendered: '=',
    tableChanged: '=',
    angularForm: '=',
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

    if (vm.newRecord) {
      vm.addRow(0, vm.keyType + '0', true);
    }

    vm.tableRendered = true;

    console.log(vm.afterGet);
    console.log(vm.keys);
    vm.keysCopy = angular.copy(vm.keys);
    vm.valuesCopy = angular.copy(vm.values);
  };

  // vm.$doCheck = function() {
  //   if (!angular.equals(vm.keys, vm.keysCopy)) {
  //     // vm.tableChanged = true;
  //     console.log("changed");
  //     angularForm.$se
  //   } else {
  //     // vm.tableChanged = false;
  //     console.log("not changed");
  //   }
  // };

  vm.tableChanged2 = function() {
    if (!angular.equals(vm.keys, vm.keysCopy) || !angular.equals(vm.values, vm.valuesCopy)) {
      vm.tableChanged = true;
    } else {
      vm.tableChanged = false;
      // console.log("not changed");
    }
  };

  vm.addRow = function(_currentRow, element, addFromOtherSource) {
    vm.keys.push('');
    vm.noOfRows = _.size(vm.keys);

    if (!addFromOtherSource) {
      $timeout(function () {
        angular.element('#' + element).focus();
      }, -1);
    }
  };

  vm.deleteRow = function(currentRow) {
    _.pullAt(vm.keys, [currentRow]);

    if (vm.values) {
      _.pullAt(vm.values, [currentRow]);
    }
    vm.noOfRows = _.size(vm.keys);

    if (vm.noOfRows === 0) {
      vm.addRow(0, vm.keyType + '0', true);
    }

    vm.tableChanged2();
  };
}
