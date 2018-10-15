'use strict';

(function () {

  var getData = function () {
    setTimeout(function () {
      var postingsData = window.data.postings;

      // Reference to filters
      var typeFilter = window.sharedVariables.filters.querySelector('#housing-type');
      var priceFilter = window.sharedVariables.filters.querySelector('#housing-price');
      var roomsFilter = window.sharedVariables.filters.querySelector('#housing-rooms');
      var guestsFilter = window.sharedVariables.filters.querySelector('#housing-guests');

      var featuresFilter = window.sharedVariables.filters.querySelector('#housing-features');
      var wifiFilter = featuresFilter.querySelector('#filter-wifi');
      var dishwasherFilter = featuresFilter.querySelector('#filter-dishwasher');
      var parkingFilter = featuresFilter.querySelector('#filter-parking');
      var washerFilter = featuresFilter.querySelector('#filter-washer');
      var elevatorFilter = featuresFilter.querySelector('#filter-elevator');
      var conditionerFilter = featuresFilter.querySelector('#filter-conditioner');

      // Adds priceRange property to postings elements
      var addPriceRange = function (element) {
        var priceRange;
        if (element.offer.price < window.sharedVariables.PRICE_THRESHOLD.lowToMiddle) {
          priceRange = 'low';
        }
        if ((element.offer.price >= window.sharedVariables.PRICE_THRESHOLD.lowToMiddle) && (element.offer.price <= window.sharedVariables.PRICE_THRESHOLD.middleToHigh)) {
          priceRange = 'middle';
        }
        if (element.offer.price > window.sharedVariables.PRICE_THRESHOLD.middleToHigh) {
          priceRange = 'high';
        }

        element.offer.priceRange = priceRange;
        return element;
      };

      try {
        // Adds price range property
        postingsData.forEach(addPriceRange);
      } catch (error) {
        // User message provided from data.js module
      }

      var showFiltered = function () {
        // Remove elements currently rendered
        window.map.removePostings();

        // Variables for current values in filters
        var typeChoice = typeFilter.value;
        var priceChoice = priceFilter.value;
        var roomsChoice = roomsFilter.value;
        var guestsChoice = guestsFilter.value;

        // Keep postings that match all filters applied
        var keepMatchingPostings = function (element) {
          var wifiAvailable = window.util.checkArrayContainsElement(element.offer.features, 'wifi');
          var dishwasherAvailable = window.util.checkArrayContainsElement(element.offer.features, 'dishwasher');
          var parkingAvailable = window.util.checkArrayContainsElement(element.offer.features, 'parking');
          var washerAvailable = window.util.checkArrayContainsElement(element.offer.features, 'washer');
          var elevatorAvailable = window.util.checkArrayContainsElement(element.offer.features, 'elevator');
          var conditionerAvailable = window.util.checkArrayContainsElement(element.offer.features, 'conditioner');

          return (((element.offer.type === typeChoice) || typeChoice === 'any') && ((element.offer.priceRange === priceChoice) || priceChoice === 'any') && ((element.offer.rooms.toString() === roomsChoice) || roomsChoice === 'any') && ((element.offer.guests.toString() === guestsChoice) || guestsChoice === 'any') && ((wifiAvailable && wifiFilter.checked) || !wifiFilter.checked) && ((dishwasherAvailable && dishwasherFilter.checked) || !dishwasherFilter.checked) && ((parkingAvailable && parkingFilter.checked) || !parkingFilter.checked) && ((washerAvailable && washerFilter.checked) || !washerFilter.checked) && ((elevatorAvailable && elevatorFilter.checked) || !elevatorFilter.checked) && ((conditionerAvailable && conditionerFilter.checked) || !conditionerFilter.checked));
        };

        var postingsMatch = postingsData.filter(keepMatchingPostings);

        // Sort by price - lower price first
        postingsMatch.sort(function (left, right) {
          if (left.offer.price < right.offer.price) {
            return -1;
          }
          if (left.offer.price > right.offer.price) {
            return 1;
          } else {
            return 0;
          }
        });

        // Keep first 5 postings max
        var keepTopMatch = function (element, index) {
          return (index <= (window.sharedVariables.POSTINGS_NUMBER_LIMIT - 1));
        };

        var postingsTopMatch = postingsMatch.filter(keepTopMatch);

        // Render elements
        window.map.showPostings(postingsTopMatch);
      };

      var onFilterChange = function () {
        window.debounce(showFiltered);
      };

      // Filters - event listeners
      typeFilter.addEventListener('change', onFilterChange);
      priceFilter.addEventListener('change', onFilterChange);
      roomsFilter.addEventListener('change', onFilterChange);
      guestsFilter.addEventListener('change', onFilterChange);
      wifiFilter.addEventListener('change', onFilterChange);
      dishwasherFilter.addEventListener('change', onFilterChange);
      parkingFilter.addEventListener('change', onFilterChange);
      washerFilter.addEventListener('change', onFilterChange);
      elevatorFilter.addEventListener('change', onFilterChange);
      conditionerFilter.addEventListener('change', onFilterChange);

    }, 1000);
  };

  getData();
})();
