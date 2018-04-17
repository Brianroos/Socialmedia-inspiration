// FUNC: Process the data collected from the API's
function processData(array, listToProcess, minimalLikes) {
  listToProcess.html('<p>Even geduld, jouw inspiratie wordt verzameld..</p>');

  $(document).ajaxStop(function() {
    listToProcess.html('<ul></ul>');

    // Sort the data on total amount of likes/favorites/retweets
    array.sort(function(a, b) {
      return b.totalCount - a.totalCount;
    });

    // Print the data into the list
    $.each(array, function(key, val) {
      // Check for given minimal likes for post/tweet to show
      if(val.totalCount > minimalLikes) {
        // Check the API type for dynamic content
        if(val.type == 'twitter') {
          var verified = '';
          if(val.verified == true) {
            verified = '<span></span>';
          }

          // Output Twitter
          var item = '<li class="item twitter"><a href="#" class="save"></a><div class="top">'+
            '<div class="intro"><figure><img src="'+ val.profileImage +'" alt="'+ val.username +'"></figure><p>'+ val.username + verified +'</p></div>'+
            '<div class="details"><div class="retweets">'+ val.retweetCount +'</div><div class="favorites">'+ val.favoriteCount +'</div></div>'+
            '</div><div class="message"><p>'+ val.text +'</p></div></li>';
        } else if(val.type == 'instagram') {
          // Output Instagram
          var item = '<li class="item instagram"><a href="#" class="save"></a><div class="top">'+
            '<div class="intro"><figure></figure><p>'+ val.hashtag +'</p></div>'+
            '<div class="details"><div class="comments">'+ val.commentCount +'</div><div class="likes">'+ val.likeCount +'</div></div>'+
            '</div><div class="message"><p>'+ val.text +'</p><figure><img src="'+ val.image +'" alt="'+ val.hashtag +'"></figure></div></li>';
        }

        listToProcess.find('ul').append(item);
      }
    });
  });
}