import 'dotenv/config';
import { createStore } from './store.js';
import { createApp } from './app.js';
if(process.env.NODE_ENV==='production'&&!process.env.DATABASE_URL)throw new Error('DATABASE_URL is required in production to preserve data across deploys');
const host=process.env.HOST||(process.env.NODE_ENV==='production'?'0.0.0.0':'127.0.0.1');
const store=await createStore();
const server=createApp(store).listen(Number(process.env.PORT||4000),host,()=>console.log(`Campus API: http://${host}:${process.env.PORT||4000} (${store.mode})`));
for(const signal of ['SIGTERM','SIGINT'])process.on(signal,()=>server.close(async()=>{await store.close();process.exit(0);}));
