import { useRouter } from 'next/router';
import React, { useState, useEffect, useRef } from 'react'
import styles from '../styles/title.module.css';
import WAVES from 'vanta/dist/vanta.waves.min'
import gameSnap from '../assets/game-snap.png'; // Import the image
import useSound from 'use-sound';

const HomePage = () => {

  const router = useRouter();
  const words = ["C", "R", "Y", "P", "T", "O",
    "*", " ", "C", "R", "U", "S", "H"
  ];

  const [vantaEffect, setVantaEffect] = useState<ReturnType<typeof WAVES>>(null);
  const myRef = useRef(null)
  const [play, exposedData] = useSound('song.mp3');
  const [playing, setPlaying] = useState(false);


  useEffect(() => {
    if (!vantaEffect) {
      setVantaEffect(WAVES({
        el: myRef.current
      }))
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy()
      exposedData.stop();
    }
  }, [vantaEffect])
  

  const startGame = (e: React.MouseEvent) => {
    e.preventDefault();
   router.push('/play'); // Or router.replace('/game')
    play()
    setPlaying(true); // Set playing state to true when the audio starts
  };


  return (
    <div ref={myRef} className="flex flex-col items-center justify-center">
      <br /><br />
      <div className='m-1'>
        {words.map((word, index) => (
          <div className={styles['my-span']} key={`word-${index}`} data-char={word}>
            {word}
            {Array.from({ length: 10 }, (_, i) => (
              <span className='my-span2' key={`char-${word}-${i}`}>{word}</span>
            ))}
          </div>
        ))}
      </div>
      <br /><br />
      <button 
      className="rainbow-btn"
      onClick={startGame}><span>START</span></button>
      <div
      className='m-5'
      >
      <img
        src={gameSnap.src}
        width={600}
        alt="Game Snap"
        className="glowing-border p-2" // Apply class for glowing border
      />
      </div>
      <br /><br /><br /><br /><br /><br /><br /><br />
    </div>
  );
};

export default HomePage;
