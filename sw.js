const CACHE = 'clima-peba-v2';
const ARQUIVOS = [
  './app_chuva.html',
  './index.html',
  './manifest.json',
  './icone_app.png',
  './header_banner.jpg',
  './av_verao.jpg',
  './av_inverno.jpg',
  './av_outono.jpg',
  './av_primavera.jpg',
  './tempo_verao.jpg',
  './tempo_inverno.jpg',
  './tempo_outono.jpg',
  './tempo_primavera.jpg'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ARQUIVOS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = e.request.url;
  if (url.includes('power.larc.nasa.gov') || url.includes('open-meteo.com')) return;
  e.respondWith(
    caches.match(e.request).then(resp => resp || fetch(e.request).then(r => {
      if (r && r.status === 200 && r.type === 'basic') {
        const copy = r.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
      }
      return r;
    }).catch(() => caches.match('./app_chuva.html')))
  );
});