export const flipBoard = (flip: boolean) => ({
  type: "FLIP_BOARD",
  payload: flip,
});

export const startFlippingBoard = () => ({
  type: "START_FLIPPING",
});
