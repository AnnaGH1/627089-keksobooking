'use strict';

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
var minLocX = 25;
var maxLocX = document.body.clientWidth - 25;
var minLocY = 130;
var maxLocY = 630;
var postingsNumber = 8;

// new avatar and avatars array variables
var newAvatar;
var avatars = [];

// creates one avatar
var genarateAvatar = function (avatarNumber) {
  newAvatar = 'img/avatars/user' + 0 + avatarNumber + '.png';
  return newAvatar;
}

// creates an array of avatars
for (var i = 1; i <= postingsNumber; i++) {
  avatars.push(genarateAvatar(i));
}

// gets a random integer between two values, inclusive
var getRandomIntInclusive = function (min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

var postings = [];

// creates one posting and adds it to an array
var generatePosting = function (avatar, title, type, checkin, checkout, features, photos) {
  var locX = getRandomIntInclusive(minLocX, maxLocX);
  var locY = getRandomIntInclusive(minLocY, maxLocY);
  var newPosting = {
    author: {
      // should not repeat - to be corrected
      avatar: avatar[0]
    },
    offer: {
      // should not repeat - to be corrected
      title: title[getRandomIntInclusive(0, title.length - 1)],
      address: locX.toString(10) + ', ' + locY.toString(10),
      price: getRandomIntInclusive (minPrice, maxPrice),
      type: type[getRandomIntInclusive(0, type.length - 1)],
      rooms: getRandomIntInclusive (minRooms, maxRooms),
      guests: getRandomIntInclusive (minGuests, maxGuests),
      checkin: checkin[getRandomIntInclusive (0, checkin.length - 1)],
      checkout: checkout[getRandomIntInclusive (0, checkout.length - 1)],
      // should be random length - to be corrected
      features: features[0],
      description: '',
      photos: photos
    },
    location: {
      x: locX,
      y: locY
    }
  }
  postings.push(newPosting);
  return postings;
};

// creates an array of posting objects
for (var i = 0; i < postingsNumber; i++) {
  generatePosting(avatars, TITLE, TYPE, CHECKIN, CHECKOUT, FEATURES, PHOTOS);
};

var map = document.querySelector('.map');
map.classList.remove('map--faded');
var fragment = document.createDocumentFragment();

var mapPins = document.querySelector('.map__pins');
var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

// creates one pin based on the template
var createPin = function (postingData) {
  var pinElement = pinTemplate.cloneNode(true);
  pinElement.style.left = postingData.location.x - 25 + 'px';
  pinElement.style.top = postingData.location.y - 70 + 'px';
  pinElement.querySelector('img').src = postingData.author.avatar;
  pinElement.querySelector('img').alt = postingData.offer.title;
  return pinElement;
}

// creates pins and appends them to fragment element
for (var j = 0; j < postings.length; j++) {
  fragment.appendChild(createPin(postings[j]));
}

// renders pins
map.appendChild(fragment);
