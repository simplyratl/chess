import { BehaviorSubject } from "rxjs";
import { Chess } from "chess.js";
import { PendingPromoProps } from "./gameTypes";
import { auth } from "../firebase";
import { getDoc, updateDoc } from "firebase/firestore";
import { fromRef } from "rxfire/firestore";
import { map } from "rxjs/operators";
import { getUsername } from "./utils";

let gameRef: any;
let member: any;

const chess = new Chess();

export let gameSubject: any;

export const initGame = async (gameRefFb: any) => {
  const { currentUser } = auth;

  if (gameRefFb) {
    gameRef = gameRefFb;

    const initialGame: any = await getDoc(gameRefFb).then((doc) => doc.data());

    if (!initialGame) {
      return;
    }

    const creator = initialGame.members.find((m: any) => m.creator === true);

    if (initialGame.status === "waiting" && creator.uid !== currentUser?.uid) {
      const currUser = {
        uid: currentUser?.uid,
        name: getUsername(),
        piece: creator.piece === "w" ? "b" : "w",
      };
      const updatedMembers = [...initialGame.members, currUser];

      await updateDoc(gameRefFb, {
        members: updatedMembers,
        status: "ready",
      });
    } else if (
      !initialGame.members.map((m: any) => m.uid).includes(currentUser?.uid)
    ) {
      alert("Not allowed to join");
      return;
    }

    chess.reset();

    gameSubject = fromRef(gameRefFb).pipe(
      map((gameDoc) => {
        const game: any = gameDoc.data();
        const { pendingPromotion, gameData, ...restOfGame } = game;
        member = game.members.find((m: any) => m.uid === currentUser?.uid);
        const oponent = game.members.find(
          (m: any) => m.uid !== currentUser?.uid
        );

        if (gameData) {
          chess.load(gameData);
        }

        const isGameOver = chess.isGameOver();
        return {
          board: chess.board(),
          pendingPromotion,
          isGameOver,
          position: member.piece,
          member,
          oponent,
          result: isGameOver ? getGameResult() : null,
          ...restOfGame,
        };
      })
    );
  } else {
    gameRef = null;
    gameSubject = new BehaviorSubject({
      board: null,
      pendingPromotion: null,
      isGameOver: null,
      result: null,
    });

    const savedGame = sessionStorage.getItem("savedGame");
    if (savedGame) {
      chess.load(savedGame);
    }
    updateGame(null, null);
  }
};

export const handleMove = (from: string, to: string) => {
  let temp: any = chess.moves({ verbose: true });
  let promotions = [];

  for (let i = 0; i < temp.length; i++) {
    if (temp[i].promotion) {
      promotions.push(temp[i]);
    }
  }

  let pendingPromotion;

  if (promotions.some((p) => `${p.from}${p.to}` === `${from}${to}`)) {
    pendingPromotion = {
      from,
      to,
      color: promotions[0],
    };
    updateGame(pendingPromotion, null);
  }

  if (!pendingPromotion) {
    move(from, to, null);
  }
};

export const move = (from: any, to: any, promotion: any) => {
  let tempMove: any = { from, to };

  if (promotion) {
    tempMove.promotion = promotion;
  }

  if (gameRef) {
    if (member.piece === chess.turn()) {
      const legalMove = chess.move(tempMove);

      if (legalMove) {
        updateGame(null, null);
      }
    }
  } else {
    const legalMove = chess.move(tempMove);

    if (legalMove) {
      updateGame(null, null);
    }
  }
};

export const updateGame = async (
  pendingPromotion: PendingPromoProps | null,
  reset: any
) => {
  const isGameOver = chess.isGameOver();

  if (gameRef) {
    const updatedData: any = {
      gameData: chess.fen(),
      pendingPromotion: pendingPromotion || null,
    };

    if (isGameOver) {
      updatedData.status = "finished";
    }

    if (reset) {
      updatedData.status = "rematch";
    }

    await updateDoc(gameRef, updatedData);
  } else {
    const newGame = {
      board: chess.board(),
      pendingPromotion,
      isGameOver,
      position: chess.turn(),
      result: isGameOver ? getGameResult() : null,
    };

    sessionStorage.setItem("savedGame", chess.fen());
    gameSubject.next(newGame);
  }
};

export const resetGame = async () => {
  if (gameRef) {
    await updateGame(null, true);
    chess.reset();
  } else {
    chess.reset();
    updateGame(null, null);
  }
};

export const getMoves = (from: any) => {
  const legalMove = chess.moves({ square: from });

  return legalMove;
};

export const getGameResult = () => {
  let returnString;

  if (chess.inCheck()) {
    const winner = chess.turn() === "w" ? "BLACK" : "WHITE";
    returnString = `CHECKMATE - WINNER - ${winner}`;
  } else if (chess.isDraw()) {
    let reason = "50 - MOVES - RULE";
    if (chess.isStalemate()) {
      reason = "STALEMATE";
    } else if (chess.isThreefoldRepetition()) {
      reason = "REPETITION";
    } else if (chess.isInsufficientMaterial()) {
      reason = "INSUFFICIENT MATERIAL";
    }
    returnString = `DRAW - ${reason}`;
  } else {
    returnString = "UNKNOWN REASON";
  }

  return returnString;
};
