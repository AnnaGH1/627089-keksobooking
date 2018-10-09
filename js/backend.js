'use strict';

(function () {

  window.backend = {
    // Downloads postings data from server
    load: function (onLoad, onError) {
      var URL = 'https://js.dump.academy/keksobooking/data';
      var request = new XMLHttpRequest();
      request.resposeType = 'json';

      request.addEventListener('load', function () {
        var error;
        switch (request.status) {
          case 200:
            onLoad(request.response);
            break;
          case 400:
            error = 'Неверный запрос';
            break;
          case 401:
            error = 'Пользователь не авторизован';
            break;
          case 404:
            error = 'Ничего не найдено';
            break;

          default:
            error = 'Ошибка загрузки, статус ответа: ' + request.status;
        }

        if (error) {
          onError(error);
        }

      });

      request.open('GET', URL);
      request.send();
    },

    // Uploads form data to server
    upload: function (data, onLoad, onError) {
      var URL = 'https://js.dump.academy/keksobooking';
      var request = new XMLHttpRequest();
      request.resposeType = 'json';

      request.addEventListener('load', function () {
        var error;
        switch (request.status) {
          case 200:
            onLoad();
            break;
          case 400:
            error = 'Неверный запрос';
            break;
          case 401:
            error = 'Пользователь не авторизован';
            break;
          case 404:
            error = 'Ничего не найдено';
            break;

          default:
            error = 'Ошибка загрузки, статус ответа: ' + request.status;
        }

        if (error) {
          onError(error);
        }
      });

      request.open('POST', URL);
      request.send(data);
    }
  };
})();
