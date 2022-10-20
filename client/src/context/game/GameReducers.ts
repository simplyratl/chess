const GameReducers = (state: any, action: any) => {
  switch (action.type) {
    case "FLIP_BOARD":
      return {
        flipBoard: !state.flipBoard,
      };
    case "START_FLIPPING":
      return {
        flipBoard: true,
      };
    default: {
      return state;
    }
  }
};

export default GameReducers;
