import React from "react";
import { move } from "../../utils/game";
import { PendingPromoProps } from "../../utils/gameTypes";

interface Props {
  promotion: PendingPromoProps;
}

const Promote = ({ promotion: { from, to, color } }: Props) => {
  const promotionPieces = ["r", "n", "b", "q"];

  return (
    <div className="fixed inset-0 w-full h-full bg-[#00000030] flex justify-center items-center z-30">
      <div className="w-[34%] h-[34%] bg-[#fefefe] rounded-md">
        <h3 className="text-center font-bold text-xl">Promote a pawn</h3>
        <div className="flex">
          {promotionPieces.map((p, i: number) => (
            <div
              key={i}
              className="flex justify-center items-center w-full h-full cursor-pointer hover:scale-105"
              onClick={() => move(from, to, p)}
            >
              <img
                className="w-[60%] aspect-square object-contain"
                src={require(`../../assets/figures/${color.color}${p}.png`)}
                alt={p}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Promote;
