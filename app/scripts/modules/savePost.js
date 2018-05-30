// FUNC: Save the specific post and divide it from the container/list
function savePost(post) {
  $.each(post, function(key, val) {

    // When clicked on specific post, add/remove class for handling
    $(val).on('click', function(event) {
      event.preventDefault();
      $(this).parent().toggleClass('saved');
    });
  });
}
