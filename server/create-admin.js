import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'node:crypto';
import { createInterface } from 'node:readline/promises';
import { createStore } from './store.js';
const input=createInterface({input:process.stdin,output:process.stdout});
const name=(await input.question('Administrator name: ')).trim();
const email=(await input.question('Administrator email: ')).trim().toLowerCase();
input.close();
// Password is read from the environment so it is never echoed by this script.
const password=process.env.ADMIN_PASSWORD;
if(!name||!/^\S+@\S+\.\S+$/.test(email)||!password||password.length<12){console.error('Provide a name, valid email, and ADMIN_PASSWORD with at least 12 characters.');process.exit(1);}
const store=await createStore({demo:false});
try {const passwordHash=await bcrypt.hash(password,12);await store.update(data=>{if(data.users.some(u=>u.email.toLowerCase()===email))throw new Error('Account already exists');data.users.push({id:randomUUID(),name,email,role:'admin',passwordHash});});console.log('Administrator created.');}finally{await store.close();}
