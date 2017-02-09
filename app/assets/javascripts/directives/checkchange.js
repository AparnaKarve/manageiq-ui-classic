ManageIQ.angular.app.directive('checkchange', ['miqService', function(miqService) {
  return {
    require: 'ngModel',
    link: function (scope, elem, attr, ctrl) {
      scope['formchange_' + ctrl.$name] = elem[0].name;
      scope['elemType_' + ctrl.$name] = attr.type;

      function tryObj(obj) {
        return obj === null || obj === undefined ? null : obj;
      }

      var angularForm = function() {
        if (scope.$parent.vm && scope.$parent.vm.angularForm) {
          return scope.$parent.vm.angularForm;
        } else if (scope.vm && scope.vm.angularForm) {
          return scope.vm.angularForm;
        } else if (scope.$parent.$parent && scope.$parent.$parent.angularForm) {
          return scope.$parent.$parent.angularForm;
        } else {
          return scope.angularForm;
        }
      };

      var viewModelComparison = function(scope, ctrl) {
        if ((Array.isArray(scope.modelCopy[ctrl.$name]) &&
          angular.equals(scope[scope.model][ctrl.$name], scope.modelCopy[ctrl.$name])) ||
          ctrl.$viewValue == scope.modelCopy[ctrl.$name]) {
          angularForm()[scope['formchange_' + ctrl.$name]].$setPristine();
          angularForm()[scope['formchange_' + ctrl.$name]].$setUntouched();
          angularForm().$pristine = true;
        } else {
          angularForm()[scope['formchange_' + ctrl.$name]].$setDirty();
          angularForm().$pristine = false;
        }
      };

      var viewModelDateComparison = function(scope, ctrl) {
        var modelDate = (ctrl.$modelValue != undefined) ? moment(ctrl.$modelValue) : null;
        var copyDate = (scope.modelCopy[ctrl.$name] != undefined) ? moment(scope.modelCopy[ctrl.$name]) : null;

        if((modelDate && copyDate && (modelDate.diff(copyDate, 'days') == 0)) || (!modelDate && !copyDate)){
          angularForm()[scope['formchange_' + ctrl.$name]].$setPristine();
          angularForm()[scope['formchange_' + ctrl.$name]].$setUntouched();
          angularForm().$pristine = true;
        } else {
          angularForm()[scope['formchange_' + ctrl.$name]].$setDirty();
          angularForm().$pristine = false;
        }
      };

      var checkForOverallFormPristinity = function(scope, ctrl) {
        if (scope.$parent.vm) {
          scope = scope.$parent.vm;
        } else if (scope.vm) {
          scope = scope.vm;
        } else if (scope.$parent.$parent) {
          scope = scope.$parent.$parent;
        } 
        // don't do anything before the model and modelCopy are actually initialized
        if (! ('modelCopy' in scope) || ! scope.modelCopy || ! scope.model || ! (scope.model in scope))
          return;

        var modelCopyObject = _.cloneDeep(scope.modelCopy);
        delete modelCopyObject[ctrl.$name];

        var modelObject = _.cloneDeep(scope[scope.model]);
        delete modelObject[ctrl.$name];

        angularForm().$pristine = angular.equals(modelCopyObject, modelObject);

        if (angularForm().$pristine)
          angularForm().$setPristine();
      };



      if (angular.isDefined(scope.modelCopy)) {
        scope.$watch(attr.ngModel, function () {
          if (scope['elemType_' + ctrl.$name] == "date" || _.isDate(ctrl.$modelValue)) {
            viewModelDateComparison(scope, ctrl);
          } else {
            viewModelComparison(scope, ctrl);
          }
          if (angularForm().$pristine)
            checkForOverallFormPristinity(scope, ctrl);
        });
      }

      ctrl.$parsers.push(function(value) {
        miqService.miqFlashClear();

        var modelCopyCtrlName;
        if (scope.$parent.vm) {
          modelCopyCtrlName = scope.$parent.vm.modelCopy[ctrl.$name];
        } else if(_.has(scope.vm, 'modelCopy')) {
          modelCopyCtrlName = scope.vm.modelCopy[ctrl.$name];
        } else {
          modelCopyCtrlName = scope.modelCopy[ctrl.$name];
        }

        if (value === modelCopyCtrlName) {
          angularForm()[scope['formchange_' + ctrl.$name]].$setPristine();
        }
        if (angularForm()[scope['formchange_' + ctrl.$name]].$pristine) {
          checkForOverallFormPristinity(scope, ctrl);
        }
        angularForm()[scope['formchange_' + ctrl.$name]].$setTouched();
        return value;
      });

      if(angular.isDefined(angularForm()) && angularForm().$pristine) {
        angularForm().$setPristine();
      }
    }
  }
}]);

