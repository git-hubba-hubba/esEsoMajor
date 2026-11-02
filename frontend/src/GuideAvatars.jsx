import React from 'react';
import './guide-portraits.css';
export const guides=[
 {id:'andi',name:'Andi',role:'Account guide',portrait:'/guides/andi-portrait.png'},
 {id:'maya',name:'Maya',role:'Billing guide',portrait:'/guides/maya-portrait.png'},
 {id:'leo',name:'Leo',role:'Service guide',portrait:'/guides/leo-portrait.png'}
];
export function GuidePortrait({id='andi',speaking=false}){
 const guide=guides.find(g=>g.id===id)||guides[0];
 return <img className={'guide-person '+(speaking?'talking':'')} data-guide={guide.id} src={guide.portrait} alt={`${guide.name}, your ${guide.role.toLowerCase()}`} width="180" height="180"/>;
}
