import React, { memo } from "react";
import './tile.css';
import { useMouseHandlers } from "../utils/user-actions/mouseEvents";
import { useTouchHandlers } from "../utils/user-actions/touchEvents";

interface SquareState {
  initialSquare: number;
  draggedOverSquare: any;
  isBeingDragged: boolean;
  glowingElements: HTMLImageElement[];
  playedSoundForElement: Set<number>

}

interface TileProps {
  candy: string;
  candyId: number;
  squareState: SquareState;
  setSquareState: React.Dispatch<React.SetStateAction<SquareState>>;
};

function Tile({ candy, candyId, squareState, setSquareState }: TileProps) 
{ const {isBeingDragged, initialSquare, draggedOverSquare, glowingElements, playedSoundForElement} = squareState;
  
  const { 
    handleMouseDragStart, 
    handleMouseDragOver, 
    handleMouseDragLeave, 
    handleMouseDrop, 
    handleMouseDragEnd } = useMouseHandlers(
    setSquareState, isBeingDragged, initialSquare, draggedOverSquare, playedSoundForElement);

  const {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handlePointerLeave } = useTouchHandlers(
    setSquareState, isBeingDragged, initialSquare, draggedOverSquare, glowingElements, playedSoundForElement);      

  return (
    <div
      className={`tile-padding md:w-16 md:h-16 lg:w-20 lg:h-20 sm:w-14 sm:h-14 flex justify-center items-center m-0.5 rounded-lg select-none ${isBeingDragged ? 'is-being-dragged' : ''}`}
      style={{
        boxShadow: "inset 5px 5px 15px #062525, inset -5px -5px 15px #aaaab7bb",
        width: "calc(100% / 8 - 1rem)", // Adjust the width to fit 8 tiles in a row
      }}
    >
      {candy && (
        <img
          src={candy}
          alt=""
          className={`md:w-17 md:h-17 lg:w-19 lg:h-19 sm:w-12 sm:h-12 p-1`}
          draggable={true}

          onDragStart={handleMouseDragStart}
          onDragOver={handleMouseDragOver}
          onDragLeave={handleMouseDragLeave}
          onDrop={handleMouseDrop}
          onDragEnd={handleMouseDragEnd}

          onPointerLeave={handlePointerLeave}

          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}

          candy-id={candyId}
        />
      )}
    </div>
  );
}

export default memo(Tile);