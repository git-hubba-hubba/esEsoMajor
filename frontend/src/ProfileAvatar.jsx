import React,{useState} from 'react';
import './profile-avatar.css';
import {avatarChoices} from './profile-portraits.js';
// Household portraits are separate from the cartoon site guide.
const portraits={
 'alex.morgan@example.test':'alex-morgan',
 'jamie.morgan@example.test':'jamie-morgan',
 'taylor.morgan@example.test':'taylor-morgan'
};
export default function ProfileAvatar({member,className=''}){
 const [failed,setFailed]=useState(null);
 const choice=member.profilePhoto;
 const portrait=choice?.type==='generated'&&avatarChoices.includes(choice.id)?choice.id:portraits[member.email]||portraits[member.id];
 const src=choice?.type==='initials'?null:choice?.type==='upload'&&/^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(choice.src||'')&&choice.src.length<=45000?choice.src:portrait?`/profiles/${portrait}.png`:null;
 return <span className={`profile-avatar ${className}`} data-profile-role={member.role==='Owner'?'primary':'member'} aria-hidden="true">{src&&failed!==src?<img src={src} alt="" onError={()=>setFailed(src)}/>:member.name.split(' ').map(n=>n[0]).slice(0,2).join('')}</span>;
}
