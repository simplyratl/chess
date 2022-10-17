import React, { useEffect, useState } from "react";

interface Props {
  children: JSX.Element[] | JSX.Element;
  white: boolean;
  index: number;
  player: string;
  selectedFigure: string;
  position: string;
}

const Square = ({
  children,
  white,
  index,
  player,
  selectedFigure,
  position,
}: Props) => {
  const INITIAL_BACKGROUND = white ? "square-white" : "square-black";
  const [background, setBackground] = useState<string>(INITIAL_BACKGROUND);
  const textColor = white ? "color-black" : "color-white";
  const leftIndicatorWhite = 8 - index / 8;
  const leftIndicatorBlack = index / 8 + 1;

  useEffect(() => {
    if (position === selectedFigure) {
      setBackground("highlight");
    } else {
      setBackground(INITIAL_BACKGROUND);
    }
  }, [selectedFigure]);

  const letter = ["a", "b", "c", "d", "e", "f", "g", "h"][
    player === "w" ? index - 56 : Math.abs(index - 63)
  ];

  const bottomIndicator = letter;

  return (
    <div className={`relative w-full h-full ${background}`}>
      {children}
      <span
        className={`absolute top-0 left-0 p-2 text-[1vw] ${textColor} pointer-events-none`}
        style={{ opacity: index % 8 === 0 ? 1 : 0 }}
      >
        {player === "w" ? leftIndicatorWhite : leftIndicatorBlack}
      </span>
      <span
        className={`absolute bottom-0 right-0 p-2 text-[1vw] ${textColor} pointer-events-none`}
        style={{ opacity: index >= 56 ? 1 : 0 }}
      >
        {bottomIndicator}
      </span>
    </div>
  );
};

export default Square;
