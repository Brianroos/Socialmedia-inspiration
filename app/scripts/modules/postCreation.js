// FUNC: Create a skeleton as a result of the chosen options within the filter
function postCreation(breadcrumbs, ListToFilter, listMessage, listToCreate) {
  var inputs = ListToFilter.find('form input');
  var postOptions = [];

  // Clickhandler to close/open each filtertab
  ListToFilter.find('ul li span').on('click', function() {
    $(this).parent().toggleClass('opened');
  });

  // ChangeHandler when filter is used/changed
  inputs.on('change', updateFilter);

  // FUNC: Updates filter and selection of skeletons after every usage of the filter
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

    // Check/uncheck a specific breadcrumb
    if(countKanalen > 0) {
      changeBreadcrumb('Kanalen', 1);
    } else {
      changeBreadcrumb('Kanalen', 0);
    }
    if(countBerichttypes > 0) {
      changeBreadcrumb('Type post', 1);
    } else {
      changeBreadcrumb('Type post', 0);
    }

    // Check if minimal amount of required inputs is selected, if so create the skeleton(s)
    if(countKanalen > 0 && countBerichttypes > 0) {
      listMessage.addClass('hide');

      createSkeleton();
    } else {
      listMessage.removeClass('hide');
    }
  }

  // FUNC: Change/check the state of the specific breadcrumb after every usage of the filter
  function changeBreadcrumb(string, boolean) {
    $.each(breadcrumbs.find('li:contains('+ string +')'), function(key, val) {
      if(boolean != 0) {
        $(val).addClass('done');
      } else {
        $(val).removeClass('done');
      }
    });
  }

  // FUNC: Creates a skeleton to fill in on basis of the selected (required) inputs
  function createSkeleton() {
  }
}
