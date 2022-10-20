import React from "react";
import { move } from "../../utils/game";
import { PendingPromoProps } from "../../utils/gameTypes";
import { motion } from "framer-motion";

interface Props {
  promotion: PendingPromoProps;
}

const Promote = ({ promotion: { from, to, color } }: Props) => {
  const promotionPieces = ["r", "n", "b", "q"];

  return (
    <div className="fixed inset-0 w-full h-full bg-[rgba(0,0,0,0.84)] flex justify-center items-center z-50">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="w-[600px] py-6 px-8 h-auto bg-secondary_gray rounded-md mx-8"
      >
        <h3 className="text-center font-bold text-4xl text-white mb-4">
          Promote a pawn
        </h3>
        <div className="flex">
          {promotionPieces.map((p, i: number) => (
            <div
              key={i}
              className="flex justify-center items-center w-full h-full cursor-pointer hover:scale-105 drop-shadow-xs"
              onClick={() => move(from, to, p)}
            >
              <img
                className="w-[60%] aspect-square object-contain sm:w-24"
                src={require(`../../assets/figures/${color.color}${p}.png`)}
                alt={p}
              />
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Promote;
