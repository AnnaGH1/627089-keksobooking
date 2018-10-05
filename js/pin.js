'use strict';

(function () {
  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

  window.pin = {
    // Creates one pin based on the template
    createPin: function (postingData) {
      var pinElement = pinTemplate.cloneNode(true);
      pinElement.style.left = postingData.location.x - 50 / 2 + 'px';
      pinElement.style.top = postingData.location.y - 70 + 'px';
      pinElement.querySelector('img').src = postingData.author.avatar;
      pinElement.querySelector('img').alt = postingData.offer.title;
      pinElement.classList.add('map__pin--posting');
      return pinElement;
    }
  };
})();
