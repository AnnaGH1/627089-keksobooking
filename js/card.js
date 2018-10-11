'use strict';

(function () {
  var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');

  window.card = {
    // Creates one card based on the template
    createCard: function (postingData) {
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
        var checkWiFi = window.util.checkArrayContainsElement(featuresAvailable, 'wifi');
        var checkDishwasher = window.util.checkArrayContainsElement(featuresAvailable, 'dishwasher');
        var checkParking = window.util.checkArrayContainsElement(featuresAvailable, 'parking');
        var checkWasher = window.util.checkArrayContainsElement(featuresAvailable, 'washer');
        var checkElevator = window.util.checkArrayContainsElement(featuresAvailable, 'elevator');
        var checkConditioner = window.util.checkArrayContainsElement(featuresAvailable, 'conditioner');

        // Hide section if no features available
        if (featuresAvailable.length === 0) {
          window.util.hideElement(featuresList);
          return false;
        } else {
          if (!checkWiFi) {
            window.util.hideElement(wifi);
          }
          if (!checkDishwasher) {
            window.util.hideElement(dishwasher);
          }
          if (!checkParking) {
            window.util.hideElement(parking);
          }
          if (!checkWasher) {
            window.util.hideElement(washer);
          }
          if (!checkElevator) {
            window.util.hideElement(elevator);
          }
          if (!checkConditioner) {
            window.util.hideElement(conditioner);
          }
        }
        return featuresList;
      };

      // Adds more img tags to template and corresponding photo paths
      var fillPhotoGallery = function () {
        var photoGallery = cardElement.querySelector('.popup__photos');
        var photosAvailable = postingData.offer.features;

        // Hide section if no photos available
        if (photosAvailable.length === 0) {
          window.util.hideElement(photoGallery);
        }
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
    }
  };
})();
