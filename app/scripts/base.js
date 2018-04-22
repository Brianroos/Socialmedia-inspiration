$(function() {
  var arr = [];
  var listMessage = $('.inspiration-list .inspiration-list__message');
  var listToProcess = $('.inspiration-list .inspiration-list__list');
  var ListToFilter = $('.inspiration-list .inspiration-list__filter');

  updateDatetime();

  // connFacebook();
  connTwitter(arr, '%23journalistiek', 10);
  connInstagram(arr, 'journalistiek');

  processData(arr, listMessage, listToProcess, 20);
  filterData(arr, ListToFilter, listMessage, listToProcess);
});
