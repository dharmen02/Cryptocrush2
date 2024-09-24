import React, { useState, useEffect, useRef } from 'react'
import Board from "../components/Board";
import { moveBelow, updateBoard } from "../store";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { createBoard } from "../utils/createBoard";
import styles from '../styles/title.module.css';
import {
  formulaForColumnOfFour,
  formulaForColumnOfThree,
  generateInvalidMoves,
} from "../utils/formulas";
import {
  checkForColumnOfThree,
  checkForRowOfFour,
  checkForRowOfThree,
  isColumnOfFour,
} from "../utils/moveCheckLogic";
 import WAVES from 'vanta/dist/vanta.waves.min'

const Home = () => {
  const dispatch = useAppDispatch();
  const board = useAppSelector(({ candyCrush: { board } }) => board);
  const words = ["C", "R", "Y", "P", "T", "O",
  "*", " ", "C", "R", "U", "S", "H"
];

  const boardSize = useAppSelector(
    ({ candyCrush: { boardSize } }) => boardSize
  );
  const [vantaEffect, setVantaEffect] = useState<ReturnType<typeof WAVES>>(null);
  
  const myRef = useRef(null)

  useEffect(() => {
    if (!vantaEffect) {
      setVantaEffect(WAVES({
        el: myRef.current
      }))
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy()
    }
  }, [vantaEffect])
const entries = performance.getEntriesByType("navigation")[0]

  useEffect(() => {
    // hard reload with back button

    const handleBackButton = () => {
      if (entries) {
        location.reload();
      }
    };

    window.addEventListener('popstate', handleBackButton);

    return () => window.removeEventListener('popstate', handleBackButton);
  }, []);


  useEffect(() => {
    dispatch(updateBoard(createBoard(boardSize)));
  }, [dispatch, boardSize]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const newBoard = [...board];
      isColumnOfFour(newBoard, boardSize, formulaForColumnOfFour(boardSize));
      checkForRowOfFour(
        newBoard,
        boardSize,
        generateInvalidMoves(boardSize, true)
      );
      checkForColumnOfThree(
        newBoard,
        boardSize,
        formulaForColumnOfThree(boardSize)
      );
      checkForRowOfThree(newBoard, boardSize, generateInvalidMoves(boardSize));
      dispatch(updateBoard(newBoard));
      dispatch(moveBelow());
    }, 150);
    return () => clearInterval(timeout);
  }, [board, dispatch, boardSize]);

  return (

    <div ref={myRef} className="flex flex-col items-center justify-center">

      <br/><br/>

      <div className='m-1'>
      {words.map((word, index) => (
  <div className={styles['my-span']}   key={`word-${index}`} data-char={word}>
    {word}
    {Array.from({ length: 10 }, (_, i) => (
      <span className='my-span2' key={`char-${word}-${i}`}>{word}</span>
    ))}
  </div>
))}
    </div>
    <br/>
    <div>
    <div  style={{touchAction: 'none'}}>
      <Board
        />
       </div>
       </div>
      <br/>
    </div>
  );
}

export default Home;