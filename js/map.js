'use strict';
var ESC_KEYCODE = 27;
var TITLE = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var TYPE = ['palace', 'flat', 'house', 'bungalo'];
var CHECKIN = ['12:00', '13:00', '14:00'];
var CHECKOUT = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var PIN_MAIN_WIDTH = 65;
var PIN_MAIN_HEIGHT = 65;
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
var allPins;
var allCards;

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

// Gets a random integer between two values, inclusive
var getRandomIntInclusive = function (min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Selects random items from an array without duplicates
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

// Checks if an array contains an element
var checkArrayContainsElement = function (array, element) {
  array.forEach(function (item) {
    if (item === element) {
      return true;
    }
    return false;
  });
};

// Creates one posting
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
var createPostingsArray = function () {
  for (var i = 0; i < postingsNumber; i++) {
    postings.push(generatePosting(avatars[i], TITLE[i], TYPE, CHECKIN, CHECKOUT, FEATURES, PHOTOS));
  }
  return postings;
};

createPostingsArray();

// Creates variables and gets reference to elements used in pins rendering
var map = document.querySelector('.map');
// map.classList.remove('map--faded');
var fragment = document.createDocumentFragment();

var mapPins = document.querySelector('.map__pins');
var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

// Creates one pin based on the template
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


// Creates one card based on the template
var createCard = function (postingData) {
  var cardElement = cardTemplate.cloneNode(true);

  // Replaces offer type in English by Russian translation
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

  // Word form correction in Russian
  var guestTextVariation = function () {
    var guestsNumber = postingData.offer.guests;
    if (guestsNumber === 1) {
      return guestsNumber + ' гостя';
    }
    return guestsNumber + ' гостей';
  };

  // Adds available features
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

  // Adds more img tags to template and corresponding photo paths
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
// Util function - Sets attribute 'disabled'
var setDisabled = function (element) {
  element.setAttribute('disabled', '');
  return element;
};
var adForm = document.querySelector('.ad-form');
var adFormFieldsets = adForm.querySelectorAll('fieldset');
adFormFieldsets.forEach(setDisabled);

// Filters form - select elements and fieldset elements disabled
var filtersSelect = filters.querySelectorAll('select');
filtersSelect.forEach(setDisabled);
var filtersFieldset = filters.querySelector('fieldset');
filtersFieldset.setAttribute('disabled', '');

// Util function - Converts style attribute value from string to number
var stylePxToNumber = function (stylePx) {
  var styleNumber = parseInt(stylePx.substring(0, stylePx.length - 2), 10);
  return styleNumber;
};

// Inactive mode - Get reference to main pin and address field
var pinMain = document.querySelector('.map__pin--main');
var address = adForm.querySelector('#address');

// Inactive mode - Address field - coordinates adjusted for main pin shape
address.value = Math.round(stylePxToNumber(pinMain.style.left) + PIN_MAIN_WIDTH / 2) + ', ' + Math.round(stylePxToNumber(pinMain.style.top) + PIN_MAIN_HEIGHT / 2);

// Page initial state - inactive
var pageActive = false;

// Event Handler - activates page once; changes location of main pin
var onPinMainMousedown = function (evt) {
  evt.preventDefault();

  // Changes pin appearance on mousedown
  pinMain.querySelector('svg').classList.add('hidden');
  pinMain.querySelector('img').style.top = '-18px';

  var startCoords = {
    x: evt.clientX,
    y: evt.clientY
  };

  // Changes location of main pin
  var onMouseMove = function (moveEvt) {
    moveEvt.preventDefault();

    var shift = {
      x: startCoords.x - moveEvt.clientX,
      y: startCoords.y - moveEvt.clientY
    };

    startCoords = {
      x: moveEvt.clientX,
      y: moveEvt.clientY
    };

    var offsetLeftCurrent = pinMain.offsetLeft - shift.x;
    var offsetTopCurrent = pinMain.offsetTop - shift.y;

    // Limits the area of pin location
    if (pinMain.offsetLeft < minLocX) {
      pinMain.style.left = 0 + 'px';
    } else if (pinMain.offsetLeft > (maxLocX - PIN_MAIN_WIDTH)) {
      pinMain.style.left = (maxLocX - PIN_MAIN_WIDTH) + 'px';
    } else if (pinMain.offsetTop < minLocY) {
      pinMain.style.top = minLocY + 'px';
    } else if (pinMain.offsetTop > maxLocY) {
      pinMain.style.top = maxLocY + 'px';
    } else {
      pinMain.style.left = offsetLeftCurrent + 'px';
      pinMain.style.top = offsetTopCurrent + 'px';
    }

    // Address field - Coordinates adjusted for pin shape are updated during mousemove
    address.value = Math.round((stylePxToNumber(pinMain.style.left) + PIN_MAIN_WIDTH / 2)) + ', ' + Math.round((stylePxToNumber(pinMain.style.top) + PIN_MAIN_HEIGHT));
  };

  // Activates form and filters, shows similar postings once
  var onMouseUp = function (upEvt) {
    upEvt.preventDefault();

    // Address field - Coordinates adjusted for pin shape are updated on mouseup
    address.value = Math.round((stylePxToNumber(pinMain.style.left) + PIN_MAIN_WIDTH / 2)) + ', ' + Math.round((stylePxToNumber(pinMain.style.top) + PIN_MAIN_HEIGHT));

    // Util function - Removes attribute 'disabled'
    var removeDisabled = function (element) {
      element.removeAttribute('disabled');
      return element;
    };

    adForm.classList.remove('ad-form--disabled');
    adFormFieldsets.forEach(removeDisabled);
    filtersSelect.forEach(removeDisabled);
    removeDisabled(filtersFieldset);

    if (!pageActive) {
      showSimilarPostings();
    }

    // Change page state to active
    pageActive = true;

    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
};

// Event Handler registered on main pin
pinMain.addEventListener('mousedown', onPinMainMousedown);

// Shows other postings
var showSimilarPostings = function () {
  // Creates pins, adds IDs (equal to pin element index and posting index), registers Event Handler, and appends them to fragment element
  postings.forEach(function (item, index) {
    var pin = createPin(item);
    pin.setAttribute('id', index);
    pin.addEventListener('mouseup', onPinMouseup);
    fragment.appendChild(pin);
  });

  // Renders pins
  mapPins.appendChild(fragment);

  // Gets reference to pins
  allPins = map.getElementsByClassName('map__pin--posting');

  // Creates cards, adds class 'hidden', and appends them to fragment element
  postings.forEach(function (item) {
    var card = createCard(item);
    card.classList.add('hidden');
    fragment.appendChild(card);
  });

  // Renders cards
  map.insertBefore(fragment, filtersContainer);

  // Gets reference to cards
  allCards = map.getElementsByClassName('popup');
};

// Event Handler for any pin
var onPinMouseup = function (evt) {
  var postingIndex = evt.currentTarget.id;

  var onPopupEscPress = function (evtKey) {
    if (evtKey.keyCode === ESC_KEYCODE) {
      closePopup();
    }
  };

  var closePopup = function () {
    allPins[postingIndex].classList.remove('map__pin--active');
    allCards[postingIndex].classList.add('hidden');
    document.removeEventListener('keydown', onPopupEscPress);
  };

  // Close previous card if open
  var closeOpenedCard = function () {
    for (var i = 0; i < allCards.length; i++) {
      if (!allCards[i].classList.contains('hidden')) {
        allPins[i].classList.remove('map__pin--active');
        allCards[i].classList.add('hidden');
        document.removeEventListener('keydown', onPopupEscPress); // does not work
      }
    }
  };

  closeOpenedCard();

  allPins[postingIndex].classList.add('map__pin--active');
  allCards[postingIndex].classList.remove('hidden');

  // Handlers to close popup
  document.addEventListener('keydown', onPopupEscPress);
  var popupCloseButton = allCards[postingIndex].querySelector('.popup__close');
  popupCloseButton.addEventListener('click', function () {
    closePopup();
  });
};

// Form validation - title
var adTitle = adForm.elements.title;
adTitle.addEventListener('invalid', function () {
  if (adTitle.validity.tooShort) {
    adTitle.setCustomValidity('Минимальная длина заголовка 30 символов');
  } else if (adTitle.validity.tooLong) {
    adTitle.setCustomValidity('Максимальная длина заголовка 100 символов');
  } else if (adTitle.validity.valueMissing) {
    adTitle.setCustomValidity('Обязательное поле');
  } else {
    adTitle.setCustomValidity('');
  }
});

// Form validation - price and property type
var adPrice = adForm.elements.price;
var propertyType = adForm.elements.type;
adPrice.addEventListener('invalid', function () {
  if (adPrice.validity.rangeOverflow) {
    adPrice.setCustomValidity('Максимальная цена 1 000 000');
  } else {
    adPrice.setCustomValidity('');
  }
});

var setMinPriceForEachType = function () {
  if (propertyType.value === 'palace') {
    adPrice.min = '10000';
    adPrice.placeholder = '10000';
  } else if (propertyType.value === 'house') {
    adPrice.min = '5000';
    adPrice.placeholder = '5000';
  } else if (propertyType.value === 'flat') {
    adPrice.min = '1000';
    adPrice.placeholder = '1000';
  } else {
    adPrice.placeholder = '0';
  }
};

propertyType.addEventListener('change', setMinPriceForEachType);

// Form validation - check-in/check-out times
var roomsSelect = adForm.elements.rooms;
var guestsSelect = adForm.elements.capacity;
var checkIn = adForm.elements.timein;
var checkOut = adForm.elements.timeout;

var matchCheckOut = function () {
  if (checkIn.value === '12:00') {
    checkOut.value = '12:00';
  } else if (checkIn.value === '13:00') {
    checkOut.value = '13:00';
  } else {
    checkOut.value = '14:00';
  }
};

var matchCheckIn = function () {
  if (checkOut.value === '12:00') {
    checkIn.value = '12:00';
  } else if (checkOut.value === '13:00') {
    checkIn.value = '13:00';
  } else {
    checkIn.value = '14:00';
  }
};

checkIn.addEventListener('change', matchCheckOut);
checkOut.addEventListener('change', matchCheckIn);

// Form validation - rooms capacity
var checkRoomsCapacity = function () {
  if (roomsSelect.value === '1' && guestsSelect.value !== '1') {
    guestsSelect.setCustomValidity('Не больше 1 гостя');
  } else if ((roomsSelect.value === '2' && guestsSelect.value === '3') || (roomsSelect.value === '2' && guestsSelect.value === '0')) {
    guestsSelect.setCustomValidity('Не больше 2 гостей');
  } else if (roomsSelect.value === '3' && guestsSelect.value === '0') {
    guestsSelect.setCustomValidity('Не больше 3 гостей');
  } else if (roomsSelect.value === '100' && guestsSelect.value !== '0') {
    guestsSelect.setCustomValidity('Не для гостей');
  } else {
    guestsSelect.setCustomValidity('');
  }
};

roomsSelect.addEventListener('change', checkRoomsCapacity);
guestsSelect.addEventListener('change', checkRoomsCapacity);
