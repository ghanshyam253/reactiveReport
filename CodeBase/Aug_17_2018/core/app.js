(function () {

    angular.module('app', [
        'ngMaterial',
        'ngMessages',
		'ngAnimate'
    ]).controller('AppCtrl', AppCtrl);
    function AppCtrl ($scope, $log, $http, $compile) {
         var headerTabs=[];
     $http.get("/../assets/data/reports-layout-service.json").then(function (response) {
       console.log(response.data);
            headerTabs= response.data.reportTabs;
            $scope.headerTabs = angular.copy(headerTabs);
//            $scope.$apply();
            generateContent(headerTabs);
    });
    //test data
    $scope.temp = {"temp":"123456"};    
    $scope.tempArr = {"tempA":[{"tlab1":"t1val","tlab2":"tval2"}]}
    //test data ;
    	
	 $scope.topDirections = ['left', 'up'];
	 $scope.bottomDirections = ['down', 'right'];
     $scope.selectedHeaderTab = 0;

	 $scope.availableModes = ['md-fling', 'md-scale'];
	 $scope.selectedMode = 'md-fling';

	 $scope.availableDirections = ['up', 'down', 'left', 'right'];
     $scope.selectedDirection = 'up';
      
    $scope.isBottomSlideOpen = false;  
    /*if($scope.isBottomSlideOpen == false) 
       $scope.isBottomSlideOpen = true; 
    else
       $scope.isBottomSlideOpen = false; */
        
    $scope.showBottomMenuBlock = false; 
    $scope.bottomMenuBtn = function(){
            if($scope.showBottomMenuBlock == false)
                $scope.showBottomMenuBlock = true;
            else
                $scope.showBottomMenuBlock = false;
     }
     $scope.closebottomMenuBlock = function(){
         $scope.showBottomMenuBlock = false;
     }
     
     
    function formatText(contentDetails,paraTag){
            disTypeArray = contentDetails.displayType.includes(";")?contentDetails.displayType.split(";"):[contentDetails.displayType];
            for(q=0;q<disTypeArray.length;q++){
                if(disTypeArray[q].toLowerCase() == "underline"){
                    paraTag = "<u>"+paraTag+"</u>";
                }else if(disTypeArray[q].toLowerCase() == "bold"){
                    paraTag = "<b>"+paraTag+"</b>";
                }else if(disTypeArray[q].toLowerCase() == "italic"){
                    paraTag = "<i>"+paraTag+"</i>";
                }
            }
        return paraTag;
    }

        function generateLabelValue (contentDetails) {
         
         var displayFields = contentDetails.displayFields;
         console.log(contentDetails);
         if(!displayFields){
              var divRow =    generateBlock("div","There is some problem with configuration in ReportContent Table.","row label-val-row text-danger","","");
              
              return divRow;
         }
            
         
         if(displayFields.includes(":")){
             displayFieldsArr = displayFields.split(":");
             var label = displayFieldsArr[0];
             var valPath = displayFieldsArr[1];
             var valPrefix = displayFieldsArr[2];
             var val = eval("$scope."+valPath);
             if(valPrefix  == "currency"){
                 val = "R "+val;
             }
             if(contentDetails.displayType){
                val = formatText(contentDetails,val);
             }
         }else{
              var label = displayFields;
         }
          if(contentDetails.displayType){
            label = formatText(contentDetails,label);
         }
         
         
         var divSubSection = generateBlock("div","","","","");
         
         if(contentDetails.displayType && contentDetails.displayType.includes("underlineElement")){
             var divRow =    generateBlock("div","","row label-val-row border-bottom","","");
         }else{
             var divRow =    generateBlock("div","","row label-val-row","","");
         }
         var divLabel = generateBlock("div","","col-xs-9","","");
          divLabel.innerHTML=((label));
         var divValue =  generateBlock("div","","col-xs-3 text-right","","");
          divValue.innerHTML=val || "";
         divRow.append(divLabel);
         divRow.append(divValue);
         divSubSection.append(divRow);
         
         if(contentDetails.displayType){
             
         }
         return divSubSection;
     }
    function generateSeparator (contentDetails) {
        var divSeparator = generateBlock("div","&nbsp","","","");
        return divSeparator;
    }
    function generateParagraph (contentDetails) {
        var divSubSection = generateBlock("div","","","","");
        var paraTag = angular.copy(contentDetails.paraText);
        if(contentDetails.displayType){
            paraTag = formatText(contentDetails,paraTag);
        }
        divSubSection.innerHTML=(("<div>"+paraTag+"</div>"));
       
        return divSubSection;
    }
    function generateHyperlink (contentDetails) {
        var divSubSection = generateBlock("div","","","","");
        var anchorHyperLink =  generateBlock("a",contentDetails.paraText,"","",{"href":contentDetails.dataPath});
        divSubSection.append(anchorHyperLink)
        return divSubSection;
    }
    function generateMultipleLabelValue (contentDetails) {
        if(!contentDetails.displayFields){
            var divRow =    generateBlock("div","There is some problem with configuration in ReportContent Table.","row label-val-row text-danger","","");
            return divRow;
        }

        var displayFieldsArray =[];
        displayFieldsArray = contentDetails.displayFields.includes(";")? contentDetails.displayFields.split(";"):[contentDetails.displayFields];
        
        var divPanelBodyRow = generateBlock("div","","row row-mult-label-value"); 
        for(var g=0; g<displayFieldsArray.length; g++){
            var fieldDetailsArr = displayFieldsArray[g].includes(":") ? displayFieldsArray[g].split(":"): [displayFieldsArray[g]];            
            
            var label = fieldDetailsArr[0] || "";
            var valPath = fieldDetailsArr[1] || "";
            var valPrefix = fieldDetailsArr[2] || "";
            console.log( contentDetails.displayFields);
            console.log( displayFieldsArray[g]);
            var val = eval("$scope."+valPath);
            if(valPrefix  == "currency"){
             val = "R "+val;
            }
            
            var divPanelBodyRowCol = generateBlock("div","","col-xs-6 col-row-mult-label-value"); 
            var divPanelBodyRowColLabVal = generateBlock("div","","row"); 
            var divPanelBodyRowColLab = generateBlock("div",label,"col-sm-12 col-md-6 font-weight-bold"); 
            var divPanelBodyRowColVal = generateBlock("div",val,"col-sm-12 col-md-6"); 

            divPanelBodyRowColLabVal.append(divPanelBodyRowColLab);
            divPanelBodyRowColLabVal.append(divPanelBodyRowColVal);

            divPanelBodyRowCol.append(divPanelBodyRowColLabVal)
            divPanelBodyRow.append(divPanelBodyRowCol);
        }
        
        return divPanelBodyRow;
        
    }
     function generateReportContent (reportContents) {
          var divReportContents = generateBlock("div","","","","");
         for(var y=0;y< reportContents.length ; y++){
             if(reportContents[y].newLinesAtTop){
                 for(var m=0;m<reportContents[y].newLinesAtTop;m++){
                      divReportContents.append(generateSeparator(reportContents[y]));
                 }
             }
             if(reportContents[y].type){
                 if(reportContents[y].type.toLowerCase() ==  "labelvalue"){
                    divReportContents.append(generateLabelValue(reportContents[y]));
                 }else if(reportContents[y].type.toLowerCase() ==  "paragraph"){
                    divReportContents.append(generateParagraph(reportContents[y]));
                 }else if(reportContents[y].type.toLowerCase() ==  "separator"){
                    divReportContents.append(generateSeparator(reportContents[y]));
                 }else if(reportContents[y].type.toLowerCase() ==  "hyperlink"){
                    divReportContents.append(generateHyperlink(reportContents[y]));
                 }else if(reportContents[y].type.toLowerCase() ==  "multiplelabelvalue"){
                    divReportContents.append(generateMultipleLabelValue(reportContents[y]));
                 }
             }
             if(reportContents[y].newLinesAtBottom){
                 for(var m=0;m<reportContents[y].newLinesAtBottom;m++){
                      divReportContents.append(generateSeparator(reportContents[y]));
                 }
             }
         }
         return divReportContents;
     }
         
        
     function generatePopup (popupDetails, modalId) {
        var popupModal = generateBlock("div","","modal fade",modalId,{"role":"dialog"});
        var popupModalDialog = generateBlock("div","","modal-dialog modal-lg","","");
        var popupModalContent = generateBlock("div","","popup_container modal-content","","");
        var popupModalContentBlank = generateBlock("div","","","","");
        var popupModalHeader = generateBlock("div","","modal-header","","");
         
        var popupModalHeaderButton = generateBlock("button","&times;","close","",{"type":"button","data-dismiss":"modal"});
        var popupModalHeaderH4 = generateBlock("h4",popupDetails.name,"modal-title","","");
         
         popupModalHeader.append(popupModalHeaderButton);
         popupModalHeader.append(popupModalHeaderH4);
         
        var popupModalContentModelBody = generateBlock("div","","modal-body","","");
        
        var popupModalContentModelBodyContent = generateBlock("p","","","","");
         
         if(popupDetails.reportContents && popupDetails.reportContents.length>0){
             var divReportContents = generateReportContent(popupDetails.reportContents)
             popupModalContentModelBodyContent.append(divReportContents);
         }
         
         
         popupModalContentModelBody.append(popupModalContentModelBodyContent);
         
         popupModalContentBlank.append(popupModalHeader)
         popupModalContentBlank.append(popupModalContentModelBody)
         
         popupModalContent.append(popupModalContentBlank);
         popupModalDialog.append(popupModalContent);
         popupModal.append(popupModalDialog);
         return popupModal;
     }
    function generateSubSectionsinSubTab(cascData) {
        setTimeout(function () {
            for(var k=0;k<cascData.layout.reportSections.length; k++){
//                $("#tab-header-containt-"+cascData.headerTabIndex+"-casc"+cascData.cascIndex+"-contait-"+k).text("sampleaaaa"+k);
                var divSubSections = generateBlock("div","","","","");
                for(var p=0;p<cascData.layout.reportSections[k].reportSubsections.length;p++){
                    var popupCode = "";
                    var link = "";
                    var modalId = "";
                    var subS = cascData.layout.reportSections[k].reportSubsections[p];
                    if(subS.type == 'linkpopup'){
                        modalId = "myModal"+cascData.headerTabIndex+"-casc"+cascData.cascIndex+"-contait-"+k+p;
                        link = generateBlock("a",subS.name,"subTabPopupLinks","",{"data-toggle":"modal","data-target":"#"+modalId} )
//                        $(this).append(link);

                       popupCode = generatePopup(cascData.layout.reportSections[k].reportSubsections[p], modalId);
                        var divSubSection = generateBlock("div","","","","");
                        divSubSection.append(link);
                        $("#myModalList").append($compile(popupCode)($scope));
                        divSubSections.append(divSubSection);
                    }
                    else{
                        var divSubSection = generateBlock("div","","","","");
                        var divSubSectionHead = generateBlock("b",subS.name,"","","");
                        var divSubSectionContent = generateBlock("div","","","","");
                        if(subS.reportContents && subS.reportContents.length>0){
                            var reportContents = generateReportContent(subS.reportContents);
                            divSubSectionContent.append(reportContents);
                        }
                        divSubSection.append(divSubSectionHead);
                        divSubSection.append(divSubSectionContent);
                         divSubSections.append(divSubSection);
                     }
                }
                $("#tab-header-containt-"+cascData.headerTabIndex+"-casc"+cascData.cascIndex+"-contait-"+k).append($compile(divSubSections)($scope));
            }
        },0)
    };
        // used for creating element
    function generateBlock (element, innerHTML, classes, id, attributes) {
        var block = document.createElement(element);
        if(innerHTML)
            block.innerHTML = innerHTML;
        if(classes)
            block.setAttribute("class",classes);
        if(id)
            block.setAttribute("id",id);
        if(attributes){
            for(attr in attributes){
                 block.setAttribute(attr,attributes[attr]);
            }
        }
        return block;
    }
        
    function generateContent (headerTabs){
      setTimeout(function () {
        for(var i=0; i< $scope.headerTabs.length ; i++){
            console.log($scope.headerTabs[i]);
            
            for(var j=0;j< $scope.headerTabs[i].reportCascades.length ; j++){
                var cascData = {};
                cascData.HeaderTabContentID = "tab-header-containt-" + i;
                cascData.headerTabIndex = i;
                cascData.cascIndex = j;
                cascData.layout = $scope.headerTabs[i].reportCascades[j];
                if($scope.headerTabs[i].reportCascades[j].type.toLowerCase() == "tab"){
                    
                    var block = generateSubTab(cascData);
                    $("#"+"tab-header-containt-" + i).append($compile(block)($scope));
//                    debugger;
                    generateSubSectionsinSubTab(cascData);
                    console.log(cascData);
                    
                }else if($scope.headerTabs[i].reportCascades[j].type.toLowerCase() == "cascade"){
                    
                    var block = generateCascade(cascData);
                     $("#"+"tab-header-containt-" + i).append($compile(block)($scope));

                }
            }

        }
        },0)
    }
    var visited = false;
    $scope.onTabSelected = function (selectedTab) {
        if(visited == true)
            return;
        visited = true;
//        generateContent();
    }
    var generateSubTab = function (cascData) {
        console.log("inside generateSubTab"+ cascData.HeaderTabContentID)
        console.log(cascData);
//        if(subTabDetails.index== 0)
        {
            var subTabList = "headerTab"+cascData.headerTabIndex+"subTab"+cascData.cascIndex;//subTabDetails.ReportSections
            $scope[subTabList] = cascData.layout.reportSections;
            
            var hideShowSTab = "showTab"+cascData.headerTabIndex+""+cascData.cascIndex;
             $scope[hideShowSTab] = false;
            
            if(cascData.layout.isOpen == 1){
                $scope[hideShowSTab] = true;
            }
            
            var divSubTab = generateBlock("div","","md-padding tab-and-cascade layout-column","",{"layout":"column"});
            var divCascadeHeader = generateBlock("div","","md-padding animate-show cascade-header cascade-text","",{"ng-click":"hideShowSubTab($event, '"+hideShowSTab+"')","ng-hide":hideShowSTab});
            var anchorCollapse = generateBlock("a",cascData.layout.name,"","",{"href":"#"}); 
            divCascadeHeader.append(anchorCollapse);
            divSubTab.append(divCascadeHeader);
            
//        var divPanelHeading = generateBlock("div","","panel-heading","",{"ng-click":"cascadeClick($event)"});
//        var h4PanelTitle = generateBlock("h4","","panel-title","",""); 
//        var anchorCollapse = generateBlock("a",cascData.layout.Name,"","",{"data-toggle":"collapse","data-parent":"#","href":"#"+cascId}); 
        
//        h4PanelTitle.append(anchorCollapse);
//        divPanelHeading.append(h4PanelTitle);

            
            var divSubTabDetails = generateBlock("div","","animate-show casc-tab-backColor" ,"",{"ng-show":hideShowSTab,"layout":"row"});
            var divSubTabTitleVertial = generateBlock("div","","tab-title-vertial md-padding cascade-header","",{"ng-click":"hideShowSubTab($event, '"+hideShowSTab+"')","style":"float: left;"});
            var anchorCollapse = generateBlock("a",cascData.layout.name,"","",{"href":"#"}); 
            divSubTabTitleVertial.append(anchorCollapse);

            divSubTabDetails.append(divSubTabTitleVertial);
            
            
            var mdContent = generateBlock("md-content","","subtab-content","","");
            var mdTabs = generateBlock("md-tabs","","","",{"md-selected":"selectedIndex"+subTabList,"md-dynamic-height":"","md-border-bottom":"","md-swipe-content":""});
            var mdTab = generateBlock("md-tab","","","",{"ng-repeat":"tab in "+subTabList+"" , "ng-disabled":"tab.disabled","label":"{{tab.name}}"});
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
        var divCascade = generateBlock("div","","panel md-padding layout-column","",{"layout":"column"});
        var divPanelHeading = generateBlock("div","","panel-heading","",{"ng-click":"cascadeClick($event)"});
        var h4PanelTitle = generateBlock("h4","","panel-title","",""); 
        var anchorCollapse = generateBlock("a",cascData.layout.name,"","",{"data-toggle":"collapse","data-parent":"#","href":"#"+cascId}); 
        
        h4PanelTitle.append(anchorCollapse);
        divPanelHeading.append(h4PanelTitle);
        
        var divPanelCollapse = "";
        if(cascData.layout.isOpen == 1){
            divPanelCollapse = generateBlock("div","","panel-collapse collapse cascade-panel-container in",cascId,""); 
        }else{
            divPanelCollapse = generateBlock("div","","panel-collapse collapse cascade-panel-container",cascId,""); 
        }

//        var divPanelBody = generateBlock("div","They have passed like rain on the mountain, like a wind in the meadow; The days have gone down in the West behind the hills into shadow.They have passed like rain on the mountain, like a wind in the meadow; The days have gone down in the West behind the hills into shadow.They have passed like rain on the mountain, like a wind in the meadow; The days have gone down in the West behind the hills into shadow","panel-body","",""); 

        var divPanelBody = generateBlock("div","","padding-10px-15px"); 
        
//        divPanelBody.append(divPanelBodyRow);
//        divPanelBody.innerHTML = ` <div class="row">
//
//
//        <div class="col-xs-6" style="background-color:lightcyan;">
//		  <div class="row">
//			        <div class="col-sm-12 col-md-6" style="background-color:lightcyan;">
//                    	label1
//		        	</div>	
//			        <div class="col-sm-12 col-md-6" style="background-color:lightcyan;">
//                    	val1
//		        	</div>	
//        	</div>	
//        </div>
//        <div class="col-xs-6" style="background-color:lightcyan;">
//		  <div class="row">
//			        <div class="col-sm-12 col-md-6" style="background-color:lightcyan;">
//                    	label1
//		        	</div>	
//			        <div class="col-sm-12 col-md-6" style="background-color:lightcyan;">
//                    	val1
//		        	</div>	
//        	</div>	
//        </div>
//        <div class="col-xs-6" style="background-color:lightcyan;">
//		  <div class="row">
//			        <div class="col-sm-12 col-md-6" style="background-color:lightcyan;">
//                    	label1
//		        	</div>	
//			        <div class="col-sm-12 col-md-6" style="background-color:lightcyan;">
//                    	val1
//		        	</div>	
//        	</div>	
//        </div>
//        <div class="col-xs-6" style="background-color:lightcyan;">
//		  <div class="row">
//			        <div class="col-sm-12 col-md-6" style="background-color:lightcyan;">
//                    	label1
//		        	</div>	
//			        <div class="col-sm-12 col-md-6" style="background-color:lightcyan;">
//                    	val1
//		        	</div>	
//        	</div>	
//        </div>
//
//
//</div>
//`;
        for(var k=0;k<cascData.layout.reportSections.length; k++){
            var reportSection = cascData.layout.reportSections[k];
            var divReportSection = generateBlock("div","","padding-8px-12px"); 
            console.log(reportSection)
            if(reportSection.name){
                //generate header
                var reportSectionHeader = generateBlock("div",reportSection.name,"border-bottom","","");
                divReportSection.append(reportSectionHeader);
            }
            if(reportSection.reportSubsections && reportSection.reportSubsections.length>0){
                for(var t=0;t< reportSection.reportSubsections.length; t++){
                    var rSubsection = reportSection.reportSubsections[t];
                    var divRSubsection = generateBlock("div","","padding-6px-9px");
                    
                    if(rSubsection.name){
                        //generate header
                        var rSubsectionHeader = generateBlock("div",rSubsection.name,"border-bottom","","");
                        divRSubsection.append(rSubsectionHeader);
                    }
                    if(rSubsection.reportContents && rSubsection.reportContents.length>0){
                        var reportContent= generateReportContent(rSubsection.reportContents)
                        divRSubsection.append(reportContent);
                        divReportSection.append(divRSubsection);
                        divPanelBody.append(divReportSection);
                    }
                }
            }
        }
        
        
        divPanelCollapse.append(divPanelBody);
        divCascade.append(divPanelHeading);
        divCascade.append(divPanelCollapse);
        
        console.log(divCascade);
        return divCascade;

    };
        

      selected = null,
      previous = null;
//    $scope.$watch('selectedHeaderTab', function(current, old){
//      previous = selected;
//      selected = headerTabs[current];
//      if ( old + 1 && (old != current)) $log.debug('Goodbye ' + previous.Name + '!');
//      if ( current + 1 )                $log.debug('Hello ' + selected.Name + '!');
//    });
	
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
