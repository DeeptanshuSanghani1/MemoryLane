import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css'; // Keep this for any additional styling

function App() {
  const navigate = useNavigate();
  const [textArray, setTextArray] = useState<string[]>([]);

  useEffect(() => {
    const text = 'I Have Something'.split('');
    setTextArray(text);
  }, []);

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Full-screen background */}
      <div className="fixed inset-0 h-full w-full filter blur-[0.1vmin] bg-[radial-gradient(ellipse_at_top,transparent_0%,black),radial-gradient(ellipse_at_bottom,black,rgba(145,233,255,0.2)),repeating-linear-gradient(220deg,rgb(0,0,0)_0px,rgb(0,0,0)_19px,transparent_19px,transparent_22px),repeating-linear-gradient(189deg,rgb(0,0,0)_0px,rgb(0,0,0)_19px,transparent_19px,transparent_22px),repeating-linear-gradient(148deg,rgb(0,0,0)_0px,rgb(0,0,0)_19px,transparent_19px,transparent_22px),linear-gradient(90deg,white,gray)] bg-cover"></div>

      {/* Text animation */}
      <h1 className="absolute inset-0 flex flex-wrap justify-center items-center text-white text-4xl font-mono leading-tight tracking-normal sm:tracking-[20px]">
        {textArray.map((char, index) =>
          char !== ' ' ? (
            <span
              key={index}
              className="opacity-0 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'forwards' }}
            >
              {char}
            </span>
          ) : (
            <span key={index} className="mr-[20px]"></span>
          )
        )}
      </h1>

      {/* Button */}
      <div className="absolute top-[60vh] w-full flex justify-center">
      <button
          onClick={() => navigate('/memoryLane')}
          className="relative bg-[#1C1A1C] w-[15em] h-[5em] rounded-full flex justify-center items-center gap-3 cursor-pointer transition-all duration-450 ease-in-out
            hover:bg-gradient-to-b from-[#A47CF3] to-[#683FEA]
            hover:shadow-[inset_0px_1px_0px_0px_rgba(255,255,255,0.4),inset_0px_-4px_0px_0px_rgba(0,0,0,0.2),0px_0px_0px_4px_rgba(255,255,255,0.2),0px_0px_180px_0px_#9917FF]
            hover:translate-y-[-2px]"
        >
          <svg
            height="24"
            width="24"
            fill="#FFFFFF"
            viewBox="0 0 24 24"
            data-name="Layer 1"
            id="Layer_1"
            className="sparkle fill-[#AAAAAA] transition-all duration-[800ms] ease-in-out hover:fill-white hover:scale-[1.2]"
          >
            <path d="M10,21.236,6.755,14.745.264,11.5,6.755,8.255,10,1.764l3.245,6.491L19.736,11.5l-6.491,3.245ZM18,21l1.5,3L21,21l3-1.5L21,18l-1.5-3L18,18l-3,1.5ZM19.333,4.667,20.5,7l1.167-2.333L24,3.5,21.667,2.333,20.5,0,19.333,2.333,17,3.5Z"></path>
          </svg>
          <span className="text font-semibold text-[#AAAAAA] text-md transition-colors duration-[800ms] hover:text-white">
            Open
          </span>
        </button>
      </div>
    </div>
  );
}

export default App;
