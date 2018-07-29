var app = angular.module('myApp', []);
app.controller('customersCtrl', function($scope, $http) {

	$scope.activityList=[];

	$scope.addActivity = function () {
		$scope.activityList.push({"restServices":[]})
	};

	var restServCnrl = function(parentPath,parentPathArray,jsonPath,jsonPathArray){
	this.cascadeName="",
	this.url = "",
	this.methodType = "GET",
	this.queryParameters = "",
	this.locateQryParameters = "",
	this.displayParameters = "",
	this.childServices = [],
	this.jsonPath = jsonPath,
	this.jsonPathArray = jsonPathArray,
	this.parentPath = parentPath;
	this.parentPathArray = parentPathArray;
	};

	$scope.restServices = [];

	$scope.addRestService = function () {
		/* var family = jsonQ(jsonObj),
			path = ["fathers", 0, "daughters", 0, "name"];
		 console.log(jsonObj.fathers[0].daughters[0].name);
		family.setPathValue(path, "Julia");
		 console.log(jsonObj.fathers[0].daughters[0].name);
		*/
		$scope.restServices.push(new restServCnrl("restServices",[]));
	};
	$scope.removeService = function (restService, index, event) {
		console.log(restService);
		console.log(index)
		$scope.restServices.splice(index,1);
		
	}
	$scope.removeChildService = function (restService, index, event) {
		console.log(restService);
		console.log(index)
		console.log(index)
		console.log(eval("$scope."+restService.parentPath));
		var childServiceArray = eval("$scope."+restService.parentPath);
		childServiceArray.splice(index,1);
		
		debugger;
	} 

	$scope.addChildRestService = function (event,service,index) {
		console.log(event,service,index);
		console.log($scope);
		
		childServicePath = "$scope."+service.parentPath+"["+index+"].childServices";
		var newParentPath = service.parentPath+"["+index+"].childServices";
		var newParentPathArray = angular.copy(service.parentPathArray);
		newParentPathArray.push(index);
		newParentPathArray.push("childServices");
		var cServices = eval(childServicePath);
		cServices.push(new restServCnrl(newParentPath,newParentPathArray));
/*		var path = newParentPathArray;
		jsonQ.setPathValue($scope,path, cServices);
		console.log($scope);
		console.log($scope.restServices);
*///		$scope.data = angular.copy(dataT);
	};
	
	$scope.complete = function () {
				console.log($scope.restServices);
	}
});


