'use strict';

(function () {
  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;


  window.util = {
    // Perform an action on Enter keyboard event
    isEnterEvent: function (evt, action) {
      if (evt.keyCode === ENTER_KEYCODE) {
        action();
      }
    },

    // Perform an action on Esc keyboard event
    isEscEvent: function (evt, action) {
      if (evt.keyCode === ESC_KEYCODE) {
        action();
      }
    },

    // Checks if an array contains an element
    checkArrayContainsElement: function (array, element) {
      for (var i = 0; i < array.length; i++) {
        if (array[i] === element) {
          return true;
        }
      }
      return false;
    },

    // Gets a random integer between two values, inclusive
    getRandomIntInclusive: function (min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    // Selects random items from an array without duplicates
    selectRandomNoRepeat: function (array) {
      var selection = [];
      array.forEach(function (item) {
        var flag = Math.round(Math.random());
        if (flag === 1) {
          selection.push(item);
        }
      });
      return selection;
    },

    // Sets attribute 'disabled'
    setDisabled: function (element) {
      element.setAttribute('disabled', '');
      return element;
    },

    // Removes attribute 'disabled'
    removeDisabled: function (element) {
      element.removeAttribute('disabled');
      return element;
    },

    // Converts style attribute value from string to number
    stylePxToNumber: function (stylePx) {
      var styleNumber = parseInt(stylePx.substring(0, stylePx.length - 2), 10);
      return styleNumber;
    },

    // Hides element
    hideElementDisplayNone: function (element) {
      element.style.display = 'none';
      return element;
    },

    // Removes element
    removeElement: function (element) {
      element.remove();
      return element;
    },

    // Limit array elements number
    limitElementsNumber: function (array, limit) {
      if (array.length > limit) {
        var selection = array.slice(0, limit);
        return selection;
      }
      return selection;
    }
  };
})();
