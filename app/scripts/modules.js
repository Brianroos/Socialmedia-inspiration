// // FUNC: Connect with the Facebook API and fetch data by keyword(s)
// function connFacebook() {
//   var accessToken = '&access_token='; // Key to add
//   var keywordToSearch = 'journalistiek';
//   var limit = 10;
//
//   $.ajax({type: 'GET', url: 'https://graph.facebook.com/v2.12/search?q='+ keywordToSearch +'&type=page&limit='+ limit +'' + accessToken, success: function(res) {
//     $.each(res.data, function(key, val) {
//       $.ajax({type: 'GET', url: 'https://graph.facebook.com/v2.12/'+ val.id +'?fields=id,name,description,mission,about,website,verification_status,category_list,picture.type(large),fan_count,location' + accessToken, success: function(res) {
//         // Code to add
//       }});
//     });
//   }});
// }

// FUNC: Connect with the Twitter API and fetch data by hashtag(s)
function connTwitter() {
  var keywordToSearch = '%23journalistiek';
  var lang = 'nl';
  var limit = 10;

  $.ajax({type: 'POST', url: 'twitter_data.php', data: {
    // Keys to add
    'count': 5,
    'url': 'search/tweets.json?q='+ keywordToSearch +'&lang='+ lang +'&result_type=mixed&count='+ limit +''
  }, success: function(res) {
    $.each(res.statuses, function(key, val) {
      console.log(val.user.name);
      console.log(val.user.profile_image_url_https);
      console.log(val.user.verified);
      console.log(val.text);
      console.log(val.favorite_count);
      console.log(val.retweet_count);
    });
  }});
}
