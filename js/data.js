'use strict';

(function () {
  var TITLE = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
  var TYPE = ['palace', 'flat', 'house', 'bungalo'];
  var CHECKIN = ['12:00', '13:00', '14:00'];
  var CHECKOUT = ['12:00', '13:00', '14:00'];
  var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
  var minPrice = 1000;
  var maxPrice = 1000000;
  var minRooms = 1;
  var maxRooms = 5;
  var minGuests = 1;
  var maxGuests = 6;
  var minLocX = 0;
  var maxLocX = document.body.clientWidth;
  var minLocY = 130;
  var maxLocY = 630;
  var postingsNumber = 8;


  // Creates one avatar path
  var generateAvatar = function (avatarNumber) {
    var newAvatar = 'img/avatars/user' + 0 + avatarNumber + '.png';
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
    var locX = window.util.getRandomIntInclusive(minLocX, maxLocX);
    var locY = window.util.getRandomIntInclusive(minLocY, maxLocY);
    var posting = {
      author: {
        avatar: avatar
      },
      offer: {
        title: title,
        address: locX.toString(10) + ', ' + locY.toString(10),
        price: window.util.getRandomIntInclusive(minPrice, maxPrice),
        type: type[window.util.getRandomIntInclusive(0, type.length - 1)],
        rooms: window.util.getRandomIntInclusive(minRooms, maxRooms),
        guests: window.util.getRandomIntInclusive(minGuests, maxGuests),
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
    minLocX: minLocX,
    maxLocX: maxLocX,
    minLocY: minLocY,
    maxLocY: maxLocY,
    postings: postings
  };
})();
