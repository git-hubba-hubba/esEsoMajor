import {billBalanceCents,moneyCents} from './squirrel-fund.js';
export function memberTaskKey(member){return member.id||member.email||member.name;}
export function accountTasks(state,active=0){
 const key=memberTaskKey(state.members[active]);
 const verified=state.accountTasks?.[key]?.documentsReviewed===true;
 const tasks=[{id:'documents',title:'Verify documents for your service request',description:'Know what you’ll need for your service request so you can prepare your next step. Demo REQ-1042 · No personal documents required.',status:verified?'complete':'action',label:verified?'Checklist reviewed':'Action needed',action:'Review checklist',target:'documents'}];
 if(active===0)tasks.unshift({id:'bill',title:state.paid?'Your current bill is paid':`Review and pay ${moneyCents(billBalanceCents(state))}`,description:state.paid?'Payment recorded. Your bill history is ready to review.':'See exactly what you owe before deciding how to pay. Demo statement due November 12, 2026 · Applied Squirrel Fund payments are included.',status:state.paid?'complete':'action',label:state.paid?'Complete':'Due November 12',action:state.paid?'View billing':'Review payment',target:state.paid?'billing':'payment'});
 return tasks;
}
export function reviewDocumentChecklist(state,active){const key=memberTaskKey(state.members[active]);if(state.accountTasks?.[key]?.documentsReviewed)return state;return {...state,accountTasks:{...state.accountTasks,[key]:{...state.accountTasks?.[key],documentsReviewed:true}}};}
