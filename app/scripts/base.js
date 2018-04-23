$(function() {
  var arr = [];
  var ListToFilter = $('.inspiration-list .inspiration-list__filter');
  var listTitle = $('.inspiration-list .inspiration-list__title');
  var listMessage = $('.inspiration-list .inspiration-list__message');
  var listToProcess = $('.inspiration-list .inspiration-list__list');

  updateDatetime();

  // connFacebook();
  connTwitter(arr, '%23journalistiek', 10);
  connInstagram(arr, 'journalistiek');

  processData(arr, listTitle, listMessage, listToProcess, 20);
  filterData(arr, ListToFilter, listMessage, listToProcess);
});
