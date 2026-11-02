import {billBalanceCents} from './squirrel-fund.js';
import {featureDemos} from './demo.js';
export function saveFeatureSetting(state,id,value){
 const demo=featureDemos[id];if(!demo||!demo.options.includes(value))throw new Error('Invalid feature preference');
 return {...state,autopay:id==='billing-04'?value==='Enabled':state.autopay,featureState:{...state.featureState,[id]:value},completed:[...new Set([...state.completed,id])]};
}
export function completePayment(state){return billBalanceCents(state)===0?state:{...state,paid:true,credits:state.credits+250,completed:[...new Set([...state.completed,'bill-paid'])]};}
export function redeemReward(state,name,cost){return state.credits<cost||state.completed.includes(name)?state:{...state,credits:state.credits-cost,completed:[...state.completed,name]};}
export function saveExperience(state,category,prefs){let next=state;for(const [id,value] of Object.entries(prefs.settings||{}))next=saveFeatureSetting(next,id,value);return {...next,plans:{...next.plans,[category]:prefs},credits:next.credits+(state.plans[category]?0:150),completed:[...new Set([...next.completed,category+'-builder'])]};}
