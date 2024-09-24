import React, { useState } from 'react';
import { dragDrop, dragEnd, dragStart, dragOver } from "../../store/index";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import debounce from 'lodash/debounce';

interface SquareState {
    initialSquare: number;
    draggedOverSquare: any;
    isBeingDragged: boolean;
    glowingElements: HTMLImageElement[];
    playedSoundForElement: Set<number>;
    };

    export function useTouchHandlers(
        setSquareState: React.Dispatch<React.SetStateAction<SquareState>>,
        isBeingDragged: boolean,
        initialSquare: number,
        draggedOverSquare: any,
        glowingElements: HTMLImageElement[],
        playedSoundForElement: any,
    ) {

    // redux state extraction 
    const squareBeingDragged = useAppSelector((state) => state.candyCrush.squareBeingDragged);
    const squareBeingDraggedOver = useAppSelector((state) => state.candyCrush.squareBeingDraggedOver);

    const dispatch = useAppDispatch();

    const handleTouchStart = (e: React.TouchEvent<HTMLImageElement>) => {

        setSquareState(prevState => ({
            ...prevState,
            isBeingDragged: true
        }));
        const touch = e.changedTouches[0]; // Get the first touch point
        const target = document.elementFromPoint(touch.clientX, touch.clientY); // Get the element under the touch
    
        if (target instanceof HTMLImageElement) { // Ensure it's an image element
    
            const candyId = parseInt(target.getAttribute('candy-id') || '0', 10);
            target.style.boxShadow = "0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 30px #00ffff, 0 0 40px #00ffff";
            target.style.transform = "scale(1.3)"; // Grow the size by 10%
            setSquareState(prevState => ({
            ...prevState,
            initialSquare:candyId
            })) // reset initial square
            dispatch(dragStart(target));
        }
        };

        const handleDebouncedTouchMove = debounce((e) => {
        //  touch move handling logic goes here
        }, 100); // Adjust the debounce delay as needed
    
        let lastTouchX = 0;
        let lastTouchY = 0;
        let lastTouchTime = 0;
        const threshold = 1.5; // Adjust as needed based on testing and user feedback
    
        const handleTouchMove = (e: React.TouchEvent<HTMLImageElement>) => {
        handleDebouncedTouchMove(e); // Invoke the debounced touch move handler
    
        const touch = e.changedTouches[0]; // Get the first touch point
        const target = document.elementFromPoint(touch.clientX, touch.clientY); // Get the element under the touch
        const touchX = touch.clientX;
        const touchY = touch.clientY;
        const currentTime = Date.now();
        const timeDiff = currentTime - lastTouchTime;
        const distanceX = Math.abs(touchX - lastTouchX);
        const distanceY = Math.abs(touchY - lastTouchY);
        const isFastDrag = timeDiff > 0 && (distanceX / timeDiff > threshold || distanceY / timeDiff > threshold);
    
        // If the drag is fast, clear the box-shadow of all candy images
        if (isFastDrag) {
            const candyImages = document.querySelectorAll('img[candy-id]');
    
            // Type assertion to inform TypeScript that 'candyImages' is a NodeList of HTMLImageElement
            candyImages.forEach((img) => {
            if (img instanceof HTMLImageElement && img !== squareBeingDragged) {        // Type assertion to inform TypeScript that 'img' is an HTMLImageElement
                img.style.boxShadow = '';
            }
            });
        }
    
        lastTouchX = touchX;
        lastTouchY = touchY;
        lastTouchTime = currentTime;
    
        if (target instanceof HTMLImageElement) { // Ensure it's an image element
            const candyId = parseInt(target.getAttribute('candy-id') || '0', 10);
    
            const squareBeingDraggedInitialPosition = (squareBeingDragged as any).getAttribute('candy-id');
    
            const positionX = (squareBeingDraggedOver as any)?.positionX;
            const positionY = (squareBeingDraggedOver as any)?.positionY;
            const squareBeingDraggedOverPosition = positionY * 8 + positionX;
    
            // Apply glow effect only to the dragged image
            // Check for adjacency in all directions (including diagonals)
            // Check for adjacency in all directions (including diagonals)
            
            if (
            Math.abs(squareBeingDraggedInitialPosition - squareBeingDraggedOverPosition) === 1 || // check horizontal adjacency
            Math.abs(squareBeingDraggedInitialPosition - squareBeingDraggedOverPosition) === 8 || // Check for vertical adjacency
            (Math.abs(squareBeingDraggedInitialPosition - squareBeingDraggedOverPosition) === 7) || // Check for diagonal adjacency (top-left/bottom-right)
            (Math.abs(squareBeingDraggedInitialPosition - squareBeingDraggedOverPosition) === 9) // Check for diagonal adjacency (top-right/bottom-left)
    
            ) {
    
            if (!glowingElements.some((element) => parseInt(element.getAttribute('candy-id') || '0', 10) === candyId
            )) {
                // Add the target element only if its candy-id doesn't exist in the array
                if (target !== squareBeingDragged) {
                setSquareState(prevState =>({
                    ...prevState,
                    glowingElements: [...prevState.glowingElements, target]
                }));
                
                // setGlowingElements((prevElements) => [...prevElements, target]);
                }
            }
    
            if (glowingElements.length > 1) {
    
                if (squareBeingDraggedOverPosition !== squareBeingDraggedInitialPosition) {
    
                const updatedElements = glowingElements.slice(1); // Remove the first element
                glowingElements[0].style.boxShadow = ''; // Remove glow effect from the last element
                setSquareState(prevState =>({
                    ...prevState,
                    glowingElements: updatedElements
                }));
                }
    
            }
            if (squareBeingDraggedOverPosition !== squareBeingDraggedInitialPosition
                && (target !== squareBeingDragged)
            ) {
                target.style.boxShadow = isBeingDragged ? "0 0 10px #ffffe0, 0 0 20px #ffffe0, 0 0 30px #ffffe0, 0 0 40px #ffffe0" : ''; // Apply glow effect
    
            } else {
                target.style.boxShadow = '';
            }
            if (!isBeingDragged) {
                target.style.boxShadow = '';
            }
    
            if (target === squareBeingDragged) {
                if(glowingElements[0]) {
                glowingElements[0].style.boxShadow = '';
                }
            }
            }
    
            else if (candyId !== initialSquare) {
            target.style.boxShadow = ""; // Remove glow effect if not adjacent
            target.style.transform = ""; // Reset size
            } else {
            target.style.boxShadow = "0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 30px #00ffff, 0 0 40px #00ffff";
            }
    
            dispatch(dragOver({ positionX: candyId % 8, positionY: Math.floor(candyId / 8) }));
            setSquareState(prevState=>({
            ...prevState,
            draggedOverSquare:target
            }))
        }
        };

        const handleTouchEnd = (e: React.TouchEvent<HTMLImageElement>) => {
        e.preventDefault(); // Prevent default touch behavior
        const touch = e.changedTouches[0]; // Get the first touch point
        const target = document.elementFromPoint(touch.clientX, touch.clientY); // Get the element under the touch
    
        if (target instanceof HTMLImageElement) { // Ensure it's an image element
    
            target.style.boxShadow = ""; // Remove the box shadow
            target.style.transform = ""; // Grow the size by 10%    console.log('it works', isBeingDragged)
    
            const touchTarget = document.elementFromPoint(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
            if (touchTarget) {
            target.style.boxShadow = ""; // Remove the box shadow
            target.style.transform = ""; // Grow the size by 10%    console.log('it works', isBeingDragged)      dispatch(dragDrop(touchTarget));
            dispatch(dragDrop(touchTarget));
            setSquareState(prevState=>({
                ...prevState,
                isBeingDragged:false}));
            }
    
            (squareBeingDragged as any).style.boxShadow = '';
            (squareBeingDragged as any).style.transform = '';
    
            glowingElements[0].style.boxShadow = ""; // Remove the box shadow
            glowingElements[0].style.transform = ""; // Grow the size by 10%
            dispatch(dragEnd());
            setSquareState(prevState=>({
            ...prevState,
            isBeingDragged:false}));
        }
    
        };

        const handlePointerLeave = (e: React.PointerEvent<HTMLImageElement>) => {
        e.preventDefault(); // Prevent default touch behavior
        const target = e.target as HTMLImageElement;
        target.style.boxShadow = ""; // Remove the box shadow
        target.style.transform = ""; // Grow the size by 10%    console.log('it works', isBeingDragged)      dispatch(dragDrop(touchTarget));
        if(glowingElements[0]) {
        glowingElements[0].style.boxShadow = ""; // Remove the box shadow
        glowingElements[0].style.transform = ""; // Grow the size by 10%
        }
        dispatch(dragEnd());
        setSquareState(prevState=>({
            ...prevState,
            isBeingDragged:false}));
        }

        return {
        handleTouchStart, 
        handleTouchMove, 
        handleTouchEnd, 
        handlePointerLeave};

}