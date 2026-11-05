import { readFile, writeFile, mkdir, rename } from 'node:fs/promises';
import path from 'node:path';
import pg from 'pg';
import { seed } from './seed.js';
export async function createStore({url=process.env.DATABASE_URL,file=path.resolve('data/campus.json'),demo=process.env.SEED_DEMO==='true'}={}) {
  const empty=()=>({users:[],students:[],teachers:[],classes:[],attendance:[],results:[],fees:[],timetable:[],activity:[]});
  let pool, state, queue=Promise.resolve();
  if(url){pool=new pg.Pool({connectionString:url});await pool.query('CREATE TABLE IF NOT EXISTS campus_state (id integer PRIMARY KEY CHECK (id = 1), data jsonb NOT NULL)');const r=await pool.query('SELECT data FROM campus_state WHERE id=1');if(!r.rowCount){const initial=demo?await seed():empty();await pool.query('INSERT INTO campus_state(id,data) VALUES(1,$1) ON CONFLICT DO NOTHING',[JSON.stringify(initial)]);}}
  else {await mkdir(path.dirname(file),{recursive:true});try{state=JSON.parse(await readFile(file,'utf8'));}catch(e){if(e.code!=='ENOENT')throw e;state=demo?await seed():empty();await writeFile(file,JSON.stringify(state,null,2));}}
  return {mode:pool?'PostgreSQL':'Local demo',async read(){if(pool)return (await pool.query('SELECT data FROM campus_state WHERE id=1')).rows[0].data;await queue;return structuredClone(state);},async update(fn){const task=queue.then(async()=>{if(pool){const client=await pool.connect();try{await client.query('BEGIN');const r=await client.query('SELECT data FROM campus_state WHERE id=1 FOR UPDATE');const data=r.rows[0].data;const result=await fn(data);await client.query('UPDATE campus_state SET data=$1 WHERE id=1',[JSON.stringify(data)]);await client.query('COMMIT');return result;}catch(e){await client.query('ROLLBACK');throw e;}finally{client.release();}}const next=structuredClone(state);const result=await fn(next);await writeFile(file+'.tmp',JSON.stringify(next,null,2));await rename(file+'.tmp',file);state=next;return result;});queue=task.catch(()=>{});return task;},async close(){await queue;await pool?.end();}};
}
