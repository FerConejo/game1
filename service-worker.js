const CACHE_NAME = 'numeros-1-al-100-v6';
const languages = ['es', 'en', 'fr'];
const audioFiles = [
  'welcome_{lang}.mp3',
  'win_{lang}.mp3',
  'score_{lang}.mp3'
];
// Generar correct_1.mp3 a correct_100.mp3 y wrong_1.mp3 a wrong_100.mp3
for (let i = 1; i <= 100; i++) {
  audioFiles.push(`correct_{lang}_${i}.mp3`);
  audioFiles.push(`wrong_{lang}_${i}.mp3`);
}
// Generar round_1.mp3 a round_10.mp3
for (let i = 1; i <= 10; i++) {
  audioFiles.push(`round_{lang}_${i}.mp3`);
}

const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/p5.min.js',
  '/icon-192.png',
  '/icon-512.png'
];

// Añadir audios para cada idioma
languages.forEach(lang => {
  audioFiles.forEach(file => {
    urlsToCache.push(`/audio/${lang}/${file.replace('{lang}', lang)}`);
  });
});

self.addEventListener('install', event => {
  console.log('Service Worker: Instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Cacheando recursos:', urlsToCache.length, 'archivos');
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.error('Service Worker: Error al cachear recursos:', error);
      })
  );
});

self.addEventListener('fetch', event => {
  console.log('Service Worker: Interceptando fetch:', event.request.url);
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          console.log('Service Worker: Recurso encontrado en caché:', event.request.url);
          return response;
        }
        console.log('Service Worker: Buscando recurso en red:', event.request.url);
        return fetch(event.request).catch(error => {
          console.error('Service Worker: Error en fetch:', error);
        });
      })
  );
});

self.addEventListener('activate', event => {
  console.log('Service Worker: Activando...');
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log('Service Worker: Eliminando caché antiguo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});