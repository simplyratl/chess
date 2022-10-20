import React from "react";
import { motion } from "framer-motion";
import { getUsername } from "../../utils/utils";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useNavigate } from "react-router-dom";

interface Props {
  sideSelect: any;
  currentUser: any;
  playType: string;
  type: string;
}

const PickSide = ({ sideSelect, currentUser, playType, type }: Props) => {
  const navigate = useNavigate();

  const startOnlineGame = async (startingPiece: string): Promise<void> => {
    if (!currentUser?.uid) return alert("Error while making a user.");

    const member = {
      uid: currentUser.uid,
      piece:
        startingPiece === "r"
          ? ["b", "w"][Math.round(Math.random())]
          : startingPiece,
      image: currentUser?.photoURL ?? "",
      name: getUsername(),
      creator: true,
    };

    const game = {
      status: "waiting",
      members: [member],
      gameId: `${Math.random().toString(36).substring(2, 9)}_${Date.now()}`,
      type: type,
    };

    await setDoc(doc(db, "games", game.gameId), game);
    navigate(`/game/${game.gameId}`);
  };

  const startOfflineGame = () => {
    navigate("/game/offline");
  };

  return (
    <motion.div className="absolute inset-0 w-full h-full bg-[rgba(0,0,0,0.84)] flex justify-center items-center">
      <motion.div
        className="bg-background rounded-md max-w-full h-auto px-12 py-4 mx-8 overflow-hidden"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0 }}
      >
        <h3 className="text-center text-white text-4xl font-black font-heading">
          Select the starting side.
        </h3>

        <div className="flex gap-2.5 mt-6 md:flex-col">
          {sideSelect.map(({ label, value }: any) => (
            <span
              key={value}
              className="w-full text-center text-2xl bg-black text-white rounded-md cursor-pointer hover:bg-primary transition-all duration-200 whitespace-nowrap px-8 py-2"
              onClick={() => {
                if (playType === "online") {
                  startOnlineGame(value);
                } else {
                  startOfflineGame();
                }
              }}
            >
              {label}
            </span>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PickSide;
