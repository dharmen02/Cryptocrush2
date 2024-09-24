import React, {useState} from 'react';
import { dragDrop, dragEnd, dragStart, dragOver } from "../../store/index";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import useSound from 'use-sound';

interface SquareState {
    initialSquare: number;
    draggedOverSquare: any;
    isBeingDragged: boolean;
    glowingElements: HTMLImageElement[];
    playedSoundForElement: Set<number>;
    };

export function useMouseHandlers(
    setSquareState: React.Dispatch<React.SetStateAction<SquareState>>,
    isBeingDragged: boolean,
    initialSquare: number,
    draggedOverSquare: any,
    playedSoundForElement: any,

) {

    // redux state extraction 
    const squareBeingDragged = useAppSelector((state) => state.candyCrush.squareBeingDragged);
    const squareBeingDraggedOver = useAppSelector((state) => state.candyCrush.squareBeingDraggedOver);

    const [playHover, exposedData] = useSound('hover-over.mp3');
    const [playing, setPlaying] = useState(false);
    const [soundCooldown, setSoundCooldown] = useState(false);
    const [previousMouseX, setPreviousMouseX] = useState(0);
    const [previousMouseY, setPreviousMouseY] = useState(0);

    const dispatch = useAppDispatch();

    // event when user selects an element to drag
    const handleMouseDragStart = (e: React.MouseEvent<HTMLImageElement>) => {
        setSquareState(prevState => ({
            ...prevState,
            isBeingDragged: true
        }));

        const target = e.target as HTMLImageElement;
        const candyId = parseInt(target.getAttribute('candy-id') || '0', 10);
        target.style.boxShadow = "0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 30px #00ffff, 0 0 40px #00ffff";
        target.style.transform = "scale(1.3)"; // Grow the size by 10%

        setSquareState((prevSquareState) => ({
            ...prevSquareState,
            initialSquare: candyId
        }))

        // Add the position of the initial element being dragged to the set
        playedSoundForElement.add(candyId);

        console.log('played for elem',playedSoundForElement)
        
        dispatch(dragStart(e.target));
        console.log('sd'); // Logs the updated value within the callback
    };

    // event when user drags an element 
    const handleMouseDragOver = (e: React.MouseEvent<HTMLImageElement>) => {

    e.preventDefault();

    setSquareState(prevState => ({
      ...prevState,
      isBeingDragged: true
      }));

    const target = e.target as HTMLImageElement;
    const candyId = parseInt(target.getAttribute('candy-id') || '0', 10);
    
    const squareBeingDraggedInitialPosition = (squareBeingDragged as any).getAttribute('candy-id');

    const positionX = (squareBeingDraggedOver as any)?.positionX;
    const positionY = (squareBeingDraggedOver as any)?.positionY;
    const squareBeingDraggedOverPosition = positionY * 8 + positionX;

    setPlaying(true);

    // restrict glowing elements to adjacent from selected element being dragged
    if (
      Math.abs(squareBeingDraggedInitialPosition - squareBeingDraggedOverPosition) === 1 || // check horizontal adjacency
      Math.abs(squareBeingDraggedInitialPosition - squareBeingDraggedOverPosition) === 8 || // Check for vertical adjacency
      Math.abs(squareBeingDraggedInitialPosition - squareBeingDraggedOverPosition) === 7 || // Check for diagonal adjacency (top-left/bottom-right)
      Math.abs(squareBeingDraggedInitialPosition - squareBeingDraggedOverPosition) === 9 // Check for diagonal adjacency (top-right/bottom-left)
    ) {

    if (!playedSoundForElement.has(squareBeingDraggedOverPosition) 
      && !soundCooldown && !playing) {

        if (candyId !== initialSquare) {  
      playHover(); // Play the sound immediately
      playedSoundForElement.add(squareBeingDraggedOverPosition);
      setSoundCooldown(true); // Start the cooldown

      setTimeout(() => {
        setSoundCooldown(false); // End the cooldown after the delay
      }, 200); // Adjust the delay as needed
    }
  }
          
      if (squareBeingDraggedOverPosition !== squareBeingDraggedInitialPosition) {
        target.style.boxShadow = isBeingDragged ? "0 0 10px #ffffe0, 0 0 20px #ffffe0, 0 0 30px #ffffe0, 0 0 40px #ffffe0" : ''; // Apply glow effect
      } else if(squareBeingDraggedOverPosition === squareBeingDraggedInitialPosition) {
      target.style.boxShadow = "";
      }
      else {  
      target.style.boxShadow = "";
      }
    }

    else if (candyId !== initialSquare) {
      target.style.boxShadow = ""; // Remove glow effect if not adjacent
      target.style.transform = ""; // Reset size
    } else {
      target.style.boxShadow = "0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 30px #00ffff, 0 0 40px #00ffff";
      
    }

    dispatch(dragOver({ positionX: candyId % 8, positionY: Math.floor(candyId / 8) }));
    setSquareState((prevSquareState) => ({
      ...prevSquareState,
      draggedOverSquare: target
    }))

  };

    // when the user drops the dragged element onto an invalid move
    const handleMouseDragLeave = (e: React.DragEvent<HTMLImageElement>) => {
        const target = e.target as HTMLImageElement;
        const candyId = parseInt(target.getAttribute('candy-id') || '0', 10);

        const positionX = (squareBeingDraggedOver as any)?.positionX;
        const positionY = (squareBeingDraggedOver as any)?.positionY;
        const squareBeingDraggedOverPosition = positionY * 8 + positionX;


        setPlaying(false);
        playedSoundForElement.delete(squareBeingDraggedOverPosition)
        //exposedData.sound.fade(0.0, .5, 300);
    
        if (draggedOverSquare instanceof HTMLImageElement) {
          (draggedOverSquare as HTMLImageElement).style.boxShadow = " "; // Remove the glow effect from the dragged over square
        
        }
    
        if (candyId !== initialSquare) {
          // Only remove the glow effect if it's not the initial square
          target.style.boxShadow = "";
          target.style.transform = "";
        }
        dispatch(dragEnd());
        setSquareState(prevState => ({
          ...prevState,
          isBeingDragged: false
        }));
      };

    // when user drops onto another valid tile with invalid result
    const handleMouseDrop = (e: React.DragEvent<HTMLImageElement>) => {
        const target = e.target as HTMLImageElement;
        target.style.boxShadow = "";
        dispatch(dragDrop(e.target))
  }

    // when user releases the dragged element 
    const handleMouseDragEnd = (e: React.DragEvent<HTMLImageElement>) => {
        const target = e.target as HTMLImageElement;
        target.style.boxShadow = ""; // Remove the box shadow
        target.style.transform = ""; // Reset the size
        setSquareState(prevState => ({
          ...prevState,
          initialSquare: 0
        })); // reset initial square
        dispatch(dragEnd());
        setSquareState(prevState => ({
          ...prevState,
          isBeingDragged: false
        }));
      };

    return { 
        handleMouseDragStart, 
        handleMouseDragOver, 
        handleMouseDragLeave, 
        handleMouseDrop,
        handleMouseDragEnd };
}