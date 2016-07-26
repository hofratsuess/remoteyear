// Wait for the page to be fully loaded
jQuery(document).ready(function($) {
  var apiKey = "<please put the token here>";

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
    var cityId = elementId.split('_')[1];
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
                .css('-webkit-font-smoothing', 'antialiased')
                .css('background-color', '#5F32D6')
                .css('padding', '15px')
                .css('margin', '0px');

    // Add the city name
    main.append($('<h1></h1>').text(cityData.name)
                              .css('font-weight', '300')
                              .css('font-size', '24px')
                              .css('color', 'white')
                              .css('text-decoration', 'underline')
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
      main.append($('<input />').val(cityData.location));
    }

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
