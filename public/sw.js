const CACHE_NAME='techu-v7';
const VERSION='v7';
self.addEventListener('install', e=>{
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(['/offline','/','/sell'])));
});
self.addEventListener('activate', e=>{
  e.waitUntil(
    caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k))))
    .then(()=>self.clients.claim())
  );
});
self.addEventListener('fetch', e=>{
  const url=new URL(e.request.url);
  const req=e.request;
  if(req.method!=='GET') return;
  // SECURITY: Network-only for API, Supabase, Admin - old bundle cannot bypass RLS
  if(url.pathname.startsWith('/api/')||url.hostname.includes('supabase.co')||url.pathname.startsWith('/admin')){
    e.respondWith(fetch(req));
    return;
  }
  if(req.mode==='navigate'){
    e.respondWith(fetch(req).then(res=>{ const copy=res.clone(); caches.open(CACHE_NAME).then(c=>c.put(req,copy)); return res; }).catch(()=>caches.match('/offline')));
    return;
  }
  e.respondWith(caches.match(req).then(cached=>cached||fetch(req).then(res=>{ const copy=res.clone(); caches.open(CACHE_NAME).then(c=>c.put(req,copy)); return res; })));
});
