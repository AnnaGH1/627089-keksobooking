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
var minLocX = 100;
var maxLocX = document.body.clientWidth - 100;
var minLocY = 130;
var maxLocY = 630;
var postingsNumber = 8;

// new avatar and avatars array variables
var newAvatar;
var avatars = [];

// creates one avatar
var generateAvatar = function (avatarNumber) {
  newAvatar = 'img/avatars/user' + 0 + avatarNumber + '.png';
  return newAvatar;
};

// creates an array of avatars
for (var a = 1; a <= postingsNumber; a++) {
  avatars.push(generateAvatar(a));
}

// gets a random integer between two values, inclusive
var getRandomIntInclusive = function (min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// selects random items from an array without duplicates
var selectRandomNoRepeat = function (array) {
  var selection = [];
  array.forEach(function (item) {
    var flag = Math.round(Math.random());
    if (flag === 1) {
      selection.push(item);
    }
  });
  return selection;
};

var checkArrayContainsElement = function (array, element) {
  for (var i = 0; i < array.length; i++) {
    if (array[i] === element) {
      return true;
    }
  }
  return false;
};

var postings = [];

// creates one posting and adds it to an array
var generatePosting = function (avatar, title, type, checkin, checkout, features, photos) {
  var locX = getRandomIntInclusive(minLocX, maxLocX);
  var locY = getRandomIntInclusive(minLocY, maxLocY);
  var newPosting = {
    author: {
      avatar: avatar
    },
    offer: {
      title: title,
      address: locX.toString(10) + ', ' + locY.toString(10),
      price: getRandomIntInclusive(minPrice, maxPrice),
      type: type[getRandomIntInclusive(0, type.length - 1)],
      rooms: getRandomIntInclusive(minRooms, maxRooms),
      guests: getRandomIntInclusive(minGuests, maxGuests),
      checkin: checkin[getRandomIntInclusive(0, checkin.length - 1)],
      checkout: checkout[getRandomIntInclusive(0, checkout.length - 1)],
      features: selectRandomNoRepeat(features),
      description: '',
      photos: photos
    },
    location: {
      x: locX,
      y: locY
    }
  };
  postings.push(newPosting);
  return postings;
};

// creates an array of posting objects
for (var i = 0; i < postingsNumber; i++) {
  generatePosting(avatars[i], TITLE[i], TYPE, CHECKIN, CHECKOUT, FEATURES, PHOTOS);
}

var map = document.querySelector('.map');
map.classList.remove('map--faded');
var fragment = document.createDocumentFragment();

var mapPins = document.querySelector('.map__pins');
var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

// creates one pin based on the template
var createPin = function (postingData) {
  var pinElement = pinTemplate.cloneNode(true);
  pinElement.style.left = postingData.location.x - 50 / 2 + 'px';
  pinElement.style.top = postingData.location.y - 70 + 'px';
  pinElement.querySelector('img').src = postingData.author.avatar;
  pinElement.querySelector('img').alt = postingData.offer.title;
  return pinElement;
};

// creates pins and appends them to fragment element
postings.forEach(function (item) {
  fragment.appendChild(createPin(item));
});

// renders pins
mapPins.appendChild(fragment);

var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');
var filters = document.querySelector('.map__filters-container');

// creates one card based on the template
var createCard = function (postingData) {
  var cardElement = cardTemplate.cloneNode(true);

  var typeRussian = function () {
    var offerType = postingData.offer.type;
    if (offerType === 'palace') {
      return 'Дворец';
    } else if (offerType === 'flat') {
      return 'Квартира';
    } else if (offerType === 'house') {
      return 'Дом';
    }
    return 'Бунгало';
  };

  var guestTextVariation = function () {
    var guestsNumber = postingData.offer.guests;
    if (guestsNumber === 1) {
      return guestsNumber + ' гостя';
    }
    return guestsNumber + ' гостей';
  };

  var fillFeaturesList = function () {
    var featuresList = cardElement.querySelector('.popup__features');
    var wifi = featuresList.querySelector('.popup__feature--wifi');
    var dishwasher = featuresList.querySelector('.popup__feature--dishwasher');
    var parking = featuresList.querySelector('.popup__feature--parking');
    var washer = featuresList.querySelector('.popup__feature--washer');
    var elevator = featuresList.querySelector('.popup__feature--elevator');
    var conditioner = featuresList.querySelector('.popup__feature--conditioner');

    var featuresAvailable = postingData.offer.features;
    var checkWiFi = checkArrayContainsElement(featuresAvailable, FEATURES[0]);
    var checkDishwasher = checkArrayContainsElement(featuresAvailable, FEATURES[1]);
    var checkParking = checkArrayContainsElement(featuresAvailable, FEATURES[2]);
    var checkWasher = checkArrayContainsElement(featuresAvailable, FEATURES[3]);
    var checkElevator = checkArrayContainsElement(featuresAvailable, FEATURES[4]);
    var checkConditioner = checkArrayContainsElement(featuresAvailable, FEATURES[5]);

    if (!checkWiFi) {
      wifi.classList.remove('popup__feature');
    }

    if (!checkDishwasher) {
      dishwasher.classList.remove('popup__feature');
    }

    if (!checkParking) {
      parking.classList.remove('popup__feature');
    }

    if (!checkWasher) {
      washer.classList.remove('popup__feature');
    }

    if (!checkElevator) {
      elevator.classList.remove('popup__feature');
    }

    if (!checkConditioner) {
      conditioner.classList.remove('popup__feature');
    }
    return featuresList;
  };

  var fillPhotoGallery = function () {
    var photoGallery = cardElement.querySelector('.popup__photos');
    var photoItem0 = photoGallery.querySelector('img');
    photoItem0.src = postingData.offer.photos[0];
    photoGallery.appendChild(photoItem0);
    var photoItem1 = photoItem0.cloneNode(true);
    photoItem1.src = postingData.offer.photos[1];
    photoGallery.appendChild(photoItem1);
    var photoItem2 = photoItem0.cloneNode(true);
    photoItem2.src = postingData.offer.photos[2];
    photoGallery.appendChild(photoItem2);
    return photoGallery;
  };

  cardElement.querySelector('.popup__title').textContent = postingData.offer.title;
  cardElement.querySelector('.popup__text--address').textContent = postingData.offer.address;
  cardElement.querySelector('.popup__text--price').textContent = postingData.offer.price + '₽/ночь';
  cardElement.querySelector('.popup__type').textContent = typeRussian();
  cardElement.querySelector('.popup__text--capacity').textContent = postingData.offer.rooms + ' комнаты для ' + guestTextVariation();
  cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + postingData.offer.checkin + ', выезд до ' + postingData.offer.checkout;
  fillFeaturesList();
  cardElement.querySelector('.popup__description').textContent = postingData.offer.description;
  fillPhotoGallery();

  cardElement.querySelector('.popup__avatar').src = postingData.author.avatar;

  return cardElement;
};

postings.forEach(function (item) {
  fragment.appendChild(createCard(item));
});

map.insertBefore(fragment, filters);
