'use strict';

(function () {
  var filtersContainer = document.querySelector('.map__filters-container');
  var filters = document.querySelector('.map__filters');
  var filtersSelect = filters.querySelectorAll('select');
  var filtersFieldset = filters.querySelector('fieldset');
  var adForm = document.querySelector('.ad-form');
  var adFormFieldsets = adForm.querySelectorAll('fieldset');

  window.sharedVariables = {
    filtersContainer: filtersContainer,
    filters: filters,
    filtersSelect: filtersSelect,
    filtersFieldset: filtersFieldset,
    adForm: adForm,
    adFormFieldsets: adFormFieldsets
  };
})();