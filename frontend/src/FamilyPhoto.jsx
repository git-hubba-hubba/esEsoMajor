import React from 'react';
import './family-experience.css';

const scenes = {
  home: {file:'home', alt:'A multigenerational family sharing a tablet at home'},
  outdoors: {file:'outdoors', alt:'A family enjoying a walk together in the park'},
  planning: {file:'planning', alt:'Parents and their teenager planning together at the kitchen table'},
  responder: {file:'responder', alt:'A first responder greeting their family at home'},
  internet: {file:'internet', alt:'A father and daughter playing a console game together at home'},
  saving: {file:'saving', alt:'A mother and teenager adding coins to their savings jar'},
  rewards: {file:'rewards', alt:'A grandmother and grandson enjoying ice cream at a neighborhood cafe'},
  store: {file:'store', alt:'A family comparing a smartphone together in an electronics shop'},
};

// Each photograph belongs to one destination. Utility pages deliberately have
// no photographic fallback, so they cannot silently repeat the home image.
export const sectionScenes = Object.freeze({
  Overview:'home',
  'billing-payments':'planning',
  'wireless-services':'outdoors',
  'home-internet':'internet',
  squirrel:'saving',
  rewards:'rewards',
  store:'store',
  firstnet:'responder',
});
export const hasFamilyPhoto = section => Object.hasOwn(sectionScenes, section);

export default function FamilyPhoto({section,className='',priority=false,decorative=false}) {
  const image = scenes[sectionScenes[section]];
  if (!image) return null;
  return <figure className={`family-photo ${className}`} aria-hidden={decorative || undefined}>
    <img src={`/family/${image.file}.jpg`} alt={decorative?'':image.alt} width="1600" height="900" loading={priority?'eager':'lazy'} decoding="async"/>
  </figure>;
}

export function FamilyWelcome({section='Overview',title,children}) {
  return <section className="family-welcome"><div className="family-welcome-copy"><h2>{title}</h2><p>{children}</p></div><FamilyPhoto section={section} priority/></section>;
}
