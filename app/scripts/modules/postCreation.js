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
      listToCreate.removeClass('hide').html('<ul></ul>');

      createSkeleton(postOptions);
    } else {
      listMessage.removeClass('hide');
      listToCreate.addClass('hide');
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

  // FUNC: Creates a skeleton to fill in, on basis of the selected filterinputs
  function createSkeleton(options) {
    // Check selected type of post
    var postType = $.grep(options, function(val, key) {
      return val.type === 'berichttype';
    }, false)[0].value;

    // Print the data into the list
    $.each(options, function(key, val) {
      if(val.type != 'berichttype') {
        // Output Skeleton
        var skeleton = '<li class="item '+ val.value +'">'+
            '<div class="guidelines"><div class="columns large-8"><div class="guidelines__datetime"><div class="date"><p>Optimale dagen om te posten<br></p></div>'+
            '<div class="time"><p>Optimale tijden om te posten<br></p></div></div></div><div class="columns large-14 large-offset-2 end">'+
            '<div class="guidelines__checklist"><ul></ul></div></div></div>'+
            '<div class="skeleton"><form><div class="columns large-11"><textarea rows="3" class="skeleton-text" name="skeleton-text" placeholder="Hoofdtekst van het bericht"></textarea>'+
            '<input type="text" class="skeleton-link" name="skeleton-link" placeholder="Link ter ondersteuning"><ul class="tags"><li>#journalism</li><li>#digitalstorytelling</li>'+
            '<li>#digitalstory</li><li>#futureofjournalism</li><li>#hackathon</li></ul></div><div class="columns large-2"></div><div class="columns large-11 end">'+
            '<div class="skeleton__image"><input type="file" name="skeleton-file" accept="image/*" class="skeleton-file" /><label class="btn">Upload een afbeelding</label>'+
            '<div class="skeleton__preview"></div></div></div></form></div>'+
            '<div class="options"><div class="options__content"><a class="btn second"><span>Publiceren</span></a><form>'+
            '<div class="skeleton-day"><select><option value="" disabled selected>Selecteer een dag</option></select></div>'+
            '<div class="skeleton-time"><select><option value="" disabled selected>Selecteer een tijd</option></select>'+
            '</div><a class="btn"><span>Opslaan als concept</span></a></form></div></div>'+
          '</li>';

        listToCreate.find('> ul').append(skeleton);
      }
    });

    createDynamics(postType, listToCreate.find('> ul > li'));
  }

  // FUNC: Create dynamic content for every type of skeleton
  function createDynamics(postType, listItems) {
    var arrOptimalDatetimes = [
      {type: 'twitter', days: ['Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag'], times: ['12:00', '13:00', '15:00', '17:00', '18:00']},
      {type: 'instagram', days: ['Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag'], times: ['02:00', '08:00', '09:00', '13:00', '17:00']}
    ];
    var arrGuidelines = [
      {type: 'informatief', checklist: ['Gebruik minder dan 80 karakters binnen de hoofdtekst', 'Verpak de boodschap in de afbeelding', 'Ga de dialoog aan door een vraag te stellen', 'Vergeet geen call-to-action toe te voegen als ondersteuning']},
      {type: 'promotie', checklist: ['Breng de boodschap op een positieve manier over', 'Zorg voor een aangrijpende afbeelding', 'Vergeet geen call-to-action toe te voegen als ondersteuning', 'De visie van het bedrijf moet centraal staan in het bericht']},
      {type: 'inhaker', checklist: ['Zorg voor actualiteit in de boodschap', 'Match het onderwerp met de visie van het bedrijf', 'Het bericht moet geen commerciële boodschap bevatten', 'Positiviteit en relevantie moeten centraal staan']},
      {type: 'milestone', checklist: ['Verpak de boodschap in de afbeelding', 'Breng het bericht op een positieve manier over', 'Maak het feestelijk, vier het met jouw volgers', 'Houd de informatie kort en bondig, minder dan 60 karakters']},
      {type: 'vraag-poll', checklist: ['Ga de dialoog aan door een vraag te stellen', 'Wees duidelijk naar jouw lezers toe', 'Kies voor een open of gesloten vraag', 'Zorg voor minimaal 2 antwoordmogelijkheden']},
      {type: 'feit', checklist: ['Zorg voor een aangrijpende afbeelding', 'De lezer moet zich kunnen verplaatsen in de gedachte', 'Wees niet te opdringerig', 'Breng het bericht op een positieve manier over']}
    ];
    var guidelines = $.grep(arrGuidelines, function(val, key) {
      return val.type === postType;
    }, false)[0];

    $.each(listItems, function(listItemKey, listItemVal) {
      var platform = $.grep(arrOptimalDatetimes, function(val, key) {
        return val.type === $(listItemVal).attr('class').split(' ')[1];
      }, false)[0];

      // Set days, times and guidelines
      $.each(platform.days, function(key, val) {
        $(listItemVal).find('.guidelines .guidelines__datetime .date p').append('<span>'+ val +'</span>');
        $(listItemVal).find('.options .skeleton-day select').append('<option value="'+ val +' (aanstaande)">'+ val +' (aanstaande)</option>');
      });
      $.each(platform.times, function(key, val) {
        $(listItemVal).find('.guidelines .guidelines__datetime .time p').append('<span>'+ val +'</span>');
        $(listItemVal).find('.options .skeleton-time select').append('<option value="'+ val +'">'+ val +'</option>');
      });
      $.each(guidelines.checklist, function(key, val) {
        $(listItemVal).find('.guidelines .guidelines__checklist ul').append('<li>'+ val +'</li>');
      });

      // Set preview option
      $(listItemVal).find('.skeleton .skeleton__image input').attr('id', 'skeleton-file-'+ listItemKey);
      $(listItemVal).find('.skeleton .skeleton__image label').attr('for', 'skeleton-file-'+ listItemKey);

      $(listItemVal).find('.skeleton-file').change(function() {
        showPreview(this);
      });

      // Update guidelines on form update
      $(listItemVal).find('.skeleton form').on('change', function() {
        updateGuidelines(listItemVal, this, postType, $(listItemVal).find('.guidelines .guidelines__checklist ul'));
      });
    });
  }

  // FUNC: Update guideline(s) when form gets changed and rules match
  function updateGuidelines(post, form, postType, checklist) {
    // Switch per type of post
    switch(postType) {
      case 'informatief':
        // Guideline 1
        if($(form).find('textarea.skeleton-text').val().length > 0 && $(form).find('textarea.skeleton-text').val().length < 80) {
          checklist.find('li:nth-child(1)').addClass('checked');
        } else {
          checklist.find('li:nth-child(1)').removeClass('checked');
        }

        // Guideline 3
        if($(form).find('textarea.skeleton-text').val().indexOf('?') >= 0) {
          checklist.find('li:nth-child(3)').addClass('checked');
        } else {
          checklist.find('li:nth-child(3)').removeClass('checked');
        }

        // Guideline 4
        if($(form).find('input.skeleton-link').val().length > 0 && $(form).find('input.skeleton-link').val().indexOf('www') >= 0) {
          checklist.find('li:nth-child(4)').addClass('checked');
        } else {
          checklist.find('li:nth-child(4)').removeClass('checked');
        }

        break;
    }

    // Check for checked guideline(s)
    $.each(checklist.find('li'), function(key, val) {
      if($(val).hasClass('checked') == true) {
        $(post).addClass('checked');

        // When clicked on one of the buttons, remove post from container/list
        $.each($('.options .btn'), function(key, val) {
          $(val).on('click', function() {
            $(post).addClass('saved');
          });
        });

        return false;
      } else {
        $(post).removeClass('checked');
      }
    });
  }
}
