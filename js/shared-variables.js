'use strict';

(function () {
  var POSTINGS_NUMBER_LIMIT = 5;

  var filters = document.querySelector('.map__filters');
  var filtersSelect = filters.querySelectorAll('select');
  var filtersFieldset = filters.querySelector('fieldset');
  var adForm = document.querySelector('.ad-form');
  var adFormFieldsets = adForm.querySelectorAll('fieldset');
  var adFormReset = adForm.querySelector('.ad-form__reset');

  window.sharedVariables = {
    POSTINGS_NUMBER_LIMIT: POSTINGS_NUMBER_LIMIT,
    filters: filters,
    filtersSelect: filtersSelect,
    filtersFieldset: filtersFieldset,
    adForm: adForm,
    adFormFieldsets: adFormFieldsets,
    adFormReset: adFormReset,
  };
})();
