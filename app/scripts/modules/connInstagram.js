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
