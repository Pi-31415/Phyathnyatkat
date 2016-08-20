var app = angular.module('myApp', ['ngMaterial']);
app.factory('wikiService', function($http) {
    var wikiService = {
        get: function(country,length) {
            return $http.jsonp('https://en.wikipedia.org/w/api.php?action=query&titles='+country+'&prop=extracts&exchars='+length+'&rvprop=content&format=json&callback=JSON_CALLBACK');
            }
        };
      return wikiService;
    });
app.factory('wikiPicService', function($http) {
        var wikiPicService = {
            get: function(country,length) {
                return $http.jsonp("https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&titles="+country+"&pithumbsize="+length+"&format=json&callback=JSON_CALLBACK");
                }
            };
          return wikiPicService;
        });
app.controller('MainController', function($scope, wikiService,wikiPicService) {
    $scope.assign = {
      head : "",
      name : "",
      class : "",
      subject : "",
      date : "",
      picture : true,
      info : true
    };
    $scope.processtitle = "Search for a topic to start processing";
    $scope.param = "";
    $scope.results = [];
    $scope.length = 500;
    $scope.longlength = 500;
    $scope.individualstrs = 0;
    $scope.status = "";
    $scope.imgurl = [];
    $scope.imgurlo = [];
    $scope.picsize = 100;
    $scope.picsizeo = 200;
    //Search Functions
    wikiService.get($scope.param,$scope.length).then(function(data){
      $scope.results=data.data;
    });
    wikiPicService.get($scope.param,$scope.picsize).then(function(data){
      $scope.imgurl=data.data;
    });
    $scope.getit = function(tosearch){
      $scope.status = "Result for \""+tosearch+"\"";
      $scope.processtitle = "Your Assignment Information for \""+tosearch+"\"";
      tosearch = tosearch.replace("(", " (");
      tosearch = tosearch.replace("  (", " (");
      $scope.param = tosearch;
      wikiService.get($scope.param,$scope.length).then(function(data){
        $scope.results=data.data;
      });
      wikiPicService.get($scope.param,$scope.picsize).then(function(data){
        $scope.imgurl=data.data;
      });
      wikiPicService.get($scope.param,$scope.picsizeo).then(function(data){
        $scope.imgurlo=data.data;
      });
    };
    $scope.more = function(){
      $scope.longlength += 500;
      wikiService.get($scope.param,$scope.longlength).then(function(data){
        $scope.results=data.data;
      });
    };
    $scope.clearit = function(){
      $scope.status = "";
      $scope.param="";
      $scope.results="";
    };
    //Process Functions
    $scope.addline = function(){
      $scope.longlength += 500;
      wikiService.get($scope.param,$scope.longlength).then(function(data){
        $scope.results=data.data;
      });
    };
    $scope.remline = function(){
      $scope.longlength -= 500;
      wikiService.get($scope.param,$scope.longlength).then(function(data){
        $scope.results=data.data;
      });
    };

});
app.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('green');
});

app.filter('stripHTML',function(){
  return function(str){
    str=str.replace("...", " ");
    str=str.replace("&#160;", " ");
    str=str.replace(/&#160;/g," ");
    str=str.replace(/<br>/gi, "\n");
    str=str.replace(/<span>/gi, "\n");
    str=str.replace(/<strong>/gi, "\n");
    str=str.replace(/<i>/gi, "\n");
    str=str.replace(/<p>/gi, "\n\n");
    str=str.replace(/<b>/gi, "\n");
    str=str.replace(/<p.*>/gi, "\n");
    str=str.replace(/<a.*href="(.*?)".*>(.*?)<\/a>/gi, " $2 (Link->$1) ");
    str=str.replace(/<(?:.|\s)*?>/g, "");

    var len = str.lastIndexOf(".");

    if(str == "..."){
      str = "No results found";
    }
    if(str.indexOf("may refer to:") >-1 || str.indexOf("refers to:")> -1){
      str = "Sorry but this word has lots of meanings. Please search again by putting your specification in brackets. For example : Orange (colour), Orange (fruit). If it is a person, search with his/her full name or with job. Example : Search \"John McCarthy (computer scientist)\" instead of \"John McCarthy\" only.";
    }
    else if(str.indexOf("different spelling") >-1){
      str = "Please try again with another spelling. Example : type \"colour\" instead of \"color\"";
    }
    if(str.indexOf("method of capitalisation") >-1){
      str = "Please try again by avoiding double capitalisation. Example : type \"Hydrochloric acid\" instead of \"Hydrochloric Acid\"";
    }
    var laststr = str.substring(0, str.lastIndexOf(".")+1);

    return laststr;
  };
});

app.filter('onelineonly',function(){
  return function(str){
    str=str.replace("...", " ");
    str=str.replace("&#160;", " ");
    str=str.replace(/&#160;/g," ");
    str=str.replace(/<br>/gi, " ");
    str=str.replace(/<span>/gi, " ");
    str=str.replace(/<strong>/gi, " ");
    str=str.replace(/<i>/gi, " ");
    str=str.replace(/<p>/gi, " ");
    str=str.replace(/<b>/gi, " ");
    str=str.replace(/<p.*>/gi, " ");
    str=str.replace(/<a.*href="(.*?)".*>(.*?)<\/a>/gi, " $2 (Link->$1) ");
    str=str.replace(/<(?:.|\s)*?>/g, "");
    str=str.replace(".", "\n\n");

    var laststr = str.substring(0, str.lastIndexOf(".")+1);

    return laststr;
  };
});
