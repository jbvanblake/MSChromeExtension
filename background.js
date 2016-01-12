var config = MSChromeExtensionConfig();
var cohort = config.cohort;
var studentIds = config.studentIds;
//Allows for redirects to happen in browser from Extension.
window.addEventListener('click',function(e){
  if(e.target.href!==undefined){
    chrome.tabs.create({url:e.target.href})
  }
})

chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  chrome.tabs.sendMessage(tabs[0].id, {type: "START_SEARCH", ids:JSON.stringify(studentIds)}, function(response) {
    if(response !== undefined){
      var returnObj = JSON.parse(response.result);
      //Array of missing 
      var missingRepos = returnObj.missingRepos;
      //Object of {-username-:-github repo link-}
      var foundRepoLinks = returnObj.foundRepos;
    }

    //Plugin finds no repos, or on the wrong page.
    if(response === undefined || missingRepos.length === studentIds.length) {  
      $(".invalid-location-message-container").show();
      return;
    }

    //fill missing repos container
    if(missingRepos.length > 0){
      $(".message-container .missing-repos").empty();
      for(var i in missingRepos){
        $(".message-container .missing-repos").append("<li class='missing-repo-label'>" + missingRepos[i] + "</li>");
      }
    }
    if(missingRepos.length === 0){
      $(".no-missing-repos-container").show();
    }

    //Fill found container with links to existing repos.
    $(".message-container .accounted-repos").empty();
    for(var id in foundRepoLinks){
      $(".message-container .accounted-repos").append("<li class='found-repo-label'><a href='" + foundRepoLinks[id] + "'>" + id + "</a></li>");
    } 

    //show Container
    $(".message-container").show();
  });
});
//click event.
$(document).ready(function(){
  $(".show-found-repos-label").click(function (){
    if($(".found-repos-container:visible").length > 0){
      $(".found-repos-container").slideUp();
    }
    else{
       $(".found-repos-container").slideDown();
    }
  });
});
