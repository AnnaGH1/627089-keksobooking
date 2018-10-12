'use strict';

(function () {
  var LOCATION = {
    'minX': 0,
    'maxX': document.body.clientWidth,
    'minY': 130,
    'maxY': 630
  };

  var parsedData;

  // Updates postings data when loaded
  var provideData = function () {
    return parsedData;
  };

  // Callback if loaded
  var onDataLoad = function (response) {
    parsedData = JSON.parse(response);
    window.data.postings = parsedData;
  };

  // Callback if failed
  var onDataError = function (loadError) {
    window.userMessages.onError(loadError);
  };

  window.backend.load(onDataLoad, onDataError);

  window.data = {
    LOCATION: LOCATION,
    postings: provideData(),
  };
})();
