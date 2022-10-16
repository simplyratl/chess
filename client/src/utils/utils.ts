import {MouseTransition, TouchTransition} from "react-dnd-multi-backend";
import {HTML5Backend} from "react-dnd-html5-backend";
import {TouchBackend} from "react-dnd-touch-backend";

export const HTML5toTouch = {
	backends: [
		{
			id: 'html5',
			backend: HTML5Backend,
			transition: MouseTransition,
		},
		{
			id: 'touch',
			backend: TouchBackend,
			options: {enableMouseEvents: true},
			preview: true,
			transition: TouchTransition,
		},
	],
}

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

export const changeBoardColor = (white: string, black: string) => {
	document.body.style.setProperty('--square-white', white);
	document.body.style.setProperty('--square-black', black);
}