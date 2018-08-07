(function () {

    angular.module('app', [
        'ngMaterial',
        'ngMessages',
		'ngAnimate'
    ]).controller('AppCtrl', AppCtrl);
    function AppCtrl ($scope, $log, $http, $compile) {
         var headerTabs=[];
     $http.get("/../assets/data/reports-layout.json").then(function (response) {
       console.log(response.data);
            headerTabs= response.data.ReportTabs;
            $scope.headerTabs = headerTabs;
    });
        
    function generateSubSectionsinSubTab(cascData) {
        setTimeout(function () {
            for(var k=0;k<cascData.layout.ReportSections.length; k++){
//                $("#tab-header-containt-"+cascData.headerTabIndex+"-casc"+cascData.cascIndex+"-contait-"+k).text("sampleaaaa"+k);
                var divSubSections = generateBlock("div","","","","");
                for(var p=0;p<cascData.layout.ReportSections[k].ReportSubsections.length;p++){
                    var subS= cascData.layout.ReportSections[k].ReportSubsections[p];
                    var divSubSection = generateBlock("div","","","","");
                    var divSubSectionHead = generateBlock("b",subS.Name,"","","");
                    var divSubSectionContent = generateBlock("div",subS.paraText,"","","");
                    
                    divSubSection.append(divSubSectionHead);
                    divSubSection.append(divSubSectionContent);
                    
                    divSubSections.append(divSubSection);
                }
                $("#tab-header-containt-"+cascData.headerTabIndex+"-casc"+cascData.cascIndex+"-contait-"+k).append(divSubSections);
            }
        },0)
    };
        // used for creating element
    function generateBlock (element, innerHTML, classes, id, attributes) {
        var block = document.createElement(element);
         block.innerHTML = innerHTML;
        block.setAttribute("class",classes);
        block.setAttribute("id",id);
        if(attributes){
            for(attr in attributes){
                 block.setAttribute(attr,attributes[attr]);
            }
        }
        return block;
    }
    var visited = false;
    $scope.onTabSelected = function (selectedTab) {
        if(visited == true)
            return;
        visited = true;
        
        for(var i=0; i< $scope.headerTabs.length ; i++){
            console.log($scope.headerTabs[i]);
            
            for(var j=0;j< $scope.headerTabs[i].ReportCascades.length ; j++){
                var cascData = {};
                cascData.HeaderTabContentID = "tab-header-containt-" + i;
                cascData.headerTabIndex = i;
                cascData.cascIndex = j;
                cascData.layout = $scope.headerTabs[i].ReportCascades[j];
                if($scope.headerTabs[i].ReportCascades[j].Type.toLowerCase() == "tab"){
                    
                    var block = generateSubTab(cascData);
                    $("#"+"tab-header-containt-" + i).append($compile(block)($scope));
//                    debugger;
                    generateSubSectionsinSubTab(cascData);
                    console.log(cascData);
                    
                }else if($scope.headerTabs[i].ReportCascades[j].Type.toLowerCase() == "cascade"){
                    
                    var block = generateCascade(cascData);
                     $("#"+"tab-header-containt-" + i).append($compile(block)($scope));

                }
            }

        }
    }
    var generateSubTab = function (cascData) {
        console.log("inside generateSubTab"+ cascData.HeaderTabContentID)
        console.log(cascData);
//        if(subTabDetails.index== 0)
        {
            var subTabList = "headerTab"+cascData.headerTabIndex+"subTab"+cascData.cascIndex;//subTabDetails.ReportSections
            $scope[subTabList] = cascData.layout.ReportSections;
            
            var hideShowSTab = "showTab"+cascData.headerTabIndex+""+cascData.cascIndex;
            
            var divSubTab = generateBlock("div","","md-padding tab-and-cascade ","","");
            var divCascadeHeader = generateBlock("div","","md-padding animate-show cascade-header cascade-text","",{"ng-click":"hideShowSubTab($event, '"+hideShowSTab+"')","ng-hide":hideShowSTab});
            var anchorCollapse = generateBlock("a",cascData.layout.Name,"","",{"href":"#"}); 
            divCascadeHeader.append(anchorCollapse);
            divSubTab.append(divCascadeHeader);
            
//        var divPanelHeading = generateBlock("div","","panel-heading","",{"ng-click":"cascadeClick($event)"});
//        var h4PanelTitle = generateBlock("h4","","panel-title","",""); 
//        var anchorCollapse = generateBlock("a",cascData.layout.Name,"","",{"data-toggle":"collapse","data-parent":"#","href":"#"+cascId}); 
        
//        h4PanelTitle.append(anchorCollapse);
//        divPanelHeading.append(h4PanelTitle);

            
            var divSubTabDetails = generateBlock("div","","animate-show casc-tab-backColor" ,"",{"ng-show":hideShowSTab});
            var divSubTabTitleVertial = generateBlock("div","","tab-title-vertial md-padding cascade-header","",{"ng-click":"hideShowSubTab($event, '"+hideShowSTab+"')","style":"float: left"});
            var anchorCollapse = generateBlock("a",cascData.layout.Name,"","",{"href":"#"}); 
            divSubTabTitleVertial.append(anchorCollapse);

            divSubTabDetails.append(divSubTabTitleVertial);
            
            
            var mdContent = generateBlock("md-content","","","","");
            var mdTabs = generateBlock("md-tabs","","","",{"md-selected":"selectedIndex"+subTabList,"md-dynamic-height":"","md-border-bottom":"","md-autoselect":"","md-swipe-content":""});
            var mdTab = generateBlock("md-tab","","","",{"ng-repeat":"tab in "+subTabList+"" , "ng-disabled":"tab.disabled","label":"{{tab.Name}}"});
            var mdTabMdContent = generateBlock("md-content","","","",{"flex":"","layout-padding":""});
            var subTabSectionId = cascData.HeaderTabContentID+"-casc"+cascData.cascIndex+"-contait-{{$index}}";
            var PMdTabMdContent = generateBlock("div","","",subTabSectionId,""); 
            
            mdTabMdContent.append(PMdTabMdContent);
            mdTab.append(mdTabMdContent)
            mdTabs.append(mdTab);
            mdContent.append(mdTabs);
            divSubTabDetails.append(mdContent);
            divSubTab.append(divSubTabDetails);
            console.log(divSubTab);
            return divSubTab;
        }
        
    };
    
    var generateCascade = function (cascData) {
        console.log("inside generateSubTab"+ cascData.HeaderTabContentID)
        console.log(cascData);
        var cascId = "casc"+cascData.headerTabIndex+""+cascData.cascIndex;

        var divCascade = generateBlock("div","","panel md-padding","","");
        var divPanelHeading = generateBlock("div","","panel-heading","",{"ng-click":"cascadeClick($event)"});
        var h4PanelTitle = generateBlock("h4","","panel-title","",""); 
        var anchorCollapse = generateBlock("a",cascData.layout.Name,"","",{"data-toggle":"collapse","data-parent":"#","href":"#"+cascId}); 
        
        h4PanelTitle.append(anchorCollapse);
        divPanelHeading.append(h4PanelTitle);
        
        var divPanelCollapse = generateBlock("div","","panel-collapse collapse",cascId,""); 
        var divPanelBody = generateBlock("div","They have passed like rain on the mountain, like a wind in the meadow; The days have gone down in the West behind the hills into shadow.","panel-body","",""); 
        
        divPanelCollapse.append(divPanelBody);
        divCascade.append(divPanelHeading);
        divCascade.append(divPanelCollapse);
        
        console.log(divCascade);
        return divCascade;

    };
        

      selected = null,
      previous = null;
    $scope.selectedHeaderTab = 0;
    $scope.$watch('selectedHeaderTab', function(current, old){
      previous = selected;
      selected = headerTabs[current];
      if ( old + 1 && (old != current)) $log.debug('Goodbye ' + previous.Name + '!');
      if ( current + 1 )                $log.debug('Hello ' + selected.Name + '!');
    });
	
    $scope.showTab = false;
	$scope.hideShowSubTab = function (eve, showHideSTab) {
	   console.log(arguments);
		$scope[showHideSTab] = !$scope[showHideSTab];
        if($(eve.target).closest(".cascade-header").hasClass("active")){
            $(eve.target).closest(".cascade-header").removeClass("active")
        }else{
            $(eve.target).closest(".cascade-header").addClass("active")
        }

    }
    $scope.cascadeClick = function (eve) {
        console.log(eve);
        if($(eve.target).closest(".panel-heading").hasClass("active")){
            $(eve.target).closest(".panel-heading").removeClass("active")
        }else{
            $(eve.target).closest(".panel-heading").addClass("active")
        }
    }
  };
   AppCtrl.$inject = ["$scope", "$log", "$http", "$compile"];

})();
