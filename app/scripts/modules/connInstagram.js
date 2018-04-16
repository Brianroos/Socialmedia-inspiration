// FUNC: Connect with the Instagram API and fetch data by hashtag(s)
function connInstagram() {
  var keywordToSearch = 'journalistiek';

  $.getJSON('https://allorigins.me/get?url=' + encodeURIComponent('https://instagram.com/') + 'explore/tags/'+ keywordToSearch +'/', function(res) {
    var posts = JSON.parse(res.contents.split('window._sharedData = ')[1].split('\;\<\/script>')[0]).entry_data.TagPage[0].graphql.hashtag;
    var hashtag = posts.name;

    console.log('hashtag: ' + hashtag);
    $.each(posts.edge_hashtag_to_top_posts.edges, function(key, val) {
      console.log(val.node.display_url);
      console.log(val.node.edge_media_to_caption.edges[0].node.text);
      console.log(val.node.edge_media_preview_like.count);
      console.log(val.node.edge_media_to_comment.count);
    });
  });
}
