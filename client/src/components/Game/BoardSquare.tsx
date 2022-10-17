import React, { useEffect, useState } from "react";
import { useDrop } from "react-dnd";
import { gameSubject, handleMove } from "../../utils/game";
import { PieceProps } from "../../utils/gameTypes";
import Piece from "./Piece";
import Promote from "./Promote";
import Square from "./Square";

interface Props {
  piece: PieceProps;
  white: boolean;
  position: string;
  index: number;
  player: string;
  selectedFigure: string;
}

const BoardSquare = ({
  piece,
  white,
  position,
  index,
  player,
  selectedFigure,
}: Props) => {
  const [promotion, setPromotion] = useState(null);

  const [, drop] = useDrop({
    accept: "piece",
    drop: (item: { id: string }) => {
      const [fromPosition] = item.id.split("_");
      handleMove(fromPosition, position);
    },
  });

  useEffect(() => {
    const subscribe = gameSubject.subscribe(({ pendingPromotion }: any) =>
      pendingPromotion && pendingPromotion.to === position
        ? setPromotion(pendingPromotion)
        : setPromotion(null)
    );
    return () => subscribe.unsubscribe();
  }, [position]);

  const clickMove = () => {
    handleMove(selectedFigure, position);
  };

  return (
    <>
      <div className="w-full aspect-square" ref={drop} onClick={clickMove}>
        <Square
          white={white}
          index={index}
          player={player}
          selectedFigure={selectedFigure}
          position={position}
        >
          {promotion ? (
            <Promote promotion={promotion} />
          ) : (
            piece && <Piece piece={piece} position={position} />
          )}
        </Square>
      </div>
    </>
  );
};

export default BoardSquare;
