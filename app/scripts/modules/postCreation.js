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
            '<div class="skeleton"><form><div class="columns large-11"><textarea rows="3" name="skeleton-text" placeholder="Hoofdtekst van het bericht"></textarea>'+
            '<input type="text" name="skeleton-link" placeholder="Link ter ondersteuning"><ul class="tags"><li>#journalism</li><li>#digitalstorytelling</li>'+
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

  // FUNC:
  function createDynamics(postType, listItems) {

    // console.log(postType);
    // console.log(listItems);

    var arrOptimalDatetimes = [
      {type: 'twitter', days: ['Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag'], times: ['12:00', '13:00', '15:00', '17:00', '18:00']},
      {type: 'instagram', days: ['Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag'], times: ['02:00', '08:00', '09:00', '13:00', '17:00']}
    ];
    var arrGuidelines = [
      {type: 'informatief', checklist: ['Gebruik minder dan 80 karakters binnen de hoofdtekst', 'Verpak de boodschap in de afbeelding', 'Ga de dialoog aan door een vraag te stellen', 'Vergeet geen call-to-action toe te voegen als ondersteuning']},
      {type: 'promotie', checklist: []},
      {type: 'inhaker', checklist: []},
      {type: 'milestone', checklist: []},
      {type: 'vraag-poll', checklist: []},
      {type: 'feit', checklist: []}
    ];

    var guidelines = $.grep(arrGuidelines, function(val, key) {
      return val.type === postType;
    }, false)[0];

    $.each(listItems, function(listItemKey, listItemVal) {
      var platform = $.grep(arrOptimalDatetimes, function(val, key) {
        return val.type === $(listItemVal).attr('class').split(' ')[1];
      }, false)[0];

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

      //
      $(listItemVal).find('.skeleton .skeleton__image input').attr('id', 'skeleton-file-'+ listItemKey);
      $(listItemVal).find('.skeleton .skeleton__image label').attr('for', 'skeleton-file-'+ listItemKey);

      $(listItemVal).find('.skeleton-file').change(function() {
        showPreview(this);
      });
    });
  }
}
