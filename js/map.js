'use strict';

// postings data
var TITLE = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var TYPE = ['palace', 'flat', 'house', 'bungalo'];
var CHECKIN = ['12:00', '13:00', '14:00'];
var CHECKOUT = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];


var postingsNumber = 8;

// new avatar and avatar paths array variables
var newPath;
var avatarPaths = [];

// creates one avatar path
var genarateAvatarPath = function (avatarNumber) {
  newPath = 'img/avatar/user' + 0 + avatarNumber + '.png';
  return newPath;
}

// creates an array of avatar paths
for (var i = 1; i <= postingsNumber; i++) {
  avatarPaths.push(genarateAvatarPath(i));
}

// gets a random integer between two values, inclusive
var getRandomIntInclusive = function (min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// new posting and postings array variables
var newPosting;
var postings = [];

// function parameters and corresponding arguments
// param1 - avatarPaths
// param2 - TITLE
// param5 - TYPE
// param6 - CHECKIN
// param7 - CHECKOUT
// param8 - FEATURES
// param9 - PHOTOS

// creates one posting
var generatePosting = function (param1, param2, param5, param6, param7, param9) {
  newPosting = {
    author: {
      // should not repeat - to be corrected
      avatar: param1[0]
    },
    offer: {
      // should not repeat - to be corrected
      title: param2[getRandomIntInclusive(0, 7)],
      // address: '',
      price: getRandomIntInclusive (1000, 1000000),
      type: param5[getRandomIntInclusive(0, 3)],
      rooms: getRandomIntInclusive (1, 5),
      guests: getRandomIntInclusive (1, 10),
      checkin: param6[getRandomIntInclusive (0, 2)],
      checkout: param7[getRandomIntInclusive (0, 2)],
    //   features: param8[0],
      description: '',
      photos: param9
    },
    location: {
      // arguments are random - to be corrected
      x: getRandomIntInclusive(100, 800),
      y: getRandomIntInclusive(100, 800)
    }
  }
  return newPosting;
};

// creates an array of posting objects
for (var i = 1; i <= postingsNumber; i++) {
  postings.push(generatePosting(avatarPaths, TITLE, TYPE, CHECKIN, CHECKOUT, PHOTOS));
};
