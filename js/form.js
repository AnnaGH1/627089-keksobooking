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

  // Form validation - check-in/check-out times
  var roomsSelect = window.sharedVariables.adForm.elements.rooms;
  var guestsSelect = window.sharedVariables.adForm.elements.capacity;
  var checkIn = window.sharedVariables.adForm.elements.timein;
  var checkOut = window.sharedVariables.adForm.elements.timeout;

  var matchCheckOut = function () {
    if (checkIn.value === window.sharedVariables.CHECKIN_TIME.option1) {
      checkOut.value = window.sharedVariables.CHECKOUT_TIME.option1;
    } else if (checkIn.value === window.sharedVariables.CHECKIN_TIME.option2) {
      checkOut.value = window.sharedVariables.CHECKOUT_TIME.option2;
    } else {
      checkOut.value = window.sharedVariables.CHECKOUT_TIME.option3;
    }
  };

  var matchCheckIn = function () {
    if (checkOut.value === window.sharedVariables.CHECKOUT_TIME.option1) {
      checkIn.value = window.sharedVariables.CHECKIN_TIME.option1;
    } else if (checkOut.value === window.sharedVariables.CHECKOUT_TIME.option2) {
      checkIn.value = window.sharedVariables.CHECKIN_TIME.option2;
    } else {
      checkIn.value = window.sharedVariables.CHECKIN_TIME.option3;
    }
  };

  checkIn.addEventListener('change', matchCheckOut);
  checkOut.addEventListener('change', matchCheckIn);

  // Form validation - rooms capacity
  var checkRoomsCapacity = function () {
    if (roomsSelect.value === ROOMS_NUMBER.oneRoom && guestsSelect.value !== GUESTS_NUMBER.oneGuest) {
      guestsSelect.setCustomValidity('Не больше 1 гостя');
    } else if ((roomsSelect.value === ROOMS_NUMBER.twoRooms && guestsSelect.value === GUESTS_NUMBER.threeGuests) || (roomsSelect.value === ROOMS_NUMBER.twoRooms && guestsSelect.value === GUESTS_NUMBER.noGuests)) {
      guestsSelect.setCustomValidity('Не больше 2 гостей');
    } else if (roomsSelect.value === ROOMS_NUMBER.threeRooms && guestsSelect.value === GUESTS_NUMBER.noGuests) {
      guestsSelect.setCustomValidity('Не больше 3 гостей');
    } else if (roomsSelect.value === ROOMS_NUMBER.hundredRooms && guestsSelect.value !== GUESTS_NUMBER.noGuests) {
      guestsSelect.setCustomValidity('Не для гостей');
    } else {
      guestsSelect.setCustomValidity('');
    }
  };

  roomsSelect.addEventListener('change', checkRoomsCapacity);
  guestsSelect.addEventListener('change', checkRoomsCapacity);

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
  window.sharedVariables.adFormReset.addEventListener('mouseup', resetPage);
  window.sharedVariables.adFormReset.addEventListener('keydown', onFormResetEnterPress);

  window.sharedVariables.adForm.addEventListener('submit', function (evt) {
    window.backend.upload(new FormData(window.sharedVariables.adForm), window.userMessages.onLoad, window.userMessages.onError);
    evt.preventDefault();
  });

  window.form = {
    resetPage: resetPage
  };
})();
