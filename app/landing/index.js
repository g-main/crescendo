(function() {
  const createRoomEl = document.getElementById('create-room');

  function httpGet(url) {
    const promise = new Promise((resolve, reject) => {
      const request = new XMLHttpRequest();

      request.onreadystatechange = () => {
        if (request.readyState !== XMLHttpRequest.DONE) {
          return;
        }

        if (request.status === 200) {
          resolve(request);
        } else {
          reject(request);
        }
      };
      request.open('GET', url, true);
      request.send();
    });

    return promise;
  }

  function handleCreateClick() {
    httpGet('/create').then((request) => {
      window.location = request.responseURL;
    });
  }

  createRoomEl.addEventListener('click', handleCreateClick);
})();
