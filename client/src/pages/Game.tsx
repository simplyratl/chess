import React, { useContext, useEffect, useState } from "react";
import Board from "../components/Game/Board";
import {
  gameSubject,
  getHistory,
  initGame,
  resign,
  timeEnd,
} from "../utils/game";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { doc } from "firebase/firestore";
import { auth, db } from "../firebase";
import "../style/components/game/game_utils.scss";
import { useAuthState } from "react-firebase-hooks/auth";
import Notification from "../components/utils/Notifications/Notification";
import { showNotification } from "../utils/notifications";
import { AnimatePresence } from "framer-motion";
import { AiOutlineRotateRight } from "react-icons/ai";
import GameOver from "../components/Game/GameOver";
import { flippingBoard, startFlipBoard } from "../context/game/gameCalls";
import { GameContext } from "../context/game/GameContext";
import { getTypeGame, initialTimer } from "../utils/utils";
import { Timer } from "../utils/gameTypes";

const Game = () => {
  const [board, setBoard] = useState<any>([]);
  const [isGameOver, setIsGameOver] = useState(null);
  const [result, setResult] = useState(null);
  const [position, setPosition] = useState(null);
  const [initResult, setInitResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [game, setGame] = useState<any>(null);
  const sharableLink = window.location.href;
  const [user] = useAuthState(auth);
  const [copiedLink, setCopiedLink] = useState(false);
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [sideTurn, setSideTurn] = useState("b");
  const { currentUser } = auth;
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  const minutes = 3;
  const plusSeconds = 0;
  const INITIAL = {
    currentUserTimeMinutes: minutes,
    currentUserTimeSeconds: 0,
    opponentTimeMinutes: minutes,
    opponentTimeSeconds: 0,
    currentUserPlaying: true,
    opponentPlaying: false,
    plusSeconds,
  };

  let conditionPosition = params.id ? sideTurn : position;
  const currUser = {
    seconds: "currentUserTimeSeconds",
    minutes: "currentUserTimeMinutes",
  };
  const opponent = {
    seconds: "opponentTimeSeconds",
    minutes: "opponentTimeMinutes",
  };
  const getUser: any = conditionPosition === "w" ? currUser : opponent;

  const [time, setTime] = useState<Timer>(
    initialTimer(minutes, plusSeconds) ?? INITIAL
  );

  getTypeGame("3|1");

  const { dispatch, flipBoard } = useContext(GameContext);

  useEffect(() => {
    if (!user || !localStorage.getItem("user"))
      navigate("/login", { state: { lastURL: location.pathname } });
  }, [user]);

  useEffect(() => {
    if (type) {
      setTime(getTypeGame(type) ?? INITIAL);
    }
  }, [type]);

  useEffect(() => {
    if (params.id) {
      startFlipBoard(dispatch);
    }
  }, []);

  useEffect(() => {
    let subscribe: any;

    if (!params.id) {
      initGame(null);
      setLoading(false);

      subscribe = gameSubject.subscribe((game: any) => {
        setBoard(game.board);
        setIsGameOver(game.isGameOver);
        setResult(game.result);
        setPosition(game.position);
        setType(game.type);
        setGame(game);
      });

      return () => subscribe && subscribe.unsubscribe();
    }

    const init = async () => {
      const res: any = await initGame(
        params.id !== "local" ? doc(db, `games/${params.id}`) : null
      );
      setInitResult(res);
      setLoading(false);

      if (!res) {
        subscribe = gameSubject.subscribe((game: any) => {
          setBoard(game.board);
          setIsGameOver(game.isGameOver);
          setResult(game.result);
          setPosition(game.position);
          setType(game.type);
          setSideTurn(game.sideTurn);
          setStatus(game.status);
          setGame(game);
        });
      }

      setTime(getTypeGame(type) || INITIAL);
    };

    init();

    return () => subscribe && subscribe.unsubscribe();
  }, [params.id]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(sharableLink);
      setCopiedLink(true);
      showNotification(setCopiedLink);
    } catch (e) {
      setCopiedLink(false);
      console.log(e, "error");
    }
  };

  useEffect(() => {
    const timerUserPlaying = () => {
      if (status.length === 0 || status === "waiting") {
        setTime({ ...time, currentUserPlaying: false, opponentPlaying: false });
        return;
      }

      if (conditionPosition === "w") {
        setTime({ ...time, currentUserPlaying: true, opponentPlaying: false });
      } else {
        setTime({ ...time, opponentPlaying: true, currentUserPlaying: false });
      }
    };

    timerUserPlaying();
  }, [conditionPosition, status]);

  const currentCalculateTime = () => {
    if (!time)
      return {
        minutes: 0,
        seconds: 0,
      };

    // @ts-ignore
    if (time[getUser.seconds] === 0) {
      return {
        // @ts-ignore
        minutes: time[getUser.minutes] - 1,
        seconds: 59,
      };
    } else {
      return {
        // @ts-ignore
        minutes: time[getUser.minutes],
        // @ts-ignore
        seconds: time[getUser.seconds] - 1,
      };
    }
  };

  useEffect(() => {
    let interval: any = null;

    if (!time) return () => clearInterval(interval);
    if (isGameOver) return () => clearInterval(interval);

    if (time.currentUserPlaying) {
      interval = setInterval(() => {
        setTime({
          ...time,
          currentUserTimeSeconds: currentCalculateTime().seconds,
          currentUserTimeMinutes: currentCalculateTime().minutes,
        });
      }, 1000);
    } else {
      interval = setInterval(() => {
        setTime({
          ...time,
          opponentTimeSeconds: currentCalculateTime().seconds,
          opponentTimeMinutes: currentCalculateTime().minutes,
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  });

  useEffect(() => {
    if (!time) return;

    const {
      currentUserTimeMinutes,
      opponentTimeMinutes,
      currentUserTimeSeconds,
      opponentTimeSeconds,
    } = time;

    if (
      (opponentTimeMinutes <= 0 && opponentTimeSeconds === 0) ||
      (currentUserTimeMinutes <= 0 && currentUserTimeSeconds === 0)
    ) {
      timeEnd();
    }
  }, [time]);

  const addZero = (second: number) => {
    return second <= 9 ? `0${second}` : second;
  };

  return (
    <>
      <section className="relative m-auto max-w-[1280px] h-screen flex justify-center items-center">
        <section className="relative w-[74vmin] board">
          {isGameOver && (
            <GameOver result={result ?? "Unknown"} setTimer={setTime} />
          )}
          {loading && <h3>Loading...</h3>}

          <div className="flex justify-between items-center mb-2">
            <div className="bg-secondary_gray text-white px-6 py-2 rounded-2xl text-xl font-semibold">
              {time && time.opponentTimeMinutes} :{" "}
              {time && addZero(time.opponentTimeSeconds)}
            </div>

            {game?.oponent && game?.oponent.name && (
              <>
                <div className="flex gap-3 items-center mb-3">
                  <img
                    src={game.oponent.image ?? ""}
                    alt="Opponent"
                    className="w-12 object-fit rounded-full"
                  />
                  <span className="inline-block max-w-[60%] text-center mt-2 text-xl bg-primary px-4 py-1 rounded-lg text-white">
                    {game.oponent.name}
                  </span>
                </div>
              </>
            )}

            <div className="flex items-center gap-4">
              {!params.id && (
                <AiOutlineRotateRight
                  size={28}
                  className={`cursor-pointer ${
                    flipBoard ? "text-red-600" : "text-white"
                  }`}
                  onClick={() => flippingBoard(flipBoard, dispatch)}
                />
              )}

              {params.id && !game?.oponent && (
                <p
                  className="text-white text-lg mb-[2%] cursor-pointer hover:text-primary_hover"
                  onClick={copyToClipboard}
                >
                  Copy Link
                </p>
              )}

              <button
                className="bg-red-600 text-white rounded-lg h-8 px-10 hover:bg-red-800"
                onClick={() => resign()}
              >
                Resign
              </button>
            </div>
          </div>

          <Board board={board} position={position} />

          <div className="flex items-center mt-2 gap-4">
            {game?.member && game?.member.name && (
              <div className="flex gap-3 items-center">
                <img
                  src={game.member.image ?? ""}
                  alt="You"
                  className="w-11 object-fit rounded-full"
                />
                <span className="inline-block max-w-[200px] text-center h-full text-xl bg-primary px-6 py-2 rounded-lg text-white">
                  {game.member.name}
                </span>
              </div>
            )}

            <div className="bg-secondary_gray text-white w-[120px] text-center px-6 py-2 rounded-2xl text-xl font-semibold">
              {time && time.currentUserTimeMinutes} :{" "}
              {time && addZero(time.currentUserTimeSeconds)}
            </div>
          </div>

          <div className="max-w-full overflow-x-auto mt-4">
            {getHistory().map((history: any, index) => (
              <span key={index} className="text-lg text-white ml-3 first:m-0">
                {history.san}
              </span>
            ))}
          </div>
        </section>
      </section>

      <AnimatePresence>
        {copiedLink && <Notification type="info" text="Copied link." />}
      </AnimatePresence>
    </>
  );
};

export default Game;
