// FUNC: Filter the data (collected from the API's) when filtering is used
function filterData(array, ListToFilter, listMessage, listToProcess) {
  var options = ListToFilter.find('input[type="checkbox"]');
  var defaultOption;
  var selectedOptions = [];

  // Pause until all the data is collected
  $(document).ajaxStop(function() {
    ListToFilter.find('form').removeClass('hide');

    $.each(options, function(key, val) {
      if(val.id == 'allekanalen') {
        defaultOption = val;
        selectedOptions.push(defaultOption);
      } else {
        $(val).attr('name', 'platform');
      }

      $(val).on('change', updateFilter);
    });

    updateList();
  });

  // FUNC: Updates filter and selection of posts/tweets after every usage of the filter
  function updateFilter(target) {
    // Check for no duplicates in the selectedOptions array
    var index = selectedOptions.indexOf($(target)[0].target);
    if(index !== -1) {
      selectedOptions.splice(index, 1);
    } else {
      selectedOptions.push($(target)[0].target);
    }

    // Check for no filters selected
    if(selectedOptions.length === 0) {
      listMessage.removeClass('hide').html('<p>Selecteer een optie aan de linkerkant om uw inspiratie weer te geven.</p>');
      listToProcess.addClass('hide');
    }
    // Check for defaultOption to be included in the selectedOptions array
    else if(selectedOptions.includes(defaultOption)) {
      listMessage.addClass('hide');
      listToProcess.removeClass('hide');

      // Check for filtering when clicked on one of the platforms
      if($(target)[0].target.name && $(target)[0].target.name.length > 0) {
        selectedOptions.splice(selectedOptions.indexOf(defaultOption), 1);
        $(defaultOption).prop('checked', false);
      } else {
        selectedOptions = [];
        selectedOptions.push(defaultOption);

        $.each(options, function(key, val) {
          $(val).prop('checked', false);
        });
        $(defaultOption).prop('checked', true);
      }
    } else {
      listMessage.addClass('hide');
      listToProcess.removeClass('hide');
    }

    updateList();
  }

  // FUNC: Updates selection of posts/tweets after every usage of the filter
  function updateList() {
    // Remove/reset all options as class on listToProcess
    $.each(options, function(key, val) {
      listToProcess.removeClass(val.id);
    });

    // Set all of the selectedOptions as class on listToProcess
    $.each(selectedOptions, function(key, val) {
      listToProcess.addClass(val.id);
      // Rest of the function contains CSS
    });
  }
}
