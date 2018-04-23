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

// FUNC: Connect with the Instagram API and fetch data by hashtag(s)
function connInstagram(array, keywordToSearch) {
  $.getJSON('https://allorigins.me/get?url=' + encodeURIComponent('https://instagram.com/') + 'explore/tags/'+ keywordToSearch +'/', function(res) {
    var posts = JSON.parse(res.contents.split('window._sharedData = ')[1].split('\;\<\/script>')[0]).entry_data.TagPage[0].graphql.hashtag;
    var hashtag = posts.name;

    $.each(posts.edge_hashtag_to_top_posts.edges, function(key, val) {
      var post = {
        type: 'instagram',
        hashtag: hashtag,
        image: val.node.display_url,
        text: val.node.edge_media_to_caption.edges[0].node.text,
        likeCount: val.node.edge_media_preview_like.count,
        commentCount: val.node.edge_media_to_comment.count,
        totalCount: (val.node.edge_media_preview_like.count + val.node.edge_media_to_comment.count)
      };

      array.push(post);
    });
  });
}

// FUNC: Connect with the Twitter API and fetch data by hashtag(s)
function connTwitter(array, keywordToSearch, limit) {
  $.ajax({type: 'POST', url: 'twitter_data.php', data: {
    // Keys to add
    'url': 'search/tweets.json?q='+ keywordToSearch +'&result_type=mixed&count='+ limit +''
  }, success: function(res) {
    $.each(res.statuses, function(key, val) {
      var tweet = {
        type: 'twitter',
        keyword: keywordToSearch,
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

// FUNC: Filter the data (collected from the API's) when filtering is used
function filterData(array, ListToFilter, listMessage, listToProcess) {
  var options = ListToFilter.find('input[type="checkbox"]');
  var defaultOption;
  var selectedOptions = [];

  // Pause until all the data is collected
  $(document).ajaxStop(function() {
    ListToFilter.find('form').removeClass('hide');

    $.each(options, function(key, val) {
      if(val.id == 'allekanalen') {
        defaultOption = val;
        selectedOptions.push(defaultOption);
      } else {
        $(val).attr('name', 'platform');
      }

      $(val).on('change', updateFilter);
    });

    updateList();
  });

  // FUNC: Updates filter and selection of posts/tweets after every usage of the filter
  function updateFilter(target) {
    // Check for no duplicates in the selectedOptions array
    var index = selectedOptions.indexOf($(target)[0].target);
    if(index !== -1) {
      selectedOptions.splice(index, 1);
    } else {
      selectedOptions.push($(target)[0].target);
    }

    // Check for defaultOption to be included in the selectedOptions array
    if(selectedOptions.includes(defaultOption)) {
      listMessage.addClass('hide');
      listToProcess.removeClass('hide');

      // Check for filtering when clicked on one of the platforms
      if($(target)[0].target.name && $(target)[0].target.name.length > 0) {
        selectedOptions.splice(selectedOptions.indexOf(defaultOption), 1);
        $(defaultOption).prop('checked', false);
      } else {
        selectedOptions = [];
        selectedOptions.push(defaultOption);

        $.each(options, function(key, val) {
          $(val).prop('checked', false);
        });
        $(defaultOption).prop('checked', true);
      }
    } else {
      listMessage.addClass('hide');
      listToProcess.removeClass('hide');
    }

    updateList();
  }

  // FUNC: Updates selection of posts/tweets after every usage of the filter
  function updateList() {
    // Remove/reset all options as class on listToProcess
    $.each(options, function(key, val) {
      listToProcess.removeClass(val.id);
    });

    // Set all of the selectedOptions as class on listToProcess
    $.each(selectedOptions, function(key, val) {
      listToProcess.addClass(val.id);
      // Rest of the function contains CSS
    });

    // Check for every listitem if they are visible
    var countBlock = 0;
    $.each(listToProcess.find('li'), function(key, val) {
      if($(val).css('display') == 'block') {
        countBlock++;
      }
    });

    // Reset classes
    listMessage.addClass('hide');
    listToProcess.removeClass('hide');

    // If none, show message to inform
    if(listMessage.hasClass('hide') && countBlock == 0) {
      listMessage.removeClass('hide').html('<p>Selecteer een (extra) optie aan de linkerkant om uw inspiratie weer te geven.</p>');
      listToProcess.addClass('hide');
    }
  }
}

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
  });
}

// FUNC: Show the current date and time
function updateDatetime() {
  var div = $('.navigation .datetime');

  var d = new Date();
  var days = ['zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag'];
  var months = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'];
  var time = checkZero(d.getHours()) + ':' + checkZero(d.getMinutes());

  var date = [d.getDate(), months[d.getMonth()], d.getFullYear()].join(' ');
  date = [days[d.getDay()], date].join(', ');
  div.html('<p>'+ [date, time].join(' / ') +'</p>');

  // Repeat function every second
  setTimeout(updateDatetime, 1000);

  // FUNC: Check if current digit is lower than 10, if so add a zero
  function checkZero(d) {
    if(d < 10) {
      d = '0' + d;
    }

    return d;
  }
}
