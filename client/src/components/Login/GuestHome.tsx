import React, { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { getUsername, guestCheck } from "../../utils/utils";
import { AnimatePresence, motion } from "framer-motion";

const GuestHome = () => {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);

  const { currentUser } = auth;
  const [showModal, setShowModal] = useState(false);
  const [playType, setPlayType] = useState<string>("");

  useEffect(() => {
    if (!guestCheck()) {
      navigate("/");
    }
  }, []);

  const newGameOptions = [
    { label: "Black Pieces", value: "b" },
    { label: "White Pieces", value: "w" },
    { label: "Random", value: "r" },
  ];

  const handlePlayOnline = () => {
    setPlayType("online");
    setShowModal(true);
  };

  const handlePlayOffline = () => {
    setPlayType("offline");
    setShowModal(true);
  };

  const startOnlineGame = async (startingPiece: string): Promise<void> => {
    if (!currentUser?.uid) return alert("Error while making a user.");

    const member = {
      uid: currentUser.uid,
      piece:
        startingPiece === "r"
          ? ["b", "w"][Math.round(Math.random() * 1)]
          : startingPiece,
      name: getUsername(),
      creator: true,
    };

    const game = {
      status: "waiting",
      members: [member],
      gameId: `${Math.random().toString(36).substring(2, 9)}_${Date.now()}`,
    };

    await setDoc(doc(db, "games", game.gameId), game);
    navigate(`/game/${game.gameId}`);
  };

  const startOfflineGame = (value: any) => {
    alert("offline");

    navigate("/game/offline", { state: { offline: true } });
  };

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user]);

  return (
    <>
      <div className="h-[100vh]">
        <div className="flex">
          <div
            className="flex justify-center items-center flex-1 h-[100vh] bg-black text-white text-[2.6vw] font-semibold overflow-hidden cursor-pointer group"
            onClick={handlePlayOffline}
          >
            <p className="group-hover:scale-110 transition-transform duration-200">
              Play Locally
            </p>
          </div>
          <div
            className="flex justify-center items-center flex-1 h-[100vh] bg-primary text-[2.6vw] font-semibold overflow-hidden cursor-pointer group"
            onClick={handlePlayOnline}
          >
            <p className="group-hover:scale-110 transition-transform duration-200">
              Play Online
            </p>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div className="absolute inset-0 w-full h-full bg-[rgba(0,0,0,0.84)] flex justify-center items-center">
            <motion.div
              className="bg-white rounded-md w-[40%] h-[24%] p-[2%]"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
            >
              <h3 className="text-center text-[2vw] font-bold">
                Select the starting side.
              </h3>

              <div className="flex gap-[1%] mt-[4%]">
                {newGameOptions.map(({ label, value }) => (
                  <span
                    key={value}
                    className="w-full text-center text-[1.4vw] bg-black text-white rounded-md p-[1.2%] cursor-pointer hover:bg-[#202020] transition-all duration-200"
                    onClick={() => {
                      if (playType === "online") {
                        startOnlineGame(value);
                      } else {
                        startOfflineGame(value);
                      }
                    }}
                  >
                    {label}
                  </span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default GuestHome;
