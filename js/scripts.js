'use strict';

var GDOCKEY = '1YldbZLeOcR1X553RzMOmAt2w6xOJmbE8cJ4mm4PSkD8';
var dataUrl = 'https://spreadsheets.google.com/feeds/list/' + GDOCKEY + '/1/public/values?alt=json-in-script';

var masterList = [];
var playlist;
var player;
var currentVideoIndex = 0;
var countdown = $('#countdown')[0];

var settings = {
  // play dance practice video instead of MV, if available
  dp: true,
  // number of seconds to add before and after dance section
  padding: 3
};

// get data from Google spreadsheet
$.ajax({
  url: dataUrl,
  dataType: 'jsonp',
  success: function(data) {
    masterList = cleanseData(data);
  }
});

// put spreadsheet data into a nice clean array
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
  return parseInt(timestamp.split(':')[0]) * 60 + parseInt(timestamp.split(':')[1]);
};

// do stuff
$(document).on('ajaxComplete', function() {
  playlist = shuffle(masterList);

  // load the YouTube Player API code asynchronously
  var tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
});

// executes as soon as YouTube Player API code downloads
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    width: '640',
    height: '390',
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange,
      'onError': onPlayerError
    }
  });
};

function onPlayerReady(event) {
  loadVideo(playlist[currentVideoIndex]);
};

function onPlayerStateChange(event) {
  console.log(event.data);
  if (event.data === YT.PlayerState.ENDED && Math.round(player.getCurrentTime()) == getEndSeconds(playlist[currentVideoIndex]) && currentVideoIndex < playlist.length - 1) {
      currentVideoIndex++;
      loadVideo(playlist[currentVideoIndex]);
  }
};

function onPlayerError(event) {
  currentVideoIndex++;
  loadVideo(playlist[currentVideoIndex]);
};

function loadVideo(videoObj) {
  console.log(videoObj.artist + ' - ' + videoObj.song);
  countdown.play();
  countdown.addEventListener('ended', function() {
    player.loadVideoById({
      'videoId': dpOK(videoObj) ? videoObj.dpid : videoObj.mvid,
      'startSeconds': getStartSeconds(videoObj),
      'endSeconds': getEndSeconds(videoObj),
      'suggestedQuality': 'large'
    });
  });
};

// helper functions
function dpOK(videoObj) {
  return settings.dp && videoObj.dpid !== '';
}
function getStartSeconds(videoObj) {
  return toSeconds(dpOK(videoObj) ? videoObj.dpstart : videoObj.mvstart) - settings.padding;
};
function getEndSeconds(videoObj) {
  return toSeconds(dpOK(videoObj) ? videoObj.dpend : videoObj.mvend) + settings.padding;
};
