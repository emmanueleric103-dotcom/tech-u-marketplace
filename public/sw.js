const CACHE_VERSION='techu-v6'
const STATIC_CACHE=`${CACHE_VERSION}-static`
const OFFLINE_URL='/offline'
const STATIC_ASSETS=[OFFLINE_URL,'/icons/icon-192x192.png','/icons/icon-512x512.png','/og-image.jpg']
self.addEventListener('install',(e)=>{
  e.waitUntil(caches.open(STATIC_CACHE).then(c=>c.addAll(STATIC_ASSETS)).then(()=>self.skipWaiting()))
})
self.addEventListener('activate',(e)=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==STATIC_CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))
})
self.addEventListener('fetch',(e)=>{
  const req=e.request
  const url=new URL(req.url)
  if(req.method!=='GET') return
  // NEVER cache admin, supabase, api, sell POST
  if(url.pathname.startsWith('/admin')||url.hostname.includes('supabase.co')||url.pathname.includes('/api')){
    e.respondWith(fetch(req))
    return
  }
  if(req.mode==='navigate'){
    e.respondWith(fetch(req).then(res=>{
      const copy=res.clone()
      caches.open(STATIC_CACHE).then(c=>c.put(req,copy))
      return res
    }).catch(()=>caches.match(req).then(r=>r||caches.match(OFFLINE_URL))))
    return
  }
  if(req.destination==='script'||req.destination==='style'||req.destination==='image'||url.pathname.startsWith('/icons/')||url.pathname.endsWith('.jpg')||url.pathname.endsWith('.png')){
    e.respondWith(caches.match(req).then(cached=>cached||fetch(req).then(res=>{
      const copy=res.clone()
      caches.open(STATIC_CACHE).then(c=>c.put(req,copy))
      return res
    })))
  }
})
