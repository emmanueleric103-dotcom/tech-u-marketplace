import fs from 'fs'
import { createClient } from '@supabase/supabase-js'
const env = {}
for (const f of ['.env.local','.env']) {
  if (fs.existsSync(f)) {
    fs.readFileSync(f,'utf8').split('\n').forEach(l=>{
      const m = l.match(/^([^#=]+)=(.+)$/)
      if (m) env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g,'')
    })
  }
}
const url = env.NEXT_PUBLIC_SUPABASE_URL
const key = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY
if (!url || !key) { console.error('MISSING .env.local keys'); process.exit(1) }
const sb = createClient(url, key, { auth:{ persistSession:false } })
const dir = 'backup/2026-11-06-pre-firebase'
fs.mkdirSync(dir,{recursive:true})
async function exp(table,file){
  console.log('Exporting',table)
  let all=[], from=0
  while(true){
    const {data,error} = await sb.from(table).select('*').range(from,from+999).order('created_at',{ascending:true})
    if(error){ console.error(table,error.message); break }
    if(!data||!data.length) break
    all=all.concat(data)
    if(data.length<1000) break
    from+=1000
  }
  fs.writeFileSync(`${dir}/${file}`, JSON.stringify(all,null,2))
  console.log(` -> ${file}: ${all.length} rows`)
  return all
}
const sellers = await exp('sellers','sellers.json')
const products = await exp('products','products.json')
const subs = await exp('product_submissions','product_submissions.json')
const bot = sellers.find(s=>s.id==='ee6df90a-dd01-4d61-ae6c-7a80c1040941')
const zain = products.find(p=>p.id==='6ea1fcce-1bba-4af7-8a8e-7f05b0d851b4')
const ver = [
  'TECH-U BACKUP VERIFICATION',
  'Branch: backup/preserve-design-before-firebase',
  'Design: Artifact 46',
  '',
  `sellers: ${sellers.length}`,
  `products: ${products.length}`,
  `product_submissions: ${subs.length}`,
  `BotPilot ee6df90a: ${bot?'YES '+bot.business_name:'NOT FOUND'}`,
  `Zainab 6ea1fcce: ${zain?'YES '+zain.title+' seller_id='+zain.seller_id:'NOT FOUND'}`,
  `Zainab seller_id NULL: ${zain&&zain.seller_id===null?'YES - CORRECT':'CHECK'}`,
  'STATUS: READ-ONLY, NO DATA MODIFIED'
].join('\n')
fs.writeFileSync(`${dir}/VERIFICATION.txt`, ver)
console.log('\n'+ver)
console.log('\nDONE')
