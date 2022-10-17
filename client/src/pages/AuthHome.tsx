import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { getUsername, guestCheck } from "../utils/utils";
import Notification from "../components/utils/Notifications/Notification";
import { AnimatePresence, motion } from "framer-motion";

const AuthHome = () => {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);

  const { currentUser } = auth;
  const [showModal, setShowModal] = useState(false);
  const [playType, setPlayType] = useState<string>("");

  useEffect(() => {
    if (guestCheck()) {
      navigate("/guest");
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
          ? ["b", "w"][Math.round(Math.random())]
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

  const startOfflineGame = () => {
    navigate("/game/offline");
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
            className="flex justify-center items-center flex-1 h-[100vh] bg-red-600 text-[2.6vw] font-semibold overflow-hidden cursor-pointer group"
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
          <motion.div className="absolute inset-0 w-full h-full bg-[rgba(0,0,0,0.6)] flex justify-center items-center">
            <motion.div
              className="bg-white rounded-md max-w-full h-auto px-12 py-4 mx-8 overflow-hidden"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
            >
              <h3 className="text-center text-4xl font-black font-heading">
                Select the starting side.
              </h3>

              <div className="flex gap-2.5 mt-6 md:flex-col">
                {newGameOptions.map(({ label, value }) => (
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
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!user?.emailVerified && (
          <div id="verify-notification">
            <Notification text="Please verify your email." type="info" />
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AuthHome;
