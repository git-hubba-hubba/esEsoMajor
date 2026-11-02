import {memberTaskKey} from './account-tasks.js';
import {billBalanceCents,getSquirrelFund,moneyCents} from './squirrel-fund.js';
import {memberWallet} from './member-rewards.js';
import {getStoreConfig,storeChanges} from './feature-store.js';
export function describeAccountChanges(before,after){
 const changes=[];const add=(field,oldValue,newValue)=>{if(oldValue!==newValue)changes.push({field,before:String(oldValue??'Not set'),after:String(newValue??'Not set')});};
 add('balance',moneyCents(billBalanceCents(before)),moneyCents(billBalanceCents(after)));
 add('credits',before.credits,after.credits);
 for(const [id,value] of Object.entries(after.featureState||{}))add(id,before.featureState?.[id],value);
 for(const member of after.members){const old=before.members.find(m=>m.name===member.name);if(!old)add('Household member','Not added',member.name+' · '+member.role);else add('Location sharing · '+member.name,old.sharing?'Sharing enabled':'Private',member.sharing?'Sharing enabled':'Private');}
 for(const member of after.members){const old=before.members.find(m=>(m.id||m.email||m.name)===(member.id||member.email||member.name));if(old&&JSON.stringify(old.profilePhoto)!==JSON.stringify(member.profilePhoto)){const label=p=>p?.type==='upload'?'Uploaded photo':p?.type==='generated'?'AI avatar '+p.id:p?.type==='initials'?'Initials':'Default portrait';changes.push({field:member.name+' · profile picture',before:label(old.profilePhoto),after:label(member.profilePhoto)});}}
 for(const [id,plan] of Object.entries(after.plans||{})){const old=before.plans[id];if(JSON.stringify(old)!==JSON.stringify(plan)){const format=p=>p?`${p.lines} planned lines · $${p.budget} budget${p.estimatedMonthly?` · $${p.estimatedMonthly}/mo estimate`:''}`:'No saved configuration';add('plan:'+id,format(old),format(plan));}}
 for(const reward of ['Priority preorder access','Enhanced account alerts'])if(!before.completed.includes(reward)&&after.completed.includes(reward))add(reward,'Not redeemed','Redeemed');
 for(const application of after.signupApplications||[])if(!before.signupApplications?.some(a=>a.id===application.id))add('New account setup · '+application.identity.name,'Not submitted',`${application.id} · ${application.lines.length} lines · ${application.status}`);
 if(after.featureStore&&JSON.stringify(before.featureStore?.config)!==JSON.stringify(after.featureStore.config))changes.push(...storeChanges(getStoreConfig(before),after.featureStore.config));
 if(after.memberRewards)after.members.forEach((member,i)=>{const prior=before.members.findIndex(m=>(m.id||m.email||m.name)===(member.id||member.email||member.name));const old=prior>=0?memberWallet(before,prior):{balance:0,redemptions:[]},next=memberWallet(after,i);add(member.name+' · personal credits',old.balance,next.balance);for(const reward of next.redemptions)if(!old.redemptions.includes(reward))add(member.name+' · reward '+reward,'Not redeemed','Redeemed');});
 for(const m of after.members){const key=memberTaskKey(m);add(m.name+' · document checklist',before.accountTasks?.[key]?.documentsReviewed?'Reviewed':'Not reviewed',after.accountTasks?.[key]?.documentsReviewed?'Reviewed':'Not reviewed');}
 const oldFund=getSquirrelFund(before),newFund=getSquirrelFund(after);add('Squirrel Fund balance',moneyCents(oldFund.balanceCents),moneyCents(newFund.balanceCents));add('Squirrel Fund applied to bill',moneyCents(oldFund.appliedCents),moneyCents(newFund.appliedCents));for(const m of after.members){const key='member:'+String(m.id||m.email||m.name),a=oldFund.schedules[key],b=newFund.schedules[key];const label=s=>s?`${s.enabled?'Enabled':'Paused'} · ${moneyCents(s.amountCents)} ${s.cadence} · cap ${moneyCents(s.capCents)}/month`:'Not configured';add(m.name+' · Squirrel Fund schedule',label(a),label(b));}
 return changes;
}
