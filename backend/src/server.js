import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {AvatarService,avatarRouter,fileBudgetStore} from './liveavatar.js';
import {quoteStore} from '../../shared/feature-store.js';
import {createDemoAccount,validDemoState} from '../../shared/demo.js';
dotenv.config({path:new URL('../.env',import.meta.url),quiet:true});
const avatar=new AvatarService({store:fileBudgetStore(new URL('../.runtime/avatar-budget.json',import.meta.url))});
const cleanup=setInterval(()=>avatar.sweep().catch(()=>console.warn('Avatar cleanup pending; retrying on next sweep.')),5000);cleanup.unref();
const app=express(); app.use(express.json({limit:'256kb'}));
const State=mongoose.model('State',new mongoose.Schema({key:{type:String,unique:true},value:mongoose.Schema.Types.Mixed}));
const Event=mongoose.model('Event',new mongoose.Schema({type:String,detail:mongoose.Schema.Types.Mixed,actor:String,changes:[mongoose.Schema.Types.Mixed],createdAt:{type:Date,default:Date.now}}));
let connected=false;
if(process.env.MONGODB_URI){try{await mongoose.connect(process.env.MONGODB_URI,{serverSelectionTimeoutMS:3000});connected=true;}catch{console.warn('MongoDB unavailable; browser demo mode enabled.');}}
app.use('/api/liveavatar',avatarRouter(avatar));
app.get('/api/health',(_,res)=>res.json({mode:connected?'mongodb':'browser-demo'}));
app.use('/api',(_,res,next)=>connected?next():res.status(503).json({error:'Database unavailable. Use browser demo storage.'}));
app.get('/api/state',async(_,res)=>{let state=(await State.findOne({key:'demo'}))?.value;if(!validDemoState(state)){state=createDemoAccount();await State.findOneAndUpdate({key:'demo'},{value:state},{upsert:true});}res.json(state);});
app.put('/api/state',async(req,res)=>{if(!validDemoState(req.body))return res.status(400).json({error:'Invalid account state'});if(req.body.featureStore){try{req.body.featureStore.quote=quoteStore(req.body.featureStore.config);}catch{return res.status(400).json({error:'Invalid feature store configuration'});}}await State.findOneAndUpdate({key:'demo'},{value:req.body},{upsert:true});res.json({ok:true});});
app.post('/api/events',async(req,res)=>{if(typeof req.body.type!=='string')return res.status(400).json({error:'Event type required'});await Event.create({type:req.body.type,detail:req.body.detail,actor:req.body.actor,changes:Array.isArray(req.body.changes)?req.body.changes:[]});res.status(201).json({ok:true});});
app.get('/api/events',async(_,res)=>res.json(await Event.find().sort({createdAt:-1}).limit(200)));
const dist=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../frontend/dist');
app.use(express.static(dist));app.get('/{*path}',(_,res)=>res.sendFile(path.join(dist,'index.html')));
app.use((err,req,res,next)=>{console.error(err.message);res.status(500).json({error:'Unable to complete request'});});
const server=app.listen(process.env.PORT||4000,'127.0.0.1',()=>console.log('SSO+ API: http://127.0.0.1:'+(process.env.PORT||4000)));

for(const signal of ['SIGINT','SIGTERM'])process.once(signal,async()=>{clearInterval(cleanup);if(avatar.active)await avatar.stop(avatar.active.handle).catch(()=>{});server.close();await mongoose.disconnect();process.exit(0);});
