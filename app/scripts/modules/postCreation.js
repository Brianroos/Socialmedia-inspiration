// FUNC: Create a skeleton as a result of the chosen options within the filter
function postCreation() {
  console.log('postCreation func!');

  var ListToFilter = $('.creation-block__filter')
  var confirmBtn = $('.creation-block .confirm.btn');
  var inputs = ListToFilter.find('form input');
  var postOptions = [];

  // Handlers
  inputs.on('change', updateFilter);
  confirmBtn.on('click', combineData);

  // On change ..
  function updateFilter() {
    postOptions = [];
    var countKanalen = 0;
    var countBerichttypes = 0;

    $.each($('input:checked'), function(key, val) {
      if(val.type == 'checkbox') {
        countKanalen++;

        postOptions.push({
          'type': 'kanaal',
          'value': val.value
        });
      } else {
        countBerichttypes++;

        postOptions.push({
          'type': 'berichttype',
          'value': val.value
        });
      }
    });

    // Enable/disable confirmBtn
    if(countKanalen > 0 && countBerichttypes > 0) {
      confirmBtn.removeClass('disabled');
    } else {
      confirmBtn.addClass('disabled');
    }
  }

  // On click ..
  function combineData() {
    var postType = $.grep(postOptions, function(val, key) {
      return val.type != 'berichttype';
    }, true)[0].value;

    $.each(postOptions, function(key, val) {
      if(val.type !== 'berichttype') {
        // Creatie van het geraamte aan de hand van de gekozen optie(s)
      }
    });
  }
}
