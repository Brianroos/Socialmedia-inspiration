$(function() {
  var arr = [];
  var listToProcess = $('.inspiration-list .inspiration-list__list');

  // connFacebook();
  connTwitter(arr, '%23journalistiek', 10);
  connInstagram(arr, 'journalistiek');

  processData(arr, listToProcess, 20);
});
