import dotenv from 'dotenv';
import mongoose from 'mongoose';
import {createDemoAccount} from '../../shared/demo.js';
dotenv.config({path:new URL('../.env',import.meta.url),quiet:true});
if(!process.env.MONGODB_URI){console.error('Set MONGODB_URI in backend/.env. Browser mode already includes the presentation account.');process.exitCode=1;}
else{try{await mongoose.connect(process.env.MONGODB_URI,{serverSelectionTimeoutMS:5000});const State=mongoose.model('State',new mongoose.Schema({key:{type:String,unique:true},value:mongoose.Schema.Types.Mixed}));await State.findOneAndUpdate({key:'demo'},{value:createDemoAccount()},{upsert:true});console.log('Morgan presentation account seeded: DEMO-1042 · Alex Morgan (Owner). Avatar usage limits unchanged.');}catch{console.error('Demo seed failed. Verify MongoDB is running and MONGODB_URI is correct.');process.exitCode=1;}finally{await mongoose.disconnect();}}
