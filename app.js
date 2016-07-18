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
                .css('font-family', 'sans-serif');

    // Add the city name
    main.append($('<h1></h1>').text(cityData.name));

    // Add the details
    if (isAttributeFilled(cityData.details)) {
      main.append($(cityData.details));
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
  loadCityData(3, function (d) { console.log(d); });
});