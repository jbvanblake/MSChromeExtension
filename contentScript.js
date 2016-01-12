
var port = chrome.runtime.connect();    

function locateForks(studentIds){
  console.log("locateForks");
  var missingRepos = [];
  var foundRepos = {};

  for(var i in studentIds){
    var relevantLinks = $("a:contains('"+studentIds[i]+"')");
    if(relevantLinks.length === 0){
      missingRepos.push(studentIds[i]);
    }
    else if (relevantLinks.length === 1){
      foundRepos[studentIds[i]] = window.location.origin + relevantLinks.attr("href");
    }
  }  
  return {missingRepos:missingRepos, foundRepos:foundRepos};                                               
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.type == "START_SEARCH")
      var gitIds = JSON.parse(request.ids);
      var forks = locateForks(gitIds);
      sendResponse({result: JSON.stringify(forks)});
  });