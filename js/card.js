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
        var wifiAvailable = window.util.checkArrayContainsElement(featuresAvailable, 'wifi');
        var dishwasherAvailable = window.util.checkArrayContainsElement(featuresAvailable, 'dishwasher');
        var parkingAvailable = window.util.checkArrayContainsElement(featuresAvailable, 'parking');
        var washerAvailable = window.util.checkArrayContainsElement(featuresAvailable, 'washer');
        var elevatorAvailable = window.util.checkArrayContainsElement(featuresAvailable, 'elevator');
        var conditionerAvailable = window.util.checkArrayContainsElement(featuresAvailable, 'conditioner');

        // Hide section if no features available
        if (featuresAvailable.length === 0) {
          window.util.hideElementDisplayNone(featuresList);
          return false;
        } else {
          if (!wifiAvailable) {
            window.util.hideElementDisplayNone(wifi);
          }
          if (!dishwasherAvailable) {
            window.util.hideElementDisplayNone(dishwasher);
          }
          if (!parkingAvailable) {
            window.util.hideElementDisplayNone(parking);
          }
          if (!washerAvailable) {
            window.util.hideElementDisplayNone(washer);
          }
          if (!elevatorAvailable) {
            window.util.hideElementDisplayNone(elevator);
          }
          if (!conditionerAvailable) {
            window.util.hideElementDisplayNone(conditioner);
          }
        }
        return featuresList;
      };

      // Add description if available
      var addDescription = function () {
        var description = cardElement.querySelector('.popup__description');
        if (description.textContent === '') {
          window.util.hideElementDisplayNone(description);
        }
        description.textContent = postingData.offer.description;
        return description;
      };

      // Adds more img tags to template and corresponding photo paths
      var fillPhotoGallery = function () {
        var photoGallery = cardElement.querySelector('.popup__photos');
        var photosAvailable = postingData.offer.photos;

        // Hide section if no photos available, render photos otherwise
        if (photosAvailable.length === 0) {
          window.util.hideElementDisplayNone(photoGallery);
          return false;
        } else {
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
        }
      };

      cardElement.querySelector('.popup__title').textContent = postingData.offer.title;
      cardElement.querySelector('.popup__text--address').textContent = postingData.offer.address;
      cardElement.querySelector('.popup__text--price').textContent = postingData.offer.price + '₽/ночь';
      cardElement.querySelector('.popup__type').textContent = typeRussian();
      cardElement.querySelector('.popup__text--capacity').textContent = postingData.offer.rooms + ' комнаты для ' + guestTextVariation();
      cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + postingData.offer.checkin + ', выезд до ' + postingData.offer.checkout;
      fillFeaturesList();
      addDescription();
      fillPhotoGallery();
      cardElement.querySelector('.popup__avatar').src = postingData.author.avatar;

      return cardElement;
    }
  };
})();
