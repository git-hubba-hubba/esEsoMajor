import React,{useRef,useState,useEffect} from 'react';
import ProfileAvatar from './ProfileAvatar.jsx';
import {avatarChoices} from './profile-portraits.js';
export default function ProfilePhotoPicker({member,onSave,onCancel}){
 const [photo,setPhoto]=useState(member.profilePhoto||null),[error,setError]=useState(''),[loading,setLoading]=useState(false);
 const generation=useRef(0);useEffect(()=>()=>{generation.current++},[]);
 async function upload(file){const job=++generation.current;setError('');if(!file)return;setLoading(true);
 try{
  if(!['image/jpeg','image/png','image/webp'].includes(file.type))throw Error('Choose a JPG, PNG, or WebP image.');
  if(file.size>5*1024*1024)throw Error('Choose an image smaller than 5 MB.');
  const url=URL.createObjectURL(file);let image;
  try{image=await new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=()=>reject(Error('This image could not be opened. Choose another photo.'));img.src=url;});}finally{URL.revokeObjectURL(url)}
  if(!image.naturalWidth||!image.naturalHeight||image.naturalWidth*image.naturalHeight>40000000)throw Error('Choose a smaller image (up to 40 megapixels).');
  const canvas=document.createElement('canvas');canvas.width=192;canvas.height=192;const ctx=canvas.getContext('2d');ctx.fillStyle='#e6edf7';ctx.fillRect(0,0,192,192);const side=Math.min(image.naturalWidth,image.naturalHeight);ctx.drawImage(image,(image.naturalWidth-side)/2,(image.naturalHeight-side)/2,side,side,0,0,192,192);
  const data=canvas.toDataURL('image/jpeg',0.8);if(data.length>45000)throw Error('This photo is too detailed. Choose a simpler image.');
  if(job===generation.current)setPhoto({type:'upload',src:data});
 }catch(e){if(job===generation.current)setError(e.message)}finally{if(job===generation.current)setLoading(false)}
 }
 return <div className="photo-picker"><h2>Your profile picture</h2><p>Personalize {member.name.split(' ')[0]}’s profile. Preview your choice, then save.</p><div className="photo-preview"><ProfileAvatar member={{...member,profilePhoto:photo}}/><span>{loading?'Preparing your photo…':'Your profile preview'}</span></div><h3>Choose a human profile portrait</h3><p>A range of faces, skin tones, ages, and personal styles. Choose what feels like you, or upload your own photo.</p><div className="photo-choice-grid" role="group" aria-label="AI-generated profile portraits">{avatarChoices.map((id,i)=><button key={id} aria-label={`Choose AI avatar ${i+1}`} aria-pressed={photo?.type==='generated'&&photo.id===id} disabled={loading} onClick={()=>{setPhoto({type:'generated',id});setError('')}}><img src={`/profiles/${id}.png`} alt={`AI-generated portrait ${i+1}`} loading="lazy"/><span>Avatar {i+1}</span></button>)}</div><label className="photo-upload">Or upload your own photo<input type="file" accept="image/jpeg,image/png,image/webp" disabled={loading} onChange={e=>{upload(e.target.files?.[0]);e.target.value=''}}/><small>JPG, PNG, WebP · Up to 5 MB · Centered square crop</small></label><p className="photo-privacy">Photos are resized in your browser and saved with this demo account. They are not sent to an image generation service.</p>{error&&<p role="alert">{error}</p>}<div className="photo-picker-actions"><button className="button dark" disabled={loading} onClick={()=>onSave(photo)}>Save profile picture</button><button className="button white" onClick={onCancel}>Cancel</button><button className="text-button" disabled={loading} onClick={()=>{setPhoto({type:'initials'});setError('')}}>Use initials</button></div></div>;
}
