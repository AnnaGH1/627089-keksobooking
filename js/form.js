'use strict';

(function () {
  var adForm = document.querySelector('.ad-form'); // defined in map.js


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
})();
