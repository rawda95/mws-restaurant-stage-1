var staticCacheName = 'restuarnt-static-v1';

self.addEventListener('install', function(event) {
  // TODO: cache /skeleton rather than the root page

  event.waitUntil(
    caches.open(staticCacheName).then(function(cache) {
      return cache.addAll([
      '/',
     '/css/styles.css',
     '/js/main.js',
     '/js/dbhelper.js',
     '/js/restaurant_info.js',
     '/data/restaurants.json',
     '/img',

      ]);
    })
  );
});



  self.addEventListener('fetch', function(event) {
    event.respondWith(
      caches.match(event.request)
        .then(function(response) {
          // Cache hit - return response
          if (response) {
            return response;
          }
  
          // IMPORTANT: Clone the request.
          var fetchRequest = event.request.clone();
  
          return fetch(fetchRequest).then(
            function(response) {
              // Check if we received a valid response
              if(!response || response.status !== 200) {
                return response;
              }
  
              // IMPORTANT: Clone the response. A response is a stream;
              var responseToCache = response.clone();
  
              caches.open(staticCacheName)
                .then(function(cache) {
                  cache.put(event.request, responseToCache);
                });
  
              return response;
            }
          );
        })
      );
  }); 

  
  self.addEventListener('activate', function(event) {
    console.log('activating serviceWorker');
    event.waitUntil(
      caches.keys().then(function(cacheNames) {
        return Promise.all(
          cacheNames.map(function(cacheName) {
            
              return caches.delete(cacheName);
            
          })
        );
      })
    );
  });
