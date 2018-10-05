'use strict';

(function () {
  var PIN_MAIN_WIDTH = 65;
  var PIN_MAIN_HEIGHT = 65;

  // Reference to elements used in page activation
  var map = document.querySelector('.map');
  var fragment = document.createDocumentFragment();
  var mapPins = document.querySelector('.map__pins');
  var pinMain = document.querySelector('.map__pin--main');
  var address = window.sharedVariables.adForm.querySelector('#address');
  var allPins;
  var allCards;
  var pageActive = false;

  // Inactive mode - Filters - disabled
  window.sharedVariables.filtersSelect.forEach(window.util.setDisabled);
  window.sharedVariables.filtersFieldset.setAttribute('disabled', '');

  // Inactive mode - Ad form - disabled
  window.sharedVariables.adFormFieldsets.forEach(window.util.setDisabled);

  // Inactive mode - Address field - coordinates adjusted for main pin shape
  address.value = Math.round(window.util.stylePxToNumber(pinMain.style.left) + PIN_MAIN_WIDTH / 2) + ', ' + Math.round(window.util.stylePxToNumber(pinMain.style.top) + PIN_MAIN_HEIGHT / 2);

  // Event Handler - activates page
  var onPinMainMousedown = function (evt) {
    evt.preventDefault();

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
      if (pinMain.offsetLeft < window.data.minLocX) {
        pinMain.style.left = 0 + 'px';
      } else if (pinMain.offsetLeft > (window.data.maxLocX - PIN_MAIN_WIDTH)) {
        pinMain.style.left = (window.data.maxLocX - PIN_MAIN_WIDTH) + 'px';
      } else if (pinMain.offsetTop < window.data.minLocY) {
        pinMain.style.top = window.data.minLocY + 'px';
      } else if (pinMain.offsetTop > window.data.maxLocY) {
        pinMain.style.top = window.data.maxLocY + 'px';
      } else {
        pinMain.style.left = offsetLeftCurrent + 'px';
        pinMain.style.top = offsetTopCurrent + 'px';
      }

      // Address field - Coordinates adjusted for pin shape are updated during mousemove
      address.value = Math.round((window.util.stylePxToNumber(pinMain.style.left) + PIN_MAIN_WIDTH / 2)) + ', ' + Math.round((window.util.stylePxToNumber(pinMain.style.top) + PIN_MAIN_HEIGHT));
    };

    // Activates form and filters, shows similar postings once
    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      // Address field - Coordinates adjusted for pin shape are updated on mouseup
      address.value = Math.round((window.util.stylePxToNumber(pinMain.style.left) + PIN_MAIN_WIDTH / 2)) + ', ' + Math.round((window.util.stylePxToNumber(pinMain.style.top) + PIN_MAIN_HEIGHT));

      map.classList.remove('map--faded');
      window.sharedVariables.adForm.classList.remove('ad-form--disabled');
      window.sharedVariables.adFormFieldsets.forEach(window.util.removeDisabled);
      window.sharedVariables.filtersSelect.forEach(window.util.removeDisabled);
      window.util.removeDisabled(window.sharedVariables.filtersFieldset);

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

  // Shows other postings
  var showSimilarPostings = function () {
    // Creates pins, adds IDs (equal to pin element index and posting index), registers Event Handler, and appends them to fragment element
    window.data.postings.forEach(function (item, index) {
      var pin = window.pin.createPin(item);
      pin.setAttribute('id', index);
      pin.addEventListener('mouseup', onPinMouseup);
      fragment.appendChild(pin);
    });

    // Renders pins
    mapPins.appendChild(fragment);

    // Gets reference to pins
    allPins = map.getElementsByClassName('map__pin--posting');

    // Creates cards, adds class 'hidden', and appends them to fragment element
    window.data.postings.forEach(function (item) {
      var card = window.card.createCard(item);
      card.classList.add('hidden');
      fragment.appendChild(card);
    });

    // Renders cards
    map.insertBefore(fragment, window.sharedVariables.filtersContainer);

    // Gets reference to cards
    allCards = map.getElementsByClassName('popup');
  };

  // Event Handler - opens a card corresponding to the pin
  var onPinMouseup = function (evt) {
    var postingIndex = evt.currentTarget.id;

    var onPopupEscPress = function (escEvt) {
      window.util.isEscEvent(escEvt, closePopup);
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
          document.removeEventListener('keydown', onPopupEscPress);
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

  // Event Handler registered on main pin
  pinMain.addEventListener('mousedown', onPinMainMousedown);
})();
