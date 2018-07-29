(function () {
    'use strict';

    angular.module('app.index', ['app.todosService','ngMaterial',
        'ngMessages'])

            .controller('IndexController', IndexController);

    IndexController.$inject = ['$log', 'todosService'];

    function IndexController($scope, $log) {
        var tabs = [
            { title: 'One', content: "Tabs will become paginated if there isn't enough room for them."},
            { title: 'Two', content: "You can swipe left and right on a mobile device to change tabs."},
            { title: 'Three', content: "You can bind the selected tab via the selected attribute on the md-tabs element."},
            { title: 'Four', content: "If you set the selected tab binding to -1, it will leave no tab selected."},
            { title: 'Five', content: "If you remove a tab, it will try to select a new one."},
          ],
          selected = null,
          previous = null;
        $scope.tabs = tabs;
        $scope.selectedIndex = 0;
//        $scope.$watch('selectedIndex', function(current, old){
//          previous = selected;
//          selected = tabs[current];
//          if ( old + 1 && (old != current)) $log.debug('Goodbye ' + previous.title + '!');
//          if ( current + 1 )                $log.debug('Hello ' + selected.title + '!');
//        });
        
    }
})();
