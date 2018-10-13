'use strict';

(function () {
  var POSTINGS_NUMBER_LIMIT = 5;

  var CHECKIN_TIME = {
    'option1': '12:00',
    'option2': '13:00',
    'option3': '14:00',
  };

  var CHECKOUT_TIME = {
    'option1': '12:00',
    'option2': '13:00',
    'option3': '14:00',
  };


  var pageMain = document.querySelector('main');
  var filtersContainer = document.querySelector('.map__filters-container');
  var filters = document.querySelector('.map__filters');
  var filtersSelect = filters.querySelectorAll('select');
  var filtersFieldset = filters.querySelector('fieldset');
  var adForm = document.querySelector('.ad-form');
  var adFormFieldsets = adForm.querySelectorAll('fieldset');
  var adFormReset = adForm.querySelector('.ad-form__reset');
  var pinMain = document.querySelector('.map__pin--main');

  window.sharedVariables = {
    POSTINGS_NUMBER_LIMIT: POSTINGS_NUMBER_LIMIT,
    CHECKIN_TIME: CHECKIN_TIME,
    CHECKOUT_TIME: CHECKOUT_TIME,
    pageMain: pageMain,
    filtersContainer: filtersContainer,
    filters: filters,
    filtersSelect: filtersSelect,
    filtersFieldset: filtersFieldset,
    adForm: adForm,
    adFormFieldsets: adFormFieldsets,
    adFormReset: adFormReset,
    pinMain: pinMain
  };
})();
