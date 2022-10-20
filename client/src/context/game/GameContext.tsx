import GameReducers from "./GameReducers";
import { createContext, useReducer } from "react";

interface ProviderProps {
  children: JSX.Element[] | JSX.Element;
}

interface ContextProps {
  flipBoard: boolean;
  dispatch?: any;
}

const INITIAL_STATE = {
  flipBoard: false,
};

export const GameContext = createContext<ContextProps>(INITIAL_STATE);

export const GameContextProvider = ({ children }: ProviderProps) => {
  const [state, dispatch] = useReducer(GameReducers, INITIAL_STATE);

  return (
    <GameContext.Provider value={{ flipBoard: state.flipBoard, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};
