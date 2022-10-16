import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import {DndProvider} from "react-dnd";
import {MultiBackend} from "react-dnd-multi-backend";
import {HTML5toTouch} from "./utils/utils";
// import { HTML5toTouch } from "rdndmb-html5-to-touch";

const root = ReactDOM.createRoot(
	document.getElementById("root") as HTMLElement
);

root.render(
	<React.StrictMode>
		<DndProvider backend={MultiBackend} options={HTML5toTouch}>
			<App/>
		</DndProvider>
	</React.StrictMode>
);
