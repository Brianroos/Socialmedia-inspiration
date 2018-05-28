// FUNC: Save the specific post and remove it from the container/list
function savePost(post) {
  $.each(post, function(key, val) {

    // When clicked on specific post, add class for handling
    $(val).on('click', function(event) {
      event.preventDefault();
      $(this).parent().addClass('saved');
    });
  });
}
