// Background.tsx
import React from 'react';

const Background: React.FC = () => {
  return (
    <div className="fixed inset-0 h-full w-full filter blur-[0.1vmin] bg-[radial-gradient(ellipse_at_top,transparent_0%,black),radial-gradient(ellipse_at_bottom,black,rgba(145,233,255,0.2)),repeating-linear-gradient(220deg,rgb(0,0,0)_0px,rgb(0,0,0)_19px,transparent_19px,transparent_22px),repeating-linear-gradient(189deg,rgb(0,0,0)_0px,rgb(0,0,0)_19px,transparent_19px,transparent_22px),repeating-linear-gradient(148deg,rgb(0,0,0)_0px,rgb(0,0,0)_19px,transparent_19px,transparent_22px),linear-gradient(90deg,white,gray)] bg-cover z-[-10] pointer-events-none"></div>
  );
};

export default Background;
