import { MouseTransition, TouchTransition } from "react-dnd-multi-backend";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";

export const HTML5toTouch = {
  backends: [
    {
      id: "html5",
      backend: HTML5Backend,
      transition: MouseTransition,
    },
    {
      id: "touch",
      backend: TouchBackend,
      options: { enableMouseEvents: true },
      preview: true,
      transition: TouchTransition,
    },
  ],
};

export const returnError = (message: string) => {
  alert(message);
};

export const getUsername = () => {
  const localUser = localStorage.getItem("user");
  const userObject: any = JSON.parse(localUser ? localUser : "unknown");

  return Object.keys(userObject).length > 2
    ? userObject.user.providerData[0].displayName ?? "unknown"
    : userObject.username
    ? userObject.username
    : "unknown";
};

export const guestCheck = () => {
  const guest = localStorage.getItem("guest");
  const getGuest: boolean = guest && JSON.parse(guest) ? true : false;

  return getGuest;
};

export const changeBoardColor = (
  white: string,
  black: string,
  highlight: string
) => {
  document.body.style.setProperty("--square-white", white);
  document.body.style.setProperty("--square-black", black);
  document.body.style.setProperty("--highlight", highlight);
};

export const initialTimer = (minutes: number, plusSeconds: number) => {
  if (!minutes || !plusSeconds) return;

  return {
    currentUserTimeMinutes: minutes,
    currentUserTimeSeconds: 0,
    opponentTimeMinutes: minutes,
    opponentTimeSeconds: 0,
    currentUserPlaying: true,
    opponentPlaying: false,
    plusSeconds,
  };
};

export const getTypeGame = (type: string) => {
  let typeFiltered;

  if (type.includes("|")) {
    typeFiltered = type.split("|");
  } else {
    typeFiltered = type.split(" ");
  }

  const minutes = parseInt(typeFiltered[0]);
  let plusTime;

  if (typeFiltered[1] === "num") {
    plusTime = 0;
  } else {
    plusTime = parseInt(typeFiltered[1]);
  }

  return initialTimer(minutes, plusTime);
};
