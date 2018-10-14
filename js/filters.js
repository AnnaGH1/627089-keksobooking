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

      // Adds rank to postings elements depending on filters applied
      var addRank = function (element) {
        var rank = 0;
        var wifi = window.util.checkArrayContainsElement(element.offer.features, 'wifi');
        var dishwasher = window.util.checkArrayContainsElement(element.offer.features, 'dishwasher');
        var parking = window.util.checkArrayContainsElement(element.offer.features, 'parking');
        var washer = window.util.checkArrayContainsElement(element.offer.features, 'washer');
        var elevator = window.util.checkArrayContainsElement(element.offer.features, 'elevator');
        var conditioner = window.util.checkArrayContainsElement(element.offer.features, 'conditioner');


        if (element.offer.type === typeFilter.value) {
          rank += 3;
        }
        if (element.offer.priceRange === priceFilter.value) {
          rank += 3;
        }
        if (element.offer.rooms.toString() === roomsFilter.value) {
          rank += 3;
        }
        if (element.offer.guests.toString() === guestsFilter.value) {
          rank += 3;
        }
        if (wifiFilter.checked && wifi) {
          rank += 1;
        }
        if (dishwasherFilter.checked && dishwasher) {
          rank += 1;
        }
        if (parkingFilter.checked && parking) {
          rank += 1;
        }
        if (washerFilter.checked && washer) {
          rank += 1;
        }
        if (elevatorFilter.checked && elevator) {
          rank += 1;
        }
        if (conditionerFilter.checked && conditioner) {
          rank += 1;
        }

        element.rank = rank;
        return element;
      };


      var priceComparison = function (left, right) {
        if (left > right) {
          return 1;
        } else if (left < right) {
          return -1;
        } else {
          return 0;
        }
      };

      // Adds price range property
      postingsData.forEach(addPriceRange);


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
          var wifi = window.util.checkArrayContainsElement(element.offer.features, 'wifi');
          var dishwasher = window.util.checkArrayContainsElement(element.offer.features, 'dishwasher');
          var parking = window.util.checkArrayContainsElement(element.offer.features, 'parking');
          var washer = window.util.checkArrayContainsElement(element.offer.features, 'washer');
          var elevator = window.util.checkArrayContainsElement(element.offer.features, 'elevator');
          var conditioner = window.util.checkArrayContainsElement(element.offer.features, 'conditioner');

          if (((element.offer.type === typeChoice) || typeChoice === 'any') && ((element.offer.priceRange === priceChoice) || priceChoice === 'any') && ((element.offer.rooms.toString() === roomsChoice) || roomsChoice === 'any') && ((element.offer.guests.toString() === guestsChoice) || guestsChoice === 'any') && ((wifi && wifiFilter.checked) || !wifiFilter.checked) && ((dishwasher && dishwasherFilter.checked) || !dishwasherFilter.checked) && ((parking && parkingFilter.checked) || !parkingFilter.checked) && ((washer && washerFilter.checked) || !washerFilter.checked) && ((elevator && elevatorFilter.checked) || !elevatorFilter.checked) && ((conditioner && conditionerFilter.checked) || !conditionerFilter.checked)) {
            return true;
          }
          return false;
        };

        var postingsMatch = postingsData.filter(keepMatchingPostings);

        // Add rank property
        postingsMatch.forEach(addRank);

        // Sort according to rank property and if equal - lower price first
        postingsMatch.sort(function (left, right) {
          var rankDiff = right.rank - left.rank;
          if (rankDiff === 0) {
            rankDiff = priceComparison(left.offer.price, right.offer.price);
          }
          return rankDiff;
        });

        // Keep first 5 postings max
        var keepTopMatch = function (element, index) {
          if (index <= (window.sharedVariables.POSTINGS_NUMBER_LIMIT - 1)) {
            return true;
          }
          return false;
        };

        // var postingsTopMatch = postingsData.filter(keepMatchingPostings).filter(keepTopMatch);
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
