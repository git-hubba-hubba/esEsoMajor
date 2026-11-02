export const rewardActivities=[
 {id:'review-bill',title:'Understand your statement',description:'Review the current bill details.',credits:50,feature:'billing-01',icon:'bill'},
 {id:'review-usage',title:'Know your usage',description:'Review household wireless data usage.',credits:75,feature:'usage-01',icon:'usage'},
 {id:'review-privacy',title:'Review your privacy',description:'Confirm your own preferences. Sharing can stay off.',credits:75,action:'members',icon:'privacy'},
 {id:'pay-bill',title:'Keep payments on track',description:'Confirm the demo bill payment once.',credits:250,action:'payment',owner:true,icon:'bill'},
 {id:'store-setup',title:'Personalize your services',description:'Save the first next-cycle setup in Feature store.',credits:100,action:'store',owner:true,icon:'store'}
];
export const memberRewardCatalog=[
 {id:'account-ready',name:'Account-ready badge',cost:100,description:'A personal badge recognizing thoughtful account care.',icon:'badge'},
 {id:'early-access',name:'Early access preview',cost:200,description:'Unlock a personal demo preview-access badge.',icon:'star'},
 {id:'preorder',name:'Priority preorder access',cost:1000,description:'A demo preorder entitlement for your profile.',icon:'gift'},
 {id:'alerts',name:'Enhanced account alerts',cost:500,description:'A personal demo alert entitlement. Paid store features stay separate.',icon:'bell'}
];
export function memberRewardKey(member){return 'member:'+String(member.id||member.email||member.name);}
export function ensureMemberRewards(state){const members=state.members,existing=state.memberRewards;let wallets={...(existing?.wallets||{})};
 if(!existing){members.forEach((m,i)=>{wallets[memberRewardKey(m)]={balance:i===0?state.credits:0,earned:0,claimed:i===0?[...(state.paid?['pay-bill']:[]),...(state.featureStore?['store-setup']:[])]:[],redemptions:i===0?memberRewardCatalog.filter(r=>state.completed.includes(r.name)).map(r=>r.id):[],entries:[]};});}
 else for(const m of members)if(!wallets[memberRewardKey(m)])wallets[memberRewardKey(m)]={balance:0,earned:0,claimed:[],redemptions:[],entries:[]};
 return {...state,memberRewards:{version:1,wallets}};
}
export function memberWallet(state,index){const normalized=ensureMemberRewards(state),member=state.members[index];if(!member)throw Error('Unknown household member');return normalized.memberRewards.wallets[memberRewardKey(member)];}
export function applyMemberRewardEvent(before,updated,type,detail,index,time){const baseline=ensureMemberRewards(before);let next=ensureMemberRewards({...updated,memberRewards:updated.memberRewards||baseline.memberRewards});
 const member=next.members[index];if(!member)return next;const key=memberRewardKey(member);let wallet={...next.memberRewards.wallets[key],claimed:[...next.memberRewards.wallets[key].claimed],entries:[...next.memberRewards.wallets[key].entries]};let award=0,activity=null;
 if(type==='feature_reviewed'&&detail==='billing-01')activity=rewardActivities[0];
 if(type==='feature_reviewed'&&['usage-01','usage-03'].includes(detail))activity=rewardActivities[1];
 if(type==='privacy_preferences_reviewed'||(type==='location_sharing_changed'&&before.members[index]?.sharing!==updated.members[index]?.sharing))activity=rewardActivities[2];
 if(['demo_payment_completed','squirrel_bill_applied'].includes(type)&&!before.paid&&updated.paid&&index===0)activity=rewardActivities[3];
 if(type==='feature_store_saved'&&!before.featureStore&&updated.featureStore&&index===0)activity=rewardActivities[4];
 const existingAward=Math.max(0,updated.credits-before.credits);
 if(activity&&!wallet.claimed.includes(activity.id)&&(!activity.owner||index===0)){wallet.claimed.push(activity.id);award=activity.credits;}
 // Existing payment/configuration awards move into the actor's wallet, rather than minting another household award.
 const earned=Math.max(existingAward,award);if(earned){wallet.balance+=earned;wallet.earned+=earned;wallet.entries=[{type:'earned',amount:earned,title:activity?.title||'Account configuration reward',time},...wallet.entries].slice(0,100);next={...next,credits:updated.credits+Math.max(0,earned-existingAward)};}
 if(updated.credits<before.credits&&type!=='member_reward_redeemed'){const spent=before.credits-updated.credits;if(wallet.balance<spent)throw Error('Insufficient personal credits');wallet.balance-=spent;}
 return {...next,memberRewards:{version:1,wallets:{...next.memberRewards.wallets,[key]:wallet}}};
}
export function redeemMemberReward(state,index,rewardId,time){const next=ensureMemberRewards(state),reward=memberRewardCatalog.find(r=>r.id===rewardId),member=next.members[index];if(!member||!reward)throw Error('Unknown member or reward');const key=memberRewardKey(member),wallet=next.memberRewards.wallets[key];if(wallet.redemptions.includes(rewardId))return next;if(wallet.balance<reward.cost)throw Error('Earn more personal credits to redeem this reward');return {...next,credits:next.credits-reward.cost,memberRewards:{version:1,wallets:{...next.memberRewards.wallets,[key]:{...wallet,balance:wallet.balance-reward.cost,redemptions:[...wallet.redemptions,rewardId],entries:[{type:'redeemed',amount:-reward.cost,title:reward.name,time},...wallet.entries].slice(0,100)}}}};}
