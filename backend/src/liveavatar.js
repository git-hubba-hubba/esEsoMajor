import {Router} from 'express';
import {readFile,mkdir,writeFile,rename} from 'node:fs/promises';
import {randomUUID} from 'node:crypto';
export const SANDBOX_AVATAR='dd73ea75-1218-4ef3-92ce-606d5f7fbc0a';
const BASE='https://api.liveavatar.com/v1';
export class AvatarError extends Error{constructor(message,status=502){super(message);this.status=status;}}
export function fileBudgetStore(file){return {
 async read(){try{return JSON.parse(await readFile(file,'utf8'))}catch(e){if(e.code==='ENOENT')return {};throw e;}},
 async write(value){await mkdir(new URL('.',file),{recursive:true});const temp=new URL('./avatar-budget.tmp',file);await writeFile(temp,JSON.stringify(value),{mode:0o600});await rename(temp,file);}
};}
export class AvatarService{
 constructor({env=process.env,fetcher=fetch,store,now=()=>Date.now()}={}){
  this.env=env;this.fetcher=fetcher;this.store=store;this.now=now;this.active=null;this.locked=false;this.voiceId=env.LIVEAVATAR_VOICE_ID;this.lastAttempt=0;
  this.sandbox=env.LIVEAVATAR_SANDBOX!=='false';
  this.duration=this.sandbox?60:Math.max(30,Math.min(120,Number(env.LIVEAVATAR_MAX_SECONDS)||120));
  this.limit=Math.max(1,Math.min(10,Number(env.LIVEAVATAR_DAILY_SESSION_LIMIT)||2));
 }
 async status(){const b=await this.store.read();return {configured:!!this.env.LIVEAVATAR_API_KEY,sandbox:this.sandbox,maxSeconds:this.duration,dailyLimit:this.limit,usedToday:b.date===new Date(this.now()).toISOString().slice(0,10)?b.starts||0:0,active:!!this.active};}
 async request(endpoint,body,token){
  const response=await this.fetcher(`${BASE}${endpoint}`,{method:body===undefined?'GET':'POST',headers:{'Content-Type':'application/json',...(token?{Authorization:`Bearer ${token}`}:{'X-API-KEY':this.env.LIVEAVATAR_API_KEY})},...(body===undefined?{}:{body:JSON.stringify(body)}),signal:AbortSignal.timeout(15000)});
  if(!response.ok)throw new AvatarError(response.status===401||response.status===403?'LiveAvatar rejected the server credentials. Check the API key.':response.status===429?'LiveAvatar rate limit reached. Continue with the local guide.':`LiveAvatar request failed (${response.status}). Continue with the local guide.`);
  const payload=await response.json();if(payload.code!==undefined&&payload.code!==100&&payload.code!==200)throw new AvatarError('LiveAvatar could not complete the request. Continue with the local guide.');return payload.data;
 }
 async start(){
  if(!this.env.LIVEAVATAR_API_KEY)throw new AvatarError('Configure LIVEAVATAR_API_KEY on the server first.',503);
  if(this.locked||this.active)throw new AvatarError('A live guide is already running or stopping. End it before starting another.',409);
  if(this.lastAttempt&&this.now()-this.lastAttempt<15000)throw new AvatarError('Please wait 15 seconds before another start attempt.',429);
  this.locked=true;this.lastAttempt=this.now();
  try{
   const budget=await this.store.read();const date=new Date(this.now()).toISOString().slice(0,10);
   // A prior process may have stopped without running its cleanup handler.
   if(budget.activeSessionId){await this.request('/sessions/stop',{session_id:budget.activeSessionId,reason:'USER_CLOSED'});delete budget.activeSessionId;await this.store.write(budget);}
   if(budget.date===date&&budget.starts>=this.limit)throw new AvatarError('Daily live-session limit reached. The local guide remains available. Adjust the server limit for your presentation if needed.',429);
   const avatarId=this.sandbox?SANDBOX_AVATAR:this.env.LIVEAVATAR_AVATAR_ID;
   if(!avatarId)throw new AvatarError('Set LIVEAVATAR_AVATAR_ID before enabling paid mode.',503);
   if(!this.voiceId){const avatar=await this.request(`/avatars/${avatarId}`);this.voiceId=avatar?.default_voice?.id;if(!this.voiceId)throw new AvatarError('Set LIVEAVATAR_VOICE_ID to an available LiveAvatar voice.',503);}
   // Reserve before provider calls. Ambiguous failures count; never retry starts automatically.
   const reservation={date,starts:(budget.date===date?budget.starts||0:0)+1};await this.store.write(reservation);
   const token=await this.request('/sessions/token',{mode:'FULL',avatar_id:avatarId,is_sandbox:this.sandbox,video_settings:{quality:'low',encoding:'H264'},max_session_duration:this.duration,avatar_persona:{voice_id:this.voiceId,language:'en'}});
   if(!token?.session_id||!token?.session_token)throw new AvatarError('LiveAvatar returned an incomplete session. No automatic retry was attempted.');
   const handle=randomUUID();this.active={id:token.session_id,handle,started:this.now(),ping:this.now(),stopping:false,stopAttempts:0,nextStop:0};
   await this.store.write({...reservation,activeSessionId:token.session_id});
   const session=await this.request('/sessions/start',{},token.session_token);
   if(!session?.livekit_url||!session?.livekit_client_token)throw new AvatarError('LiveAvatar did not return a usable media connection.');
   return {handle,url:session.livekit_url,clientToken:session.livekit_client_token,maxSeconds:this.duration,sandbox:this.sandbox};
  }catch(e){if(this.active)await this.stop(this.active.handle).catch(()=>{});throw e;}finally{this.locked=false;}
 }
 ping(handle){if(!this.active||this.active.handle!==handle)throw new AvatarError('Live session is no longer active.',404);this.active.ping=this.now();}
 async stop(handle){
  const a=this.active;if(!a)return {stopped:true};if(a.handle!==handle)throw new AvatarError('Unknown live session.',404);if(a.stopping)return {stopped:false};a.stopping=true;a.stopAttempts++;
  try{await this.request('/sessions/stop',{session_id:a.id,reason:'USER_CLOSED'});const budget=await this.store.read();delete budget.activeSessionId;await this.store.write(budget);if(this.active===a)this.active=null;return {stopped:true};}catch(error){a.nextStop=this.now()+Math.min(60000,a.stopAttempts*10000);throw error;}finally{a.stopping=false;}
 }
 async sweep(){const a=this.active;if(a&&a.stopAttempts<3&&this.now()>=a.nextStop&&(this.now()-a.started>=this.duration*1000||this.now()-a.ping>35000))await this.stop(a.handle);}
}
export function avatarRouter(service){const router=Router();
 router.get('/status',async(req,res)=>res.json(await service.status()));
 router.use((req,res,next)=>{const origin=req.get('origin');if(origin){try{const u=new URL(origin);if(!['localhost','127.0.0.1','[::1]'].includes(u.hostname))return res.status(403).json({error:'Live guide is available from the local demo only.'});}catch{return res.status(403).json({error:'Invalid origin'});}}next();});
 router.post('/start',async(req,res)=>{if(req.body?.confirmLive!==true)return res.status(400).json({error:'Explicit live-session confirmation is required.'});res.json(await service.start());});
 router.post('/ping',async(req,res)=>{service.ping(req.body?.handle);res.json({ok:true});});
 router.post('/stop',async(req,res)=>res.json(await service.stop(req.body?.handle)));
 router.use((err,req,res,next)=>res.status(err.status||502).json({error:err instanceof AvatarError?err.message:'Live guide unavailable. Continue with local narration.'}));return router;
}
