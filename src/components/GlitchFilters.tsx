import React from 'react';

const GlitchFilters: React.FC = () => {
  return (
    <svg className="glitch-filters" width="0" height="0" style={{ position: 'absolute' }}>
      <filter id="glitch-filter">
        <feColorMatrix type="matrix" 
          values="1 0 0 0 0
                  0 0 0 0 0
                  0 0 1 0 0
                  0 0 0 1 0"/>
        <feOffset dx="3" dy="0" result="red"/>
        <feOffset dx="-3" dy="0" result="blue"/>
        <feBlend mode="screen" in="red" in2="blue"/>
        <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="1" result="noise"/>
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="5" xChannelSelector="R" yChannelSelector="G"/>
      </filter>
      
      <filter id="glitch-displacement">
        <feTurbulence baseFrequency="0.02 0.03" numOctaves="3" result="noise" seed="0"/>
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="6" xChannelSelector="R" yChannelSelector="G"/>
      </filter>
      
      <filter id="profile-glitch-rgb-split">
        <feColorMatrix type="matrix" 
          values="1 0 0 0 0
                  0 0 0 0 0
                  0 0 1 0 0
                  0 0 0 1 0" result="red"/>
        <feOffset in="red" dx="2" dy="-2" result="red-offset"/>
        
        <feColorMatrix in="SourceGraphic" type="matrix" 
          values="0 0 0 0 0
                  0 1 0 0 0
                  0 0 0 0 0
                  0 0 0 1 0" result="green"/>
        <feOffset in="green" dx="-1" dy="0" result="green-offset"/>
        
        <feColorMatrix in="SourceGraphic" type="matrix" 
          values="0 0 0 0 0
                  0 0 0 0 0
                  0 0 1 0 0
                  0 0 0 1 0" result="blue"/>
        <feOffset in="blue" dx="-2" dy="2" result="blue-offset"/>
        
        <feBlend mode="screen" in="red-offset" in2="green-offset" result="blend1"/>
        <feBlend mode="screen" in="blend1" in2="blue-offset" result="blend2"/>
        
        <feTurbulence type="fractalNoise" baseFrequency="0.1" numOctaves="1" result="noise" seed="0"/>
        <feDisplacementMap in="blend2" in2="noise" scale="5" xChannelSelector="R" yChannelSelector="G"/>
      </filter>
      
      <filter id="profile-noise-filter">
        <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" result="noise"/>
        <feColorMatrix in="noise" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0" result="noise-alpha"/>
        <feComposite operator="in" in="noise" in2="noise-alpha" result="noise-limited"/>
        <feComposite operator="arithmetic" k1="0" k2="1" k3="1" k4="0" in="SourceGraphic" in2="noise-limited" result="noisy-image"/>
        <feBlend mode="multiply" in="noisy-image" in2="SourceGraphic"/>
      </filter>

      <filter id="hacker-digital-corruption">
        <feTurbulence type="fractalNoise" baseFrequency="0.15" numOctaves="2" seed="3" result="noise"/>
        <feColorMatrix type="matrix" 
          values="0.3 0 0 0 0
                  0 0.59 0 0 0
                  0 0 0.11 0 0
                  0 0 0 1 0" in="SourceGraphic" result="grayscale"/>
        <feDisplacementMap in="grayscale" in2="noise" scale="10" xChannelSelector="R" yChannelSelector="G" result="displacement"/>
        <feComposite operator="arithmetic" k1="0.5" k2="0.5" k3="0.5" k4="0" in="displacement" in2="SourceGraphic" result="blend"/>
        <feBlend mode="screen" in="blend" in2="displacement"/>
      </filter>

      <filter id="scan-lines">
        <feFlood floodColor="#00ff00" floodOpacity="0.1" result="flood"/>
        <feImage xlinkHref="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='2' y='0' fill='%23000'/%3E%3C/svg%3E" x="0" y="0" width="100%" height="100%" result="pattern"/>
        <feTile in="pattern" result="tile"/>
        <feComposite operator="in" in="flood" in2="tile" result="scanlines"/>
        <feComposite operator="over" in="SourceGraphic" in2="scanlines"/>
      </filter>

      <filter id="data-corruption">
        <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="1" seed="1" result="noise"/>
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="9" result="displacement"/>
        <feColorMatrix type="matrix"
          values="1 0 0 0 0.2
                  0 1 0 0 0
                  0 0 1 0 0.1
                  0 0 0 1 0" in="displacement" result="recolor"/>
        <feBlend mode="multiply" in="recolor" in2="SourceGraphic" result="blend"/>
        <feComposite operator="in" in="blend" in2="SourceGraphic" result="composite"/>
        <feOffset dx="2" dy="-1" in="composite" result="offsetColor"/>
        <feBlend mode="lighten" in="offsetColor" in2="composite"/>
      </filter>
    </svg>
  );
};

export default GlitchFilters; 