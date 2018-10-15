'use strict';

(function () {
  var PIN_MAIN = {
    'width': window.sharedVariables.pinMain.offsetWidth,
    'height': window.sharedVariables.pinMain.offsetHeight,
    'widthHalf': window.sharedVariables.pinMain.offsetWidth / 2,
    'heightHalf': window.sharedVariables.pinMain.offsetHeight / 2
  };

  // Reference to elements used in page activation
  var map = document.querySelector('.map');
  var fragment = document.createDocumentFragment();
  var mapPins = document.querySelector('.map__pins');
  var address = window.sharedVariables.adForm.querySelector('#address');
  var allPins;
  var allCards;
  var pageActive = false;

  // Inactive mode - map, form, filters
  var setInactiveMode = function () {
    // Inactive mode - map
    map.classList.add('map--faded');

    // Inactive mode - form
    window.sharedVariables.adForm.classList.add('ad-form--disabled');
    window.sharedVariables.adFormFieldsets.forEach(window.util.setDisabled);

    // Inactive mode - filters
    window.sharedVariables.filtersSelect.forEach(window.util.setDisabled);
    window.util.setDisabled(window.sharedVariables.filtersFieldset);

    // Inactive mode - Main pin - default location
    var resetLeft = '570px';
    var resetTop = '375px';
    window.sharedVariables.pinMain.style.left = resetLeft;
    window.sharedVariables.pinMain.style.top = resetTop;

    // Inactive mode - Address field - coordinates adjusted for main pin shape
    address.value = Math.round(window.util.stylePxToNumber(resetLeft) + PIN_MAIN.widthHalf) + ', ' + Math.round(window.util.stylePxToNumber(resetTop) + PIN_MAIN.heightHalf);
  };

  setInactiveMode();

  // Active mode - map, form, filters
  var setActiveMode = function () {
    // Active mode - map
    map.classList.remove('map--faded');
    // Active mode - form
    window.sharedVariables.adForm.classList.remove('ad-form--disabled');
    window.sharedVariables.adFormFieldsets.forEach(window.util.removeDisabled);
    // Active mode - filters
    window.sharedVariables.filtersSelect.forEach(window.util.removeDisabled);
    window.util.removeDisabled(window.sharedVariables.filtersFieldset);
  };

  // Remove pins and cards currently rendered
  var removePostings = function () {
    var allPinsCurrent = map.querySelectorAll('.map__pin--posting');
    var allCardsCurrent = map.querySelectorAll('.popup');

    allPinsCurrent.forEach(function (element) {
      element.remove();
    });
    allCardsCurrent.forEach(function (element) {
      element.remove();
    });
  };

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

      var offsetLeftCurrent = window.sharedVariables.pinMain.offsetLeft - shift.x;
      var offsetTopCurrent = window.sharedVariables.pinMain.offsetTop - shift.y;

      // Limits the area of pin location
      if (window.sharedVariables.pinMain.offsetLeft < window.data.LOCATION.minX) {
        window.sharedVariables.pinMain.style.left = 0 + 'px';
      } else if (window.sharedVariables.pinMain.offsetLeft > (window.data.LOCATION.maxX - PIN_MAIN.width)) {
        window.sharedVariables.pinMain.style.left = (window.data.LOCATION.maxX - PIN_MAIN.width) + 'px';
      } else if (window.sharedVariables.pinMain.offsetTop < (window.data.LOCATION.minY - PIN_MAIN.height)) {
        window.sharedVariables.pinMain.style.top = window.data.LOCATION.minY + 'px';
      } else if (window.sharedVariables.pinMain.offsetTop > (window.data.LOCATION.maxY - PIN_MAIN.height)) {
        window.sharedVariables.pinMain.style.top = (window.data.LOCATION.maxY - PIN_MAIN.height) + 'px';
      } else {
        window.sharedVariables.pinMain.style.left = offsetLeftCurrent + 'px';
        window.sharedVariables.pinMain.style.top = offsetTopCurrent + 'px';
      }

      // Address field - Coordinates adjusted for pin shape are updated during mousemove
      address.value = Math.round((window.util.stylePxToNumber(window.sharedVariables.pinMain.style.left) + PIN_MAIN.widthHalf)) + ', ' + Math.round((window.util.stylePxToNumber(window.sharedVariables.pinMain.style.top) + PIN_MAIN.height));
    };

    // Activates form and filters, shows similar postings once
    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      // Address field - Coordinates adjusted for pin shape are updated on mouseup
      address.value = Math.round((window.util.stylePxToNumber(window.sharedVariables.pinMain.style.left) + PIN_MAIN.widthHalf)) + ', ' + Math.round((window.util.stylePxToNumber(window.sharedVariables.pinMain.style.top) + PIN_MAIN.height));

      setActiveMode();

      if (!window.map.pageActive) {
        showPostings(window.util.limitElementsNumber(window.data.postings, window.sharedVariables.POSTINGS_NUMBER_LIMIT));
      }

      // Change page state to active
      pageActive = true;
      window.map.pageActive = pageActive;

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  // Shows any number of postings
  var showPostings = function (array) {
    // Creates pins, adds IDs (equal to pin element index and posting index), registers Event Handler, and appends them to fragment element
    array.forEach(function (item, index) {
      var pin = window.pin.createPin(item);
      pin.setAttribute('id', index);
      pin.addEventListener('mouseup', onPinMouseup);
      fragment.appendChild(pin);
    });

    // Renders pins
    mapPins.appendChild(fragment);

    // Gets reference to pins
    allPins = map.querySelectorAll('.map__pin--posting');

    // Creates cards, adds class 'hidden', and appends them to fragment element
    array.forEach(function (item) {
      var card = window.card.createCard(item);
      card.classList.add('hidden');
      fragment.appendChild(card);
    });

    // Renders cards
    map.insertBefore(fragment, window.sharedVariables.filtersContainer);

    // Gets reference to cards
    allCards = map.querySelectorAll('.popup');
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
  window.sharedVariables.pinMain.addEventListener('mousedown', onPinMainMousedown);

  window.map = {
    pageActive: pageActive,
    setInactiveMode: setInactiveMode,
    setActiveMode: setActiveMode,
    removePostings: removePostings,
    showPostings: showPostings
  };
})();
