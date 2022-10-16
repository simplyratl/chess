import React from "react";
import { resetGame } from "../../utils/game";

interface Props {
  result: string;
}

//DODATI DUGME ZA VRACANJE NAZAD

const GameOver = ({ result }: Props) => {
  return (
    <div className="absolute inset-0 flex justify-center items-center bg-[rgba(0,0,0,0.6)]">
      <div className="w-[30%] aspect-square bg-[#fefefe] py-[2%] px-[3%] rounded-md flex flex-col justify-between">
        <div className="text-center text-[1.4vw] font-semibold">
          <h2 className="text-[4vw] font-bold">GAME OVER</h2>
          <p>{result}</p>
        </div>
        <button
          onClick={resetGame}
          className="bg-red-600 rounded-md text-[1.4vw] font-bold text-white py-[2%]"
        >
          New Game
        </button>
      </div>
    </div>
  );
};

export default GameOver;
