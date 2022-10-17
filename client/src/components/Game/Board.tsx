import React, { useEffect, useState } from "react";
import { getMoves } from "../../utils/game";
import { PieceProps } from "../../utils/gameTypes";
import BoardSquare from "./BoardSquare";

interface Props {
  board: any;
  position: any;
  sideTurn: boolean;
}

const Board = ({ board, position, sideTurn }: Props) => {
  const [currBoard, setCurrBoard] = useState([]);
  const [moves, setMoves] = useState<any[]>([]);
  const [selectedFigure, setSelectedFigure] = useState("");

  useEffect(() => {
    // if (!sideTurn) return setCurrBoard(board.flat());

    setCurrBoard(position === "w" ? board.flat() : board.flat().reverse());
    setSelectedFigure("");
    setMoves([]);
  }, [board, position]);

  const getXYPosition = (i: number) => {
    const x = position === "w" ? i % 8 : Math.abs((i % 8) - 7);
    const y =
      position === "w" ? Math.abs(Math.floor(i / 8) - 7) : Math.floor(i / 8);
    return { x, y };
  };

  const isWhite = (i: number) => {
    const { x, y } = getXYPosition(i);
    return (x + y) % 2 === 0;
  };

  const getPosition = (i: number) => {
    const { x, y } = getXYPosition(i);
    const letter = ["a", "b", "c", "d", "e", "f", "g", "h"][x];
    return `${letter}${y + 1}`;
  };

  useEffect(() => {
    if (selectedFigure.length > 0) {
      setMoves(getMoves(selectedFigure));
    }
  }, [selectedFigure]);

  return (
    <div className="flex flex-wrap w-full h-full rounded-lg overflow-hidden">
      {currBoard.flat().map((piece: PieceProps, i: number) => (
        <div
          key={i}
          className="relative w-[12.5%] aspect-square"
          onClick={() => {
            if (selectedFigure !== getPosition(i)) {
              setSelectedFigure(getPosition(i));
            } else {
              setSelectedFigure("");
              setMoves([]);
            }
          }}
          onDrag={() => setSelectedFigure(getPosition(i))}
        >
          {selectedFigure && (
            <span
              className={`absolute top-[50%] left-[50%] w-[24%] h-[24%] -translate-x-1/2 -translate-y-1/2 rounded-full z-20 pointer-events-none ${
                moves.some((m: string) => m.includes(getPosition(i)))
                  ? isWhite(i)
                    ? "square-black"
                    : "square-white"
                  : "transparent"
              } transition-none opacity-70`}
            ></span>
          )}
          {
            <BoardSquare
              piece={piece}
              white={isWhite(i)}
              position={getPosition(i)}
              player={position}
              selectedFigure={selectedFigure}
              index={i}
            ></BoardSquare>
          }
        </div>
      ))}
    </div>
  );
};

export default Board;
