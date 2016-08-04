// Wait for the page to be fully loaded
jQuery(document).ready(function($) {
  var apiKey = "YFGuXdhlwRDbQUxn";

  var isAttributeFilled = function (value) {
    if (typeof value !== 'undefined' && value !== null && value !== "") {
      return true;
    } else {
      return false;
    }
  };

  // Extract the city id from the html.
  var getCityId = function(remoteyearEntry) {
    var elementId = remoteyearEntry.attr('id');
    console.log(elementId);
    var cityId = elementId.split('_')[1];
    console.log(cityId);
    return cityId;
  };

  var loadCityData = function(cityId, callback) {
    $.getJSON('https://api.remoteyear.hofratsuess.ch/api/1/tables/cities/rows/' + cityId + '?access_token=' + apiKey, function(data) {
      callback(data);
    });
  };

  var renderSnippet = function(cityData) {
    // Create the container
    var main = $('<div></div>')
                .css('font-family', 'Biryani', 'sans-serif')
                .css('letter-spacing', '0.3px')
                .css('-webkit-font-smoothing', 'antialiased')
                .css('background-color', '#5F32D6')
                .css('padding', '15px')
                .css('margin', '0px');

    // Add the city name
    main.append($('<h1></h1>').text(cityData.name)
                              .css('font-weight', '300')
                              .css('font-size', '24px')
                              .css('color', 'white')
                              // .css('text-decoration', 'underline')
                              .css('border-bottom', '2px solid')
                              .css('display', 'inline')
                              // .css('padding', '-5px')
                              .css('margin', '0px')
                            );

    // Add the details
    if (isAttributeFilled(cityData.details)) {
      var cityDetails = $(cityData.details).css('list-style-type', 'disc')
                                      .css('margin-top', '30px')
                                      .css('padding-left', '15px');

      cityDetails.find("li").css('padding-bottom', '8px')
                  .css('font-weight', '300')
                  .css('font-size', '14px')
                  .css('line-height', '24px')
                  .css('color', 'white');
      main.append(cityDetails);
    }

    // Add the place of residence
    if (isAttributeFilled(cityData.location)) {
      var google_api_key = 'AIzaSyB_6FYAyNhytAveixeKolVAmiI6DLz1ytI';
      var google_map_zoom = '12';
      var google_map_size = '640x400';
      var google_map_type = 'terrain';
      var google_map_src = 'https://maps.googleapis.com/maps/api/staticmap?center='+cityData.location+'&scale=2&markers=color:red%7Clabel:%7C'+cityData.location+'&maptype='+google_map_type+'&zoom='+google_map_zoom+'&size='+google_map_size+'&key='+google_api_key;
      var google_map = $('<div><h1>Place of residence</h1></div>').append('<img width="100%" src="'+google_map_src+'" />').css('color', 'white');

      main.append(google_map);
    }

    // Add events
    if (isAttributeFilled(cityData.events)) {
      var event = $('<div></div>').css('font-family', 'Biryani', 'sans-serif').css('color', 'white');

      if (cityData.events.rows.length > 1 ) {
        $(event).append('<h1>Events</h1>')
                .css('font-weight', '300')
                .css('display', 'inline')
                .css('margin', '0px');
      } else {
        $(event).append('<h1>Event</h1>');
      }

      $(cityData.events.rows).each(function(index){
        var row = $("<div></div>").append(
          $('<h3></h3>').append(cityData.events.rows[index].date),
          $('<a>', {
            text: cityData.events.rows[index].name,
            href: cityData.events.rows[index].link
          }).css('color', 'white')
        );
        event.append(row);
      });

      main.append(event);
    }

    // Add sections
    if(isAttributeFilled(cityData.sections)) {
      var section = $('<div></div>')
        .css('font-family', 'Biryani', 'sans-serif')
        .css('color', 'white');

      $(cityData.sections.rows).each(function(index){
        var row = $("<div></div>").css('padding-top', '2rem').append(
          $('<h1></h1>')
            .css('display', 'inline')
            .css('margin', '0px')
            .append(cityData.sections.rows[index].title),
          $('<p></p>').append(cityData.sections.rows[index].content)
        );
        section.append(row);
      });

      main.append(section);
    }

    // Add the next location
    if (isAttributeFilled(cityData.next_location)) {
      var row = $('<div></div>');
      var title = 'Next Location';
      row.append('<h1>'+title+'</h1>')
          .css('margin', '0')
          .append('<p>'+cityData.next_location+'</p>')
          .css('color', 'white')
          .css('padding-top', '.75rem');

      main.append(row);
    }

    // add a button to let the visitor know why marc is away
    var buttonText = "Warum ist Marc in Valencia?";
    var button = $('<a />')
                    .text(buttonText)
                    .attr('href', 'http://hofratsuess.ch/das-neue-normal-global-digital-arbeiten')
                    .css('display', 'inline-block')
                    .css('font-weight', '200')
                    .css('-webkit-font-smoothing', 'subpixel-antialiased')
                    .css('text-rendering', 'optimizeLegibility')
                    .css('text-decoration', 'none')
                    .css('padding', '10px 20px')
                    .css('padding-top', '13px')
                    .css('font-size', '11px')
                    .css('color', '#fff')
                    .css('text-align', 'center')
                    .css('cursor', 'pointer')
                    .css('outline', 'none')
                    .css('background-color', '#ED5C41')
                    .css('border',  'none')
                    .css('border-radius', '200px')
                    .css('box-shadow', '0 3px #BB2A0F')
                    .css('margin-left', 'auto')
                    .css('margin-right', 'auto');
    button
      .mouseover(function() {
        $(this).css('background-color', '#BB2A0F')
                .css('box-shadow', '0 3px #890000');
      })
      .mouseout(function() {
        $(this).css('background-color', '#ED5C41')
                .css('box-shadow', '0 3px #BB2A0F');
      })
      .mousedown(function() {
        $(this).css('background-color', '#BB2A0F')
                .css('box-shadow', '0 1px #890000')
                .css('transform', 'translateY(2px)');
      })
      .mouseup(function() {
        $(this).css('background-color', '#ED5C41')
                .css('box-shadow', '0 3px #BB2A0F')
                .css('transform', 'translateY(-2px)');
      });

    main.append($('<br/>'));
    main.append(button);

    $('#remoteyear_' + cityData.id).empty().append(main);
  };

  console.log(getCityId($('.remoteyear').first()));
  loadCityData(getCityId($('.remoteyear').first()), function (d) { console.log(d); });
  loadCityData(getCityId($('.remoteyear').first()), renderSnippet);
  // loadCityData(3, function (d) { console.log(d); });

  // var foo = function (arg1, arg2, etc, callback) {
  //   var result = arg1 + arg2 + etc;
  //   // return result;
  //   callback(null, result);
  // }
  //
  // var fooCallback = function (error, result) {
  //   // if (error) {
  //   //   throw error;
  //   // }
  //   console.log(result);
  // }
  //
  // foo(1, 2, 3, fooCallback);

});
