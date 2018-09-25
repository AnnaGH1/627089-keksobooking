'use strict';
var ESC_KEYCODE = 27;
var TITLE = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var TYPE = ['palace', 'flat', 'house', 'bungalo'];
var CHECKIN = ['12:00', '13:00', '14:00'];
var CHECKOUT = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var PIN_MAIN_SIZE = 65;
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
var allPins;
var allCards;

/** @function generateAvatar - creates one avatar path
*/
/**
* @param {number} avatarNumber - number from 1 to the last posting number
* @return {string}
*/
var generateAvatar = function (avatarNumber) {
  var newAvatar = 'img/avatars/user' + 0 + avatarNumber + '.png';
  return newAvatar;
};

// Creates an array of avatars
var avatars = [];
for (var a = 1; a <= postingsNumber; a++) {
  avatars.push(generateAvatar(a));
}

/**
@function getRandomIntInclusive - Gets a random integer between two values, inclusive
*/
/**
* @param {number} min - min value
* @param {number} max - max value
* @return {number}
*/
var getRandomIntInclusive = function (min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/** @function selectRandomNoRepeat - Selects random items from an array without duplicates
*/
/**
* @param {string[]} array - array of string elements to choose from
* @return {string[]} - array of randomly chosen elements
*/
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

/** @function checkArrayContainsElement - checks if an array contains an elements
*/
/**
* @param {(string[]|number[])} array - array of string or number elements
* @param {(string|number)} element - element being checked
* @return {boolean} - true if an array contains an element
*/
var checkArrayContainsElement = function (array, element) {
  for (var i = 0; i < array.length; i++) {
    if (array[i] === element) {
      return true;
    }
  }
  return false;
};

/** @function generatePosting - creates one posting
*/
/**
* @param {string} avatar - avatar path
* @param {string} title - posting title
* @param {string[]} type - array of type names
* @param {string[]} checkin - array of checkin times
* @param {string[]} checkout - array of checkout times
* @param {string[]} features - array of features
* @param {string[]} photos - array of photo paths
* @return {Object}
*/
var generatePosting = function (avatar, title, type, checkin, checkout, features, photos) {
  var locX = getRandomIntInclusive(minLocX, maxLocX);
  var locY = getRandomIntInclusive(minLocY, maxLocY);
  var posting = {
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
  return posting;
};

// Creates an array of posting objects
var postings = [];
for (var i = 0; i < postingsNumber; i++) {
  postings.push(generatePosting(avatars[i], TITLE[i], TYPE, CHECKIN, CHECKOUT, FEATURES, PHOTOS));
}

// Creates variables and gets reference to elements used in pins rendering
var map = document.querySelector('.map');
// map.classList.remove('map--faded');
var fragment = document.createDocumentFragment();

var mapPins = document.querySelector('.map__pins');
var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

/** @function createPin - creates one pin based on the template
*/
/**
* @param {Object} postingData - an object of posting data
* @return {node}
 */
var createPin = function (postingData) {
  var pinElement = pinTemplate.cloneNode(true);
  pinElement.style.left = postingData.location.x - 50 / 2 + 'px';
  pinElement.style.top = postingData.location.y - 70 + 'px';
  pinElement.querySelector('img').src = postingData.author.avatar;
  pinElement.querySelector('img').alt = postingData.offer.title;
  pinElement.classList.add('map__pin--posting');
  return pinElement;
};

// Creates variables and gets reference to elements used in pins rendering
var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');
var filtersContainer = document.querySelector('.map__filters-container');
var filters = document.querySelector('.map__filters');


/** @function createCard - creates one card based on the template
*/
/**
* @param {Object} postingData - data for one posting
* @return {node}
*/
var createCard = function (postingData) {
  var cardElement = cardTemplate.cloneNode(true);

  /** @function typeRussian - replaces offer type in English by Russian translation
  */
  /**
  * @return {string}
  */
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

  /** @function guestTextVariation - word form correction in Russian
  */
  /**
  * @return {string}
  */
  var guestTextVariation = function () {
    var guestsNumber = postingData.offer.guests;
    if (guestsNumber === 1) {
      return guestsNumber + ' гостя';
    }
    return guestsNumber + ' гостей';
  };

  /** @function fillFeaturesList - adds available features
  */
  /**
  * @return {node}
  */
  var fillFeaturesList = function () {
    var featuresList = cardElement.querySelector('.popup__features');
    var wifi = featuresList.querySelector('.popup__feature--wifi');
    var dishwasher = featuresList.querySelector('.popup__feature--dishwasher');
    var parking = featuresList.querySelector('.popup__feature--parking');
    var washer = featuresList.querySelector('.popup__feature--washer');
    var elevator = featuresList.querySelector('.popup__feature--elevator');
    var conditioner = featuresList.querySelector('.popup__feature--conditioner');

    var featuresAvailable = postingData.offer.features;
    var checkWiFi = checkArrayContainsElement(featuresAvailable, 'wifi');
    var checkDishwasher = checkArrayContainsElement(featuresAvailable, 'dishwasher');
    var checkParking = checkArrayContainsElement(featuresAvailable, 'parking');
    var checkWasher = checkArrayContainsElement(featuresAvailable, 'washer');
    var checkElevator = checkArrayContainsElement(featuresAvailable, 'elevator');
    var checkConditioner = checkArrayContainsElement(featuresAvailable, 'conditioner');

    if (featuresAvailable.length === 0) {
      featuresList.style.display = 'none';
      return false;
    } else {
      if (!checkWiFi) {
        wifi.style.display = 'none';
      }
      if (!checkDishwasher) {
        dishwasher.style.display = 'none';
      }
      if (!checkParking) {
        parking.style.display = 'none';
      }
      if (!checkWasher) {
        washer.style.display = 'none';
      }
      if (!checkElevator) {
        elevator.style.display = 'none';
      }
      if (!checkConditioner) {
        conditioner.style.display = 'none';
      }
    }
    return featuresList;
  };

  /** @function fillPhotoGallery - adds more img tags to template and corresponding photo paths
  */
  /**
  * @return {node}
  */
  var fillPhotoGallery = function () {
    var photoGallery = cardElement.querySelector('.popup__photos');
    var photoItem0 = photoGallery.querySelector('img');
    photoItem0.src = postingData.offer.photos[0];
    photoGallery.appendChild(photoItem0);
    var numberPhotosAfterFirst = postingData.offer.photos.length - 1;
    if (numberPhotosAfterFirst === 0) {
      return photoGallery;
    }
    for (var photoIndex = 1; photoIndex <= numberPhotosAfterFirst; photoIndex++) {
      var photoItem = photoItem0.cloneNode(true);
      photoItem.src = postingData.offer.photos[photoIndex];
      photoGallery.appendChild(photoItem);
    }
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

// Ad form - fieldset elements disabled
var adForm = document.querySelector('.ad-form');
var adFormFieldsets = adForm.querySelectorAll('fieldset');
adFormFieldsets.forEach(function (fieldset) {
  fieldset.setAttribute('disabled', '');
});

// Filters form - select elements and fieldset elements disabled
var filtersSelect = filters.querySelectorAll('select');
filtersSelect.forEach(function (section) {
  section.setAttribute('disabled', '');
});
var filtersFieldset = filters.querySelector('fieldset');
filtersFieldset.setAttribute('disabled', '');

// Main pin
var pinMain = document.querySelector('.map__pin--main');
var address = adForm.querySelector('#address');
var pinMainLocLeft = pinMain.style.left;
var pinMainLocTop = pinMain.style.top;
var pinMainLocLeftNumber = parseInt(pinMainLocLeft.substring(0, pinMainLocLeft.length - 2), 10);
var pinMainLocTopNumber = parseInt(pinMainLocTop.substring(0, pinMainLocTop.length - 2), 10);
address.value = Math.round(pinMainLocLeftNumber + PIN_MAIN_SIZE / 2) + ', ' + Math.round(pinMainLocTopNumber + PIN_MAIN_SIZE / 2);

// Activates page
var onPinMainMouseup = function (evt) {
  adFormFieldsets.forEach(function (fieldset) {
    fieldset.removeAttribute('disabled');
  });
  filtersSelect.forEach(function (section) {
    section.removeAttribute('disabled');
  });
  filtersFieldset.removeAttribute('disabled');
  address.value = evt.clientX + ', ' + evt.clientY;

  // Creates pins and appends them to fragment element
  postings.forEach(function (item) {
    fragment.appendChild(createPin(item));
  });

  // Renders pins
  mapPins.appendChild(fragment);

  // Gets reference to pins and adds IDs to pins
  allPins = map.getElementsByClassName('map__pin--posting');
  for (var p = 0; p < allPins.length; p++) {
    allPins[p].setAttribute('id', p);
  }

  // Creates cards and appends them to fragment element
  postings.forEach(function (item) {
    fragment.appendChild(createCard(item));
  });

  // Renders cards
  map.insertBefore(fragment, filtersContainer);


  // Gets reference to cards and adds class 'hidden'
  allCards = map.getElementsByClassName('popup');
  for (var c = 0; c < allCards.length; c++) {
    allCards[c].classList.add('hidden');
  }

  // Event Handler registered
  for (var h = 0; h < allPins.length; h++) {
    allPins[h].addEventListener('mouseup', onPinMouseup);
  }

  pinMain.removeEventListener('mouseup', onPinMainMouseup);
};

pinMain.addEventListener('mouseup', onPinMainMouseup);


// Event Handler for any pin
var onPinMouseup = function (evt) {
  var index = evt.currentTarget.id;

  // Close previous card if open
  for (var s = 0; s < allCards.length; s++) {
    if (!allCards[s].classList.contains('hidden')) {
      allCards[s].classList.add('hidden');
      allPins[s].classList.remove('map__pin--active');
    }
  }

  allPins[index].classList.add('map__pin--active');
  allCards[index].classList.remove('hidden');

  var closePopup = function () {
    allPins[index].classList.remove('map__pin--active');
    allCards[index].classList.add('hidden');
    document.removeEventListener('keydown', onPopupEscPress);
  };

  var onPopupEscPress = function (e) {
    if (e.keyCode === ESC_KEYCODE) {
      closePopup();
    }
  };

  // Handlers to close popup
  document.addEventListener('keydown', onPopupEscPress);
  var popupCloseButton = allCards[index].querySelector('.popup__close');
  popupCloseButton.addEventListener('click', function () {
    closePopup();
  });
};
