import React, { useEffect, useState } from "react";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { guestCheck } from "../utils/utils";
import Notification from "../components/utils/Notifications/Notification";
import { AnimatePresence } from "framer-motion";
import TypeGame from "../components/Game/TypeGame";
import PickSide from "../components/Game/PickSide";

const AuthHome = () => {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);

  const { currentUser } = auth;
  const [pickSide, setPickSide] = useState(false);
  const [gameType, setGameType] = useState(false);
  const [playType, setPlayType] = useState<string>("");
  const [amountPlayers, setAmountPlayers] = useState(0);

  const [title, setTitle] = useState("");
  const [minutes, setMinutes] = useState(0);
  const [plusSeconds, setPlusSeconds] = useState(0);

  useEffect(() => {
    if (guestCheck()) {
      navigate("/guest");
    }
  }, []);

  const sideSelect = [
    { label: "Black Pieces", value: "b" },
    { label: "White Pieces", value: "w" },
    { label: "Random", value: "r" },
  ];

  const handlePlayOnline = () => {
    setPlayType("online");
    setGameType(true);
  };

  const handlePlayOffline = () => {
    setPlayType("offline");
    setGameType(true);
  };

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user]);

  return (
    <>
      <section className="h-[100vh] md:h-full mx-auto max-w-[1640px] px-12">
        <div className="relative flex justify-between items-center lg:flex-col h-full gap-36">
          <div className="flex-1 lg:absolute lg:top-[500px]">
            <h1 className="text-white text-9xl font-black font-heading xl:text-8xl md:justify-center">
              Play online chess
            </h1>
            <p className="text-white text-2xl xl:text-xl">
              8 players playing now.
            </p>
            <div className="flex flex-col w-80 xl:w-full">
              <button
                type="button"
                className="bg-primary text-white w-full py-3 text-2xl rounded-lg mt-8 font-bold hover:bg-primary_hover transition-colors duration-100 xl:text-xl"
                onClick={handlePlayOnline}
              >
                PLAY ONLINE
              </button>
              <button
                type="button"
                className="bg-secondary_gray text-white w-full py-3 text-2xl rounded-lg mt-2 font-bold hover:bg-primary_hover transition-colors duration-100 xl:text-xl"
                onClick={handlePlayOffline}
              >
                PLAY LOCALLY
              </button>
            </div>
          </div>

          <div className="w-[1000px] xl:w-[700px] select-none flex-2">
            <img
              src={require("../assets/images/svgs/hero_animation.svg").default}
              alt="Hero"
              className="w-full h-full pointer-events-none"
            />
          </div>
        </div>
      </section>

      <AnimatePresence>
        {gameType && (
          <TypeGame
            setPickSide={setPickSide}
            setGameType={setGameType}
            setMinutes={setMinutes}
            setTitle={setTitle}
            setPlusSeconds={setPlusSeconds}
          />
        )}

        {pickSide && (
          <PickSide
            sideSelect={sideSelect}
            currentUser={currentUser}
            playType={playType}
            type={title}
          />
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
