import { createSlice, configureStore, PayloadAction } from "@reduxjs/toolkit";
import { dragEndReducer } from "./reducers/dragEnd";

import { moveBelowReducer } from "./reducers/moveBelow";

// Define the type for the state
export interface CandyCrushState {
  board: string[];
  boardSize: number;
  squareBeingReplaced: undefined;
  squareBeingDragged: undefined;
  squareBeingDraggedOver: { x: number; y: number } | undefined;
  adjacentTiles: { x: number; y: number }[];
}


const initialState: CandyCrushState = {
  board: [],
  boardSize: 8,
  squareBeingDragged: undefined,
  squareBeingDraggedOver: undefined,
  squareBeingReplaced: undefined,
  adjacentTiles: [],
};

const candyCrushSlice = createSlice({
  name: "cryptoCrush",
  initialState,
  reducers: {
    updateBoard: (state, action: PayloadAction<string[]>) => {
      state.board = action.payload;
    },
    dragStart: (state, action: PayloadAction<any>) => {
      state.squareBeingDragged = action.payload;
    },
    dragDrop: (state, action: PayloadAction<any>) => {
      state.squareBeingReplaced = action.payload;
    },
    dragOver: (state, action: PayloadAction<any>) => {
      state.squareBeingDraggedOver = action.payload;
    },
    dragEnd: dragEndReducer,
    moveBelow: moveBelowReducer,

  },
});

export const store = configureStore({
  reducer: {
    candyCrush: candyCrushSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const { updateBoard, moveBelow, dragDrop, dragEnd, dragStart, 
  dragOver } =
  candyCrushSlice.actions;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
