// FUNC: Process the data collected from the API's
function processData(array, listTitle, listMessage, listToProcess, minimalLikes) {
  var searchedKeywords = [];

  listTitle.addClass('hide');
  listMessage.removeClass('hide').html('<p><b>Even geduld</b>, uw inspiratie wordt verzameld...</p>');
  listToProcess.addClass('hide');

  // Pause until all the data is collected
  $(document).ajaxStop(function() {
    listTitle.removeClass('hide');
    listMessage.addClass('hide');
    listToProcess.removeClass('hide').html('<ul></ul>');

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

          searchedKeywords.push(val.keyword.split('%23')[1]);

          // Output Twitter
          var item = '<li class="item twitter"><a href="#" class="save"></a><div class="top">'+
            '<div class="intro"><figure><img src="'+ val.profileImage +'" alt="'+ val.username +'"></figure><p>'+ val.username + verified +'</p></div>'+
            '<div class="details"><div class="retweets">'+ val.retweetCount +'</div><div class="favorites">'+ val.favoriteCount +'</div></div>'+
            '</div><div class="message"><p>'+ val.text +'</p></div></li>';
        } else if(val.type == 'instagram') {
          searchedKeywords.push(val.hashtag);

          // Output Instagram
          var item = '<li class="item instagram"><a href="#" class="save"></a><div class="top">'+
            '<div class="intro"><figure></figure><p>'+ val.hashtag +'</p></div>'+
            '<div class="details"><div class="comments">'+ val.commentCount +'</div><div class="likes">'+ val.likeCount +'</div></div>'+
            '</div><div class="message"><p>'+ val.text +'</p><figure><img src="'+ val.image +'" alt="'+ val.hashtag +'"></figure></div></li>';
        }

        listToProcess.find('ul').append(item);
      }
    });

    // Collect al the searched keywords and check for duplicates
    var uniqueSearchedKeywords = [];
    $.each(searchedKeywords, function(key, val) {
      if($.inArray(val, uniqueSearchedKeywords) === -1) {
        uniqueSearchedKeywords.push(val);
      }
    });
    // Output each searched keyword
    $.each(uniqueSearchedKeywords, function(key, val) {
      listTitle.find('h3').append('<span>'+ val +'</span>');
    });

    // For every post the "save" option for later purposes
    savePost(listToProcess.find('.item .save'));
  });
}
