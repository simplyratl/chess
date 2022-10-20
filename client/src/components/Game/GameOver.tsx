import React from "react";
import { resetGame } from "../../utils/game";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface Props {
  result: string;
  setTimer: any;
}

//DODATI DUGME ZA VRACANJE NAZAD

const GameOver = ({ result, setTimer }: Props) => {
  return (
    <div className="absolute inset-0 flex justify-center items-center bg-[rgba(0,0,0,0.84)] z-50 h-full w-full">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="w-auto bg-secondary_gray py-4 px-8 rounded-md flex flex-col justify-between text-white"
      >
        <div className="text-center text-2xl font-semibold">
          <h2 className="text-5xl font-bold mb-2">GAME OVER</h2>
          <p className="mb-12">{result}</p>
        </div>
        <div className="flex gap-4">
          <Link
            to="/"
            className="bg-[#535353] hover:bg-[#8e8e8e] rounded-md text-lg font-bold text-white text-center py-2 flex-1"
          >
            Back
          </Link>
          <button
            onClick={() => resetGame(setTimer)}
            className="bg-primary rounded-md text-lg font-bold text-white py-2 flex-1 hover:bg-primary_hover"
          >
            New Game
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default GameOver;
