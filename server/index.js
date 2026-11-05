import 'dotenv/config';
import { createStore } from './store.js';
import { createApp } from './app.js';
const store=await createStore();
const server=createApp(store).listen(Number(process.env.PORT||4000),'127.0.0.1',()=>console.log(`Campus API: http://127.0.0.1:${process.env.PORT||4000} (${store.mode})`));
for(const signal of ['SIGTERM','SIGINT'])process.on(signal,()=>server.close(async()=>{await store.close();process.exit(0);}));
