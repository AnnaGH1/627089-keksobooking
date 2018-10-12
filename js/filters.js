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


      // Adds priceRange property to postings elements - data-preparation.js ?
      var addPriceRange = function (element) {
        var priceRange;
        if (element.offer.price < 10000) {
          // console.log(element.offer.price);
          priceRange = 'low';
          // console.log(priceRange);
        }
        if ((element.offer.price >= 10000) && (element.offer.price <= 50000)) {
          // console.log(element.offer.price);
          priceRange = 'middle';
          // console.log(priceRange);
        }
        if (element.offer.price > 50000) {
          // console.log(element.offer.price);
          priceRange = 'high';
          // console.log(priceRange);
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
        // console.log(index + ' element rank ' + element.rank);
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

      var FILTER_SELECTION_LIMIT = 5;

      var showFiltered = function () {
        // Remove elements currently rendered
        window.map.removePostings();

        // Add rank property
        postingsData.forEach(addRank);

        // Sort according to rank property and if equal - lower price first
        postingsData.sort(function (left, right) {
          var rankDiff = right.rank - left.rank;
          if (rankDiff === 0) {
            rankDiff = priceComparison(left.offer.price, right.offer.price);
          }
          return rankDiff;
        });

        // Keep postings that match filters applied
        var keepMatchingPostings = function (element) {
          if (element.rank > 0) {
            return true;
          }
          return false;
        };

        // Keep first 5 postings max
        var keepTopMatch = function (element, index) {
          if (index <= (FILTER_SELECTION_LIMIT - 1)) {
            return true;
          }
          return false;
        };

        var postingsTopMatch = postingsData.filter(keepMatchingPostings).filter(keepTopMatch);

        // Render elements
        window.map.showPostings(postingsTopMatch);
      };


      // Filters - event listeners
      typeFilter.addEventListener('change', showFiltered);
      priceFilter.addEventListener('change', showFiltered);
      roomsFilter.addEventListener('change', showFiltered);
      guestsFilter.addEventListener('change', showFiltered);
      wifiFilter.addEventListener('change', showFiltered);
      dishwasherFilter.addEventListener('change', showFiltered);
      parkingFilter.addEventListener('change', showFiltered);
      washerFilter.addEventListener('change', showFiltered);
      elevatorFilter.addEventListener('change', showFiltered);
      conditionerFilter.addEventListener('change', showFiltered);

    }, 1000);
  };

  getData();


  // Mock data - start

  // var TITLE = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
  // var TYPE = ['palace', 'flat', 'house', 'bungalo'];
  // var CHECKIN = ['12:00', '13:00', '14:00'];
  // var CHECKOUT = ['12:00', '13:00', '14:00'];
  // var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  // var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
  // var PRICE = {
  //   'min': 1000,
  //   'max': 1000000
  // };
  //
  // var PROPERTY_CAPACITY = {
  //   'minRooms': 1,
  //   'maxRooms': 5,
  //   'minGuests': 1,
  //   'maxGuests': 6
  // };
  // var LOCATION = {
  //   'minX': 0,
  //   'maxX': document.body.clientWidth,
  //   'minY': 130,
  //   'maxY': 630
  // };
  // var postingsNumber = 3;

  // Creates one avatar path
  // var generateAvatar = function (avatarNumber) {
  //   var newAvatar = 'img/avatars/user0' + avatarNumber + '.png';
  //   return newAvatar;
  // };
  //
  // Creates an array of avatars
  // var avatars = [];
  // var createAvatarsArray = function () {
  //   for (var i = 1; i <= postingsNumber; i++) {
  //     avatars.push(generateAvatar(i));
  //   }
  //   return avatars;
  // };
  //
  // createAvatarsArray();
  //
  // Creates one posting
  // var generatePosting = function (avatar, title, type, checkin, checkout, features, photos) {
  //   var locX = window.util.getRandomIntInclusive(LOCATION.minX, LOCATION.maxX);
  //   var locY = window.util.getRandomIntInclusive(LOCATION.minY, LOCATION.maxY);
  //   var posting = {
  //     author: {
  //       avatar: avatar
  //     },
  //     offer: {
  //       title: title,
  //       address: locX.toString(10) + ', ' + locY.toString(10),
  //       price: window.util.getRandomIntInclusive(PRICE.min, PRICE.max),
  //       type: type[window.util.getRandomIntInclusive(0, type.length - 1)],
  //       rooms: window.util.getRandomIntInclusive(PROPERTY_CAPACITY.minRooms, PROPERTY_CAPACITY.maxRooms),
  //       guests: window.util.getRandomIntInclusive(PROPERTY_CAPACITY.minGuests, PROPERTY_CAPACITY.maxGuests),
  //       checkin: checkin[window.util.getRandomIntInclusive(0, checkin.length - 1)],
  //       checkout: checkout[window.util.getRandomIntInclusive(0, checkout.length - 1)],
  //       features: window.util.selectRandomNoRepeat(features),
  //       description: '',
  //       photos: photos
  //     },
  //     location: {
  //       x: locX,
  //       y: locY
  //     }
  //   };
  //   return posting;
  // };
  //
  // Creates an array of posting objects
  // var postings = [];
  // var createPostingsArray = function () {
  //   for (var i = 0; i < postingsNumber; i++) {
  //     postings.push(generatePosting(avatars[i], TITLE[i], TYPE, CHECKIN, CHECKOUT, FEATURES, PHOTOS));
  //   }
  //   return postings;
  // };
  //
  // createPostingsArray();
  // var testData = createPostingsArray();
  // console.log(testData);

  // Mock data - end
})();
