'use strict';

(function () {
  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;
  var PIN_WIDTH_HALF = PIN_WIDTH / 2;
  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

  window.pin = {
    // Creates one pin based on the template
    createPin: function (postingData) {
      var pinElement = pinTemplate.cloneNode(true);
      pinElement.style.left = postingData.location.x - PIN_WIDTH_HALF + 'px';
      pinElement.style.top = postingData.location.y - PIN_HEIGHT + 'px';
      pinElement.querySelector('img').src = postingData.author.avatar;
      pinElement.querySelector('img').alt = postingData.offer.title;
      pinElement.classList.add('map__pin--posting');
      return pinElement;
    }
  };
})();
