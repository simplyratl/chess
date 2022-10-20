import { flipBoard, startFlippingBoard } from "./GameActions";

export const flippingBoard = (flipState: boolean, dispatch: any) => {
  dispatch(flipBoard(flipState));
};

export const startFlipBoard = (dispatch: any) => {
  dispatch(startFlippingBoard());
};
