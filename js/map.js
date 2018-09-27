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
  var removeDisabled = function (element) {
    element.removeAttribute('disabled');
    return element;
  };
  adForm.classList.remove('ad-form--disabled');
  adFormFieldsets.forEach(removeDisabled);
  filtersSelect.forEach(removeDisabled);
  filtersFieldset.removeAttribute('disabled');
  address.value = evt.clientX + ', ' + evt.clientY;

  // Creates pins, adds IDs (equal to pin element index and posting index), registers Event Handler, and appends them to fragment element
  postings.forEach(function (item, index) {
    var pin = createPin(item);
    pin.setAttribute('id', index);
    pin.addEventListener('mouseup', onPinMouseup);
    fragment.appendChild(pin);
  });

  // Renders pins
  mapPins.appendChild(fragment);

  // Gets reference to pins and adds IDs (equal to pin element index and posting index) to pins
  allPins = map.getElementsByClassName('map__pin--posting');

  // Creates cards, adds class 'hidden', and appends them to fragment element
  postings.forEach(function (item) {
    var card = createCard(item);
    card.classList.add('hidden');
    fragment.appendChild(card);
  });

  // Renders cards
  map.insertBefore(fragment, filtersContainer);

  // Gets reference to cards and adds class 'hidden'
  allCards = map.getElementsByClassName('popup');

  pinMain.removeEventListener('mouseup', onPinMainMouseup);
};

pinMain.addEventListener('mouseup', onPinMainMouseup);

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
