let $searchButton = $("#search-button"),
    $itemPool = $("#item-pool"),
    $selectedTopic = $("#select-topic"),
    $followedChannels = $("#followed-channels"),
    $followedListRow = $("#followed-list-row");

var channels=["freecodecamp","ESL_SC2", "OgamingSC2", "cretetion", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas","coscu"];

$('document').ready(function(){
  
  //FOLLOWED CHANNELS FILL
  displayFollowedChannels(channels);
  
  //----------
  //  SEARCH
  //---------
  $searchButton.on("click",(evt)=>{
    
    $itemPool.empty();
    
    $.ajax({
 type: 'GET',
 url: makeURL($selectedTopic.val(),"","top?limit=50"),
 headers: {
   'Client-ID': 'tpem820oc0cr9gkiv60yb43d6raur9',
   'Accept':'application/vnd.twitchtv.v5+json'
 },
 success: function(data) {
   switch($selectedTopic.val()){
     case 'games':
       displayGames(data);
       break;
     case 'communities':
       displayCommunities(data);
       break;
     default:
       console.log("asd");
   }
 }
});
    
  });//SEARCH
  
});//DOCUMMENT READY

function makeURL(type,name,params){
  return "https://api.twitch.tv/kraken/"+type+ "/" +name+params;
}

function displayGames(data){
  data.top.forEach((game)=>{
     var container = $('<div class="col-md-3 game-div"></div>');
     var link = $("<a target=\"_blank\" href=\"https://www.twitch.tv/directory/game/"+game.game.name+"\"></a>");
     var img = $("<img class=\"img-thumbnail\" src="+game.game.box.medium+">");
     var name = $("<p class=\"lead\">"+game.game.name+"</p>");
     var viewers = $("<p class=\"small\">"+game.viewers+" viewers</p>");
     link.append(img);
     container.append(link);
     container.append(name);
     container.append(viewers);
     $itemPool.append(container);
   });
}

function displayCommunities(data){
  data.communities.forEach((community)=>{
     var container = $('<div class="col-md-3 game-div"></div>');
     var link = $("<a target=\"_blank\" href=\"https://www.twitch.tv/communities/"+community.name+"\"></a>");
     var img = $("<img class=\"img-thumbnail\" src="+community.avatar_image_url+">");
     var name = $("<p class=\"lead\">"+community.name+"</p>");
     var viewers = $("<p class=\"small\">"+community.viewers+" viewers</p>");
     link.append(img);
     container.append(link);
     container.append(name);
     container.append(viewers);
     $itemPool.append(container);
  });
}


function displayFollowedChannels(channels){
  channels.forEach((channel)=>{
    
    var url = "https://wind-bow.gomix.me/twitch-api/streams/"+channel;
    
    
    $.getJSON({
    url:url,
      dataType:"jsonp"
    },function(data){
      
      var url = "https://wind-bow.gomix.me/twitch-api/channels/"+channel;
      
      var isOnline = data.stream;
      
       $.getJSON({
        url:url,
        dataType:"jsonp"
      },function(data){
         
        var status;
        var currentActivity;
        
        if(isOnline){
          status="Online";
          currentActivity=data.status;
        }else{
          status="Offline";
          currentActivity = "";
        }
         
        var iconsrc = data.logo;
        var channelname = data.display_name;
        var channelURL = data.url;
         
        var channelActivity = $("<p class=\"channel-activity\">"+currentActivity+"</p>")
        var link = $("<a target=\"_blank\" href=\""+channelURL+"\">"+channelname+"</a>");
        var icon = ("<img class=\"icon\" src=\""+iconsrc+"\">");
        var icon_col = $("<div class=\"col-md-3 channel-icon\"></div>");
        var name_col = $("<div class=\"col-md-6 channel-name\"></div>");
        var status_col = $("<div class=\"col-md-3 channel-status\"><strong>"+status+"</strong> <i class=\"fas fa-circle\"></i></div>");
         
        if(isOnline){
          status_col.addClass("online");
        }else{
          status_col.addClass("offline");
        }
         
        name_col.append(link);
        name_col.append(channelActivity);
        icon_col.append(icon);
        $followedListRow.append(icon_col,name_col,status_col);
      }) 
      
    })
  })
}