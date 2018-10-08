'use strict';

(function () {
  var TITLE = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
  var TYPE = ['palace', 'flat', 'house', 'bungalo'];
  var CHECKIN = ['12:00', '13:00', '14:00'];
  var CHECKOUT = ['12:00', '13:00', '14:00'];
  var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
  var PRICE = {
    'min': 1000,
    'max': 1000000
  };

  var PROPERTY_CAPACITY = {
    'minRooms': 1,
    'maxRooms': 5,
    'minGuests': 1,
    'maxGuests': 6
  };
  var LOCATION = {
    'minX': 0,
    'maxX': document.body.clientWidth,
    'minY': 130,
    'maxY': 630
  };
  var postingsNumber = 8;

  // Creates one avatar path
  var generateAvatar = function (avatarNumber) {
    var newAvatar = 'img/avatars/user0' + avatarNumber + '.png';
    return newAvatar;
  };

  // Creates an array of avatars
  var avatars = [];
  var createAvatarsArray = function () {
    for (var i = 1; i <= postingsNumber; i++) {
      avatars.push(generateAvatar(i));
    }
    return avatars;
  };

  createAvatarsArray();

  // Creates one posting
  var generatePosting = function (avatar, title, type, checkin, checkout, features, photos) {
    var locX = window.util.getRandomIntInclusive(LOCATION.minX, LOCATION.maxX);
    var locY = window.util.getRandomIntInclusive(LOCATION.minY, LOCATION.maxY);
    var posting = {
      author: {
        avatar: avatar
      },
      offer: {
        title: title,
        address: locX.toString(10) + ', ' + locY.toString(10),
        price: window.util.getRandomIntInclusive(PRICE.min, PRICE.max),
        type: type[window.util.getRandomIntInclusive(0, type.length - 1)],
        rooms: window.util.getRandomIntInclusive(PROPERTY_CAPACITY.minRooms, PROPERTY_CAPACITY.maxRooms),
        guests: window.util.getRandomIntInclusive(PROPERTY_CAPACITY.minGuests, PROPERTY_CAPACITY.maxGuests),
        checkin: checkin[window.util.getRandomIntInclusive(0, checkin.length - 1)],
        checkout: checkout[window.util.getRandomIntInclusive(0, checkout.length - 1)],
        features: window.util.selectRandomNoRepeat(features),
        description: '',
        photos: photos
      },
      location: {
        x: locX,
        y: locY
      }
    };
    return posting;
  };

  // Creates an array of posting objects
  var postings = [];
  var createPostingsArray = function () {
    for (var i = 0; i < postingsNumber; i++) {
      postings.push(generatePosting(avatars[i], TITLE[i], TYPE, CHECKIN, CHECKOUT, FEATURES, PHOTOS));
    }
    return postings;
  };

  createPostingsArray();

  window.data = {
    LOCATION: LOCATION,
    postings: postings
  };
})();
