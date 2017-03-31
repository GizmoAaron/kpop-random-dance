'use strict';

var GDOCKEY = '1YldbZLeOcR1X553RzMOmAt2w6xOJmbE8cJ4mm4PSkD8';
var dataUrl = 'https://spreadsheets.google.com/feeds/list/' + GDOCKEY + '/1/public/values?alt=json-in-script';
var masterList = [];

// get data from Google spreadsheet
$.ajax({
  url: dataUrl,
  dataType: 'jsonp',
  success: function(data) {
    masterList = cleanseData(data);
  }
});

function cleanseData(data) {
  var rawData = data.feed.entry;
  var cleanData = [];

  for (var i = 0; i < rawData.length; i++) {
    var obj = {};
    $.each(rawData[i], function(key, val) {
      if (key.indexOf('gsx$') >= 0) {
        var cleanKey = key.split('$')[1];
        obj[cleanKey] = val.$t;
      }
    });
    cleanData.push(obj);
  }

  return cleanData;
};

// do something
$(document).on('ajaxComplete', function() {
  
});
