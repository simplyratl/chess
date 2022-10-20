import React from "react";
import { motion } from "framer-motion";
import { GiSilverBullet } from "react-icons/gi";
import { AiFillThunderbolt } from "react-icons/ai";
import { MdTimer } from "react-icons/md";

interface Props {
  setPickSide: any;
  setGameType: any;
  setMinutes: any;
  setTitle: any;
  setPlusSeconds: any;
}

const TypeGame = ({
  setPickSide,
  setGameType,
  setMinutes,
  setTitle,
  setPlusSeconds,
}: Props) => {
  const bullet = [
    { label: "1 min", minutes: 1, plusSeconds: 0 },
    { label: "1|1", minutes: 1, plusSeconds: 1 },
    { label: "2|1", minutes: 2, plusSeconds: 1 },
  ];
  const blitz = [
    { label: "3 min", minutes: 3, plusSeconds: 0 },
    { label: "3|2", minutes: 3, plusSeconds: 2 },
    { label: "5 min", minutes: 5, plusSeconds: 0 },
  ];
  const rapid = [
    { label: "10 min", minutes: 10 },
    { label: "15|10", minutes: 15, plusSeconds: 10 },
    { label: "30 min", minutes: 30, plusSeconds: 0 },
  ];

  return (
    <section className="absolute inset-0 w-full h-full bg-[rgba(0,0,0,0.84)] flex justify-center items-center md:items-baseline md:min-h-max">
      <motion.div
        className="relative md:top-24 bg-background rounded-md max-w-full h-auto px-12 py-4 mx-8 overflow-hidden md:mb-12"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0 }}
      >
        <h3 className="text-center text-white text-4xl font-black font-heading">
          Select the starting side.
        </h3>

        <h3 className="text-white text-1xl flex items-center gap-1">
          <GiSilverBullet />
          Bullet
        </h3>
        <div className="flex gap-2.5 mt-2 mb-6   md:flex-col">
          {bullet.map(({ label, minutes, plusSeconds }) => (
            <span
              key={label}
              className="w-full text-center text-2xl bg-black text-white rounded-md cursor-pointer hover:bg-primary transition-all duration-200 whitespace-nowrap px-8 py-2 w-40 md:w-full"
              onClick={() => {
                setTitle(label);
                setMinutes(minutes);
                setPlusSeconds(plusSeconds);
                setGameType(false);
                setPickSide(true);
              }}
            >
              {label}
            </span>
          ))}
        </div>
        <h3 className="text-white text-1xl flex items-center gap-1">
          <AiFillThunderbolt />
          Blitz
        </h3>
        <div className="flex gap-2.5 mt-2 mb-6   md:flex-col">
          {blitz.map(({ label, minutes, plusSeconds }) => (
            <span
              key={label}
              className="w-full text-center text-2xl bg-black text-white rounded-md cursor-pointer hover:bg-primary transition-all duration-200 whitespace-nowrap px-8 py-2 w-40 md:w-full"
              onClick={() => {
                setTitle(label);
                setMinutes(minutes);
                setPlusSeconds(plusSeconds);
                setGameType(false);
                setPickSide(true);
              }}
            >
              {label}
            </span>
          ))}
        </div>
        <h3 className="text-white text-1xl flex items-center gap-1">
          <MdTimer /> Rapid
        </h3>
        <div className="flex gap-2.5 mt-2 mb-6   md:flex-col">
          {rapid.map(({ label, minutes, plusSeconds }) => (
            <span
              key={label}
              className="w-full text-center text-2xl bg-black text-white rounded-md cursor-pointer hover:bg-primary transition-all duration-200 whitespace-nowrap px-8 py-2 w-40 md:w-full"
              onClick={() => {
                setTitle(label);
                setMinutes(minutes);
                setPlusSeconds(plusSeconds);
                setGameType(false);
                setPickSide(true);
              }}
            >
              {label}
            </span>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default TypeGame;
