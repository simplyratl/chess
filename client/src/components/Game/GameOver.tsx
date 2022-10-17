import React from "react";
import { resetGame } from "../../utils/game";
import {Link} from "react-router-dom";

interface Props {
  result: string;
}

//DODATI DUGME ZA VRACANJE NAZAD

const GameOver = ({ result }: Props) => {
  return (
    <div className="absolute inset-0 flex justify-center items-center bg-[rgba(0,0,0,0.6)] z-50 h-[100vh] w-full">
      <div className="w-auto bg-[#fefefe] py-4 px-8 rounded-md flex flex-col justify-between">
        <div className="text-center text-2xl font-semibold">
          <h2 className="text-5xl font-bold mb-2">GAME OVER</h2>
          <p className="mb-12">{result}</p>
        </div>
        <div className="flex gap-4">
          <Link
            to='/login'
            className="bg-amber-700 rounded-md text-lg font-bold text-white py-2 flex-1"
          >
            Back
          </Link>
          <button
            onClick={resetGame}
            className="bg-primary rounded-md text-lg font-bold text-white py-2 flex-1 hover:bg-primary_hover"
          >
            New Game
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameOver;
