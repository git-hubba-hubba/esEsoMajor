import React, {useRef, useState} from 'react';
import {ArrowRight, Gift, Heart, MessageCircle, Pause, Play, Smartphone, Sparkles, Wifi, Users, Headphones} from 'lucide-react';
import './splash.css';

const satellites = [
  {Icon:Wifi, phase:-35, duration:16, inset:4},
  {Icon:Gift, phase:20, duration:21, inset:11},
  {Icon:MessageCircle, phase:80, duration:18, inset:3},
  {Icon:Smartphone, phase:135, duration:23, inset:8},
  {Icon:Heart, phase:190, duration:17, inset:12},
  {Icon:Users, phase:245, duration:22, inset:3},
  {Icon:Headphones, phase:300, duration:19, inset:9},
];

export default function SplashScreen({onEnter, onSignup}) {
  const scene = useRef(null);
  const [paused, setPaused] = useState(() => typeof window !== 'undefined' && (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false));
  const [ripple, setRipple] = useState(0);
  function moveScene(event) {
    if (event.pointerType === 'touch' || paused) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    scene.current?.style.setProperty('--look-x', `${((event.clientX - bounds.left) / bounds.width - .5) * 16}px`);
    scene.current?.style.setProperty('--look-y', `${((event.clientY - bounds.top) / bounds.height - .5) * 12}px`);
  }
  function resetScene() {
    scene.current?.style.setProperty('--look-x', '0px');
    scene.current?.style.setProperty('--look-y', '0px');
  }

  return <main className="splash-screen" data-paused={paused} data-motion-enabled={!paused}>
    <div className="splash-nebula" aria-hidden="true"/>
    <div className="splash-starfield" aria-hidden="true">{Array.from({length:32}, (_, i) => <i key={i} style={{'--x':`${(i * 47 + 11) % 100}%`,'--y':`${(i * 31 + 7) % 100}%`,'--delay':`${-i * .7}s`,'--size':`${i % 4 === 0 ? 3 : 1.5}px`}}/>)}</div>
    <header className="splash-header">
      <div className="splash-brand">sso<span>+</span></div>
      <button className="splash-motion" onClick={() => {setPaused(!paused); resetScene();}} aria-label={paused ? 'Play animations' : 'Pause animations'} aria-pressed={paused}>{paused ? <Play size={16}/> : <Pause size={16}/>}</button>
    </header>

    <section className="splash-experience" aria-labelledby="splash-title">
      <div className="splash-scene" ref={scene} onPointerMove={moveScene} onPointerLeave={resetScene}>
        <div className="splash-depth" aria-hidden="true">
          <div className="splash-halo"/>
          <div className="splash-orbit splash-orbit-one"/>
          <div className="splash-orbit splash-orbit-two"/>
          <div className="splash-orbit splash-orbit-three"/>
          <svg className="splash-light-trails" viewBox="0 0 600 600"><defs><linearGradient id="splash-trail"><stop stopColor="#71e9ff" stopOpacity="0"/><stop offset="1" stopColor="#b9fff3"/></linearGradient></defs><circle cx="300" cy="300" r="249"/><circle cx="300" cy="300" r="215"/></svg>
          <div className="splash-core"><div className="splash-core-light"/><div className="splash-latitudes"/></div>
          {satellites.map(({Icon,phase,duration,inset}, i) => <div className={`splash-satellite splash-satellite-${i}`} key={i} style={{'--phase':`${phase}deg`,'--orbit-duration':`${duration}s`,'--orbit-inset':`${inset}%`,'--bob-delay':`${-i * .6}s`}}><div><span className="splash-satellite-icon"><Icon size={i === 0 ? 28 : 23} strokeWidth={1.5}/></span></div></div>)}
          <span className="splash-spark splash-spark-one">✦</span><span className="splash-spark splash-spark-two">✧</span><span className="splash-spark splash-spark-three">+</span>
          <div className="splash-floor"><span/><span/><span/></div>
          <div className="splash-logo-orb"><img src="/brand/att-globe-transparent.png" alt=""/></div>
        </div>
        <button className="splash-companion" onClick={() => setRipple(value => value + 1)} aria-label="Make your companion send a ripple">
          <img src="/guides/blue-companion.png" alt="Your blue companion" draggable="false"/>
          <span className="splash-companion-glint"><Sparkles size={19}/></span>
        </button>
        <div className="splash-ripple-burst" key={ripple} aria-hidden="true"><span/><span/><span/>{Array.from({length:12}, (_, i) => <i key={i} style={{'--angle':`${i * 30}deg`}}/>)}</div>
      </div>
      <div className="splash-entry">
        <h1 id="splash-title">Your world. <span>In motion.</span></h1>
        <button className="splash-enter" onClick={onEnter}>Let’s go <ArrowRight size={19}/></button>
        <button className="splash-signup" onClick={onSignup}>Create an account</button>
      </div>
    </section>
    <footer className="splash-footer"><small>Independent demo · No real transactions</small><span aria-hidden="true"><i/><i/><i/></span></footer>
  </main>;
}
