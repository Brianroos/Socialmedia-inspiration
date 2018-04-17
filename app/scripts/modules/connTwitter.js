// FUNC: Connect with the Twitter API and fetch data by hashtag(s)
function connTwitter(array, keywordToSearch, limit) {
  $.ajax({type: 'POST', url: 'twitter_data.php', data: {
    // Keys to add
    'url': 'search/tweets.json?q='+ keywordToSearch +'&result_type=mixed&count='+ limit +''
  }, success: function(res) {
    $.each(res.statuses, function(key, val) {
      var tweet = {
        type: 'twitter',
        username: val.user.name,
        profileImage: val.user.profile_image_url_https,
        verified: val.user.verified,
        text: val.text,
        favoriteCount: val.favorite_count,
        retweetCount: val.retweet_count,
        totalCount: (val.favorite_count + val.retweet_count)
      };

      array.push(tweet);
    });
  }});
}
