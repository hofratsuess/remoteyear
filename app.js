// Wait for the page to be fully loaded
jQuery(document).ready(function($) {
  var apiKey = "YFGuXdhlwRDbQUxn";
  var weatherApiKey = "c0d57f56be592a1aa15efab1fe194a5d";

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
    var main = $('<div id="main"></div>')
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
                              .css('border-bottom', '2px solid')
                              .css('display', 'inline')
                              .css('margin', '0px')
                            );

    // Add the weather icon
    if (isAttributeFilled(cityData.location)) {
      var latLon = cityData.location.split(',');
      var lat = latLon[0];
      var lon = latLon[1];

      $.getJSON('http://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&appid=' + weatherApiKey + '&units=metric', function(data) {
        console.log(data);
        var weather_icon = $('<div></div>')
          .append('<img src="http://openweathermap.org/img/w/'+data.weather[0].icon+'.png" />')
          .append(
            $('<p>', {
              text: data.main.temp
            })
          )
        main.append(weather_icon);
      });
    }

    // Add the details
    if (isAttributeFilled(cityData.details)) {
      var cityDetails = $(cityData.details)
                                      .css('list-style-type', 'disc')
                                      .css('margin-top', '30px')
                                      .css('padding-left', '15px');

      cityDetails.find("li")
                  .css('padding-bottom', '8px')
                  .css('font-weight', '300')
                  .css('font-size', '14px')
                  .css('line-height', '24px')
                  .css('color', 'white');
      main.append(cityDetails);
    }

    // Add events
    if (isAttributeFilled(cityData.events)) {
      var event = $('<div></div>').css('font-family', 'Biryani', 'sans-serif').css('color', 'white').css('font-size', '0.875rem').css('padding-top', '1.5rem');

      if (cityData.events.rows.length > 1 ) {
        $(event).append('<p>Events</p>')
                .css('font-weight', '700')
                .css('display', 'inline')
                .css('padding-top', '1.5rem')
                .css('margin', '0px');
      } else {
        $(event).append('<p>Event</p>')
                .css('font-size', '0.875rem')
                .css('font-weight', '700')
                .css('display', 'inline')
                .css('margin', '0px');
      }

      $(cityData.events.rows).each(function(index){
        var row = $("<div></div>").css('margin-top', '0.5rem').append(
          $('<p></p>').append(cityData.events.rows[index].date).css('font-weight', '400').css('margin-bottom', '0'),
          $('<a>', {
            text: cityData.events.rows[index].name,
            href: cityData.events.rows[index].link
          }).css('text-decoration', 'none').css('font-weight', '400').css('color', '#38E36E').css('font-size', '0.875rem')
        );
        event.append(row);
      });

      main.append(event);
    }

    // Add sections
    if(isAttributeFilled(cityData.sections)) {
      var section = $('<div></div>')
        .css('padding-top', '1.5rem')
        .css('font-family', 'Biryani', 'sans-serif')
        .css('color', 'white');

      $(cityData.sections.rows).each(function(index){
        var row = $("<div></div>").append(
          $('<h3></h3>')
            .css('font-size', '0.875rem')
            .css('display', 'inline')
            .css('margin', '0px')
            .append(cityData.sections.rows[index].title),
          $('<p></p>').append(cityData.sections.rows[index].content).css('text-decoration', 'none').css('font-weight', '400').css('color', '#38E36E').css('font-size', '0.875rem')
        );
        section.append(row);
      });

      main.append(section);
    }

    // Add the place of residence
    if (isAttributeFilled(cityData.location)) {
      var google_api_key = 'AIzaSyCcWYb058H2EWIJbZSesHAH4Aq__btVjiQ';
      var google_map_zoom = '12';
      var google_map_size_d = '640x400';
      var google_map_size_m = '400x400';
      var google_map_type = 'terrain';
      var window_width_with_breakpoint = '554';

      var resizeMap = function() {
        $('#google_image_map').attr('src', getGoogleMapImageUrl(windowWidth()));
      }

      var getGoogleMapImageUrl = function(width) {
        return 'https://maps.googleapis.com/maps/api/staticmap?center='+cityData.location+'&scale=2&markers=color:red%7Clabel:%7C'+cityData.location+'&maptype='+google_map_type+'&zoom='+google_map_zoom+'&size='+width+'&key='+google_api_key;
      }

      var windowWidth = function() {
        if($(window).width() < window_width_with_breakpoint) {
          return google_map_size_m;
        } else {
          return google_map_size_d;
        }
      };

      $(window).resize(resizeMap);

      var google_map_src = 'https://maps.googleapis.com/maps/api/staticmap?center='+cityData.location+'&scale=2&markers=color:red%7Clabel:%7C'+cityData.location+'&maptype='+google_map_type+'&zoom='+google_map_zoom+'&size='+windowWidth()+'&key='+google_api_key;
      var google_map = $('<div><h3 style="font-size:0.875rem">Place of residence</h3></div>')
                        .css('font-size', '14px')
                        .append('<img width="100%" id="google_image_map" src="'+google_map_src+'" />')
                        .css('color', 'white')
                        .css('padding-top', '0.2rem');

      main.append(google_map);
    }

    // Add the next location
    if (isAttributeFilled(cityData.next_location)) {
      var row = $('<div></div>').css('padding-top', '1.5rem');
      var title = 'Next Location';
      row.append('<h4 style="color:white">'+title+'</h4>')
          .css('font-size', '0.875rem')
          .css('font-weight', '700')
          .css('margin', '0')
          .append('<p>'+cityData.next_location+'</p>')
          .css('color', '#38E36E')
          .css('font-weight', '400');

      main.append(row);
    }

    // add a button to let the visitor know why marc is away
    var buttonText = "Warum ist Marc in " +cityData.name+ " ?";
    var button = $('<a />')
                    .text(buttonText)
                    .attr('href', 'http://hofratsuess.ch/das-neue-normal-global-digital-arbeiten')
                    .css('display', 'table')
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
                    .css('margin-right', 'auto')
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
