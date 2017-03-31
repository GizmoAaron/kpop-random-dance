'use strict';

var GDOCKEY = '1YldbZLeOcR1X553RzMOmAt2w6xOJmbE8cJ4mm4PSkD8';
var dataUrl = 'https://spreadsheets.google.com/feeds/list/' + GDOCKEY + '/1/public/values?alt=json-in-script';
var masterArray = [];

// get data from Google spreadsheet
$.ajax({
  url: dataUrl,
  dataType: 'jsonp',
  success: function(data) {
    masterArray = cleanseData(data);
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

// Durstenfeld shuffle
function shuffle(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
};

// convert timestamp to seconds
function toSeconds(timestamp) {
  return timestamp.split(':')[0] * 60 + timestamp.split(':')[1];
};

// do something
$(document).on('ajaxComplete', function() {
  var randomized = shuffle(masterArray);

  for (var i = 0; i < randomized.length; i++) {

  }
});
