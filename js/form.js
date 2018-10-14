'use strict';

(function () {
  var PROPERTY_PRICE_MIN = {
    'palace': 10000,
    'house': 5000,
    'flat': 1000,
    'bungalo': 0
  };

  var ROOMS_NUMBER = {
    'oneRoom': '1',
    'twoRooms': '2',
    'threeRooms': '3',
    'hundredRooms': '100'
  };

  var GUESTS_NUMBER = {
    'oneGuest': '1',
    'twoGuests': '2',
    'threeGuests': '3',
    'noGuests': '0'
  };

  // Form validation - title
  var adTitle = window.sharedVariables.adForm.elements.title;
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
  var adPrice = window.sharedVariables.adForm.elements.price;
  var propertyType = window.sharedVariables.adForm.elements.type;
  adPrice.addEventListener('invalid', function () {
    if (adPrice.validity.rangeOverflow) {
      adPrice.setCustomValidity('Максимальная цена 1 000 000');
    } else {
      adPrice.setCustomValidity('');
    }
  });

  var setMinPriceForEachType = function () {
    if (propertyType.value === 'palace') {
      adPrice.min = PROPERTY_PRICE_MIN.palace;
      adPrice.placeholder = PROPERTY_PRICE_MIN.palace;
    } else if (propertyType.value === 'house') {
      adPrice.min = PROPERTY_PRICE_MIN.house;
      adPrice.placeholder = PROPERTY_PRICE_MIN.house;
    } else if (propertyType.value === 'flat') {
      adPrice.min = PROPERTY_PRICE_MIN.flat;
      adPrice.placeholder = PROPERTY_PRICE_MIN.flat;
    } else {
      adPrice.min = PROPERTY_PRICE_MIN.bungalo;
      adPrice.placeholder = PROPERTY_PRICE_MIN.bungalo;
    }
  };

  propertyType.addEventListener('change', setMinPriceForEachType);

  // Form validation
  var roomsCapacity = window.sharedVariables.adForm.elements.rooms;
  var guestsCapacity = window.sharedVariables.adForm.elements.capacity;
  var checkIn = window.sharedVariables.adForm.elements.timein;
  var checkOut = window.sharedVariables.adForm.elements.timeout;

  // Event Handler on Checkin and Checkout Time change
  var onTimeChange = function (evt) {
    if (evt.currentTarget === checkIn) {
      checkOut.value = checkIn.value;
    } else {
      checkIn.value = checkOut.value;
    }
  };

  checkIn.addEventListener('change', onTimeChange);
  checkOut.addEventListener('change', onTimeChange);


  // Event Handler on rooms and guests capacity change
  var onCapacityChange = function () {
    if (roomsCapacity.value === ROOMS_NUMBER.oneRoom && guestsCapacity.value !== GUESTS_NUMBER.oneGuest) {
      guestsCapacity.setCustomValidity('Не больше 1 гостя');
    } else if ((roomsCapacity.value === ROOMS_NUMBER.twoRooms && guestsCapacity.value === GUESTS_NUMBER.threeGuests) || (roomsCapacity.value === ROOMS_NUMBER.twoRooms && guestsCapacity.value === GUESTS_NUMBER.noGuests)) {
      guestsCapacity.setCustomValidity('Не больше 2 гостей');
    } else if (roomsCapacity.value === ROOMS_NUMBER.threeRooms && guestsCapacity.value === GUESTS_NUMBER.noGuests) {
      guestsCapacity.setCustomValidity('Не больше 3 гостей');
    } else if (roomsCapacity.value === ROOMS_NUMBER.hundredRooms && guestsCapacity.value !== GUESTS_NUMBER.noGuests) {
      guestsCapacity.setCustomValidity('Не для гостей');
    } else {
      guestsCapacity.setCustomValidity('');
    }
  };

  roomsCapacity.addEventListener('change', onCapacityChange);
  guestsCapacity.addEventListener('change', onCapacityChange);

  // Reset page
  var resetPage = function () {
    // Clear form fields and filters
    window.sharedVariables.adForm.reset();
    window.sharedVariables.filters.reset();

    // Inactive mode - map, form, filters
    window.map.setInactiveMode();

    window.map.removePostings();

    // Update page status
    window.map.pageActive = false;
  };

  var onFormResetEnterPress = function (enterEvt) {
    window.util.isEnterEvent(enterEvt, resetPage);
  };

  // Event Listeners registered on form reset button
  window.sharedVariables.adFormReset.addEventListener('mouseup', function () {
    resetPage();
  });
  window.sharedVariables.adFormReset.addEventListener('keydown', onFormResetEnterPress);

  window.sharedVariables.adForm.addEventListener('submit', function (evt) {
    window.backend.upload(new FormData(window.sharedVariables.adForm), window.userMessages.onLoad, window.userMessages.onError);
    evt.preventDefault();
  });

  window.form = {
    resetPage: resetPage
  };
})();
