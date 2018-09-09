'use strict';

var TITLE = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var TYPE = ['palace', 'flat', 'house', 'bungalo'];
var CHECKIN = ['12:00', '13:00', '14:00'];
var CHECKOUT = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];


var numberOfUsers = 3;

// avatar paths array
var avatarsPaths = [];

// creates avatar path and updates avatar paths array
var genarateAvatarPath = function (avatarNumber) {
  var newPath = 'img/avatar/user0' + avatarNumber + '.png';
  avatarsPaths.push(newPath);
  return avatarsPaths;
}

for (var i = 1; i <= numberOfUsers; i++) {
  genarateAvatarPath(i);
}

avatarsPaths;

// getting a random integer between two values, inclusive
var getRandomIntInclusive = function (min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

var randomPrice = getRandomIntInclusive (1000, 1000000);
var randomRooms = getRandomIntInclusive (1, 5);
var randomGuests = getRandomIntInclusive (1, 6);

// arguments are random, used for testing, and will be changed
var randomX = getRandomIntInclusive(100, 800);
var randomY = getRandomIntInclusive(100, 800);

var newPosting;

// creates new posting
var generatePosting = function (param1, param2, param4, param5, param6, param7, param8, param9, param10, param12, param13, param14) {
  newPosting = {
    author: {
      avatar: param1[0]
    },
    offer: {
      title: param2[0],
      address: '',
      price: param4,
      type: param5[0],
      rooms: param6,
      guests: param7,
      checkin: param8[0],
      checkout: param9[0],
      features: param10[0],
      description: '',
      photos: param12
    },
    location: {
      x: param13,
      y: param14
    }
  }
  return newPosting;

}

generatePosting(avatarsPaths, TITLE, randomPrice, TYPE, randomRooms, randomGuests, CHECKIN, CHECKOUT, FEATURES, PHOTOS, randomX, randomY);
