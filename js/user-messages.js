'use strict';

(function () {

  window.userMessages = {
    // Show success popup
    onLoad: function () {
      // Reset page
      window.form.resetPage();

      // Show success popup
      var successTemplate = document.querySelector('#success').content.querySelector('.success');
      var successPopup = successTemplate.cloneNode(true);
      window.sharedVariables.pageMain.appendChild(successPopup);

      var onSuccessPopupClick = function () {
        window.util.removeElement(successPopup);
        document.removeEventListener('click', onSuccessPopupClick);
        document.removeEventListener('keydown', onSuccessPopupEscPress);
      };

      var onSuccessPopupEscPress = function (evt) {
        window.util.isEscEvent(evt, onSuccessPopupClick);
      };

      // Event Handlers to close success popup
      document.addEventListener('click', onSuccessPopupClick);
      document.addEventListener('keydown', onSuccessPopupEscPress);
    },

    // Show error popup
    onError: function (uploadError) {
      var errorTemplate = document.querySelector('#error').content.querySelector('.error');
      var errorPopup = errorTemplate.cloneNode(true);
      errorPopup.querySelector('.error__message').textContent = uploadError;
      window.sharedVariables.pageMain.appendChild(errorPopup);

      var onErrorPopupClick = function () {
        window.util.removeElement(errorPopup);
        document.removeEventListener('click', onErrorPopupClick);
        document.removeEventListener('keydown', onErrorPopupEscPress);
      };

      var onErrorPopupEscPress = function (evt) {
        window.util.isEscEvent(evt, onErrorPopupClick);
      };

      // Event Handlers to close error popup
      var errorButton = errorPopup.querySelector('.error__button');
      errorButton.addEventListener('click', onErrorPopupClick);
      document.addEventListener('click', onErrorPopupClick);
      document.addEventListener('keydown', onErrorPopupEscPress);
    }
  };
})();
