// FUNC: Show preview when an image is uploaded within the skeleton
function showPreview(input) {
  var imageContainer = $(input).closest('.skeleton__image');
  var previewContainer = $(input).nextAll('.skeleton__preview');

  // Check for image
  if(input.files && input.files[0]) {
    var reader = new FileReader();

    // When reader is loaded
    reader.onload = function(event) {
      imageContainer.addClass('image-added');
      previewContainer.html('<img src="'+ event.target.result +'" alt="Preview">');
    }

    reader.readAsDataURL(input.files[0]);
  }
}
