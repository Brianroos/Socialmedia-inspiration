$(function() {
  var body = $('body');

  updateDatetime();

  // Inspiration page
  if(body.hasClass('inspiration')) {
    var inspirationKeywords = ['journalism', 'futureofjournalism', 'digitalstory', 'digitalstorytelling', 'hackathon'];

    var inspirationCollected = [];
    var inspirationFilter = $('.inspiration-list .inspiration-list__filter');
    var inspirationTitle = $('.inspiration-list .inspiration-list__title');
    var inspirationMessage = $('.inspiration-list .inspiration-list__message');
    var inspirationToProcess = $('.inspiration-list .inspiration-list__list');

    // Search through social media
    $.each(inspirationKeywords, function(key, val) {
      // connFacebook();
      connTwitter(inspirationCollected, '%23'+ val, 15);
      connInstagram(inspirationCollected, val);
    });

    processData(inspirationCollected, inspirationTitle, inspirationMessage, inspirationToProcess, 100);
    filterData(inspirationCollected, inspirationFilter, inspirationMessage, inspirationToProcess);
  }

  // Creation page
  else if(body.hasClass('creation')) {
    var creationBreadcrumbs = $('.breadcrumbs .breadcrumbs__phases ul');
    var creationFilter = $('.creation-block .creation-block__filter');
    var creationMessage = $('.creation-block .creation-block__message');
    var creationToCreate = $('.creation-block .creation-block__list');

    postCreation(creationBreadcrumbs, creationFilter, creationMessage, creationToCreate);
  }
});
