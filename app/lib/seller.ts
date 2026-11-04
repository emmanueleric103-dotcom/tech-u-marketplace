export function getSellerId(){ if(typeof window==='undefined') return null; return localStorage.getItem('techu-seller-id') }
export function setSellerId(id:string){ localStorage.setItem('techu-seller-id', id) }
export function isUUID(s:string){ return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s) }
