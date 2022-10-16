import React, {useEffect, useState} from "react";
import Board from "../components/Game/Board";
import GameOver from "../components/Game/GameOver";
import {gameSubject, initGame} from "../utils/game";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {doc} from "firebase/firestore";
import {auth, db} from "../firebase";
import "../style/components/game/game_utils.scss";
import {useAuthState} from "react-firebase-hooks/auth";
import {TbRotate360} from "react-icons/tb";
import Notification from "../components/utils/Notifications/Notification";
import {showNotification} from "../utils/notifications";
import {AnimatePresence} from "framer-motion";

const Game = () => {
	const [board, setBoard] = useState<any>([]);
	const [isGameOver, setIsGameOver] = useState(null);
	const [result, setResult] = useState(null);
	const [position, setPosition] = useState(null);
	const [initResult, setInitResult] = useState(null);
	const [loading, setLoading] = useState(true);
	const [game, setGame] = useState<any>(null);
	const sharebleLink = window.location.href;
	const [user] = useAuthState(auth);
	const [sideTurn, setSideTurn] = useState(false);
	const [copiedLink, setCopiedLink] = useState(false);

	const navigate = useNavigate();
	const location = useLocation();

	const params = useParams();

	useEffect(() => {
		if (!user || !localStorage.getItem("user"))
			navigate("/login", {state: {lastURL: location.pathname}});
	}, [user]);

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
					setGame(game);
				});
			}
		};

		init();

		return () => subscribe && subscribe.unsubscribe();
	}, [params.id]);

	async function copyToClipboard() {
		try {
			await navigator.clipboard.writeText(sharebleLink);
			setCopiedLink(true);
			showNotification(setCopiedLink);
		} catch (e) {
			setCopiedLink(false);
			console.log(e);
		}
	}

	return (
		<>
			<section className="h-[100vh] flex justify-center items-center">
				<section className="relative w-[40%] board aspect-square">
					{isGameOver && <GameOver result={result ? result : ""}/>}
					{loading && <h3>Loading...</h3>}

					<div className="flex gap-4">
						<p
							className="text-white text-md mb-[2%] cursor-pointer hover:text-primary_hover"
							onClick={copyToClipboard}
						>
							Copy Link
						</p>
						{Object.keys(params).length === 0 && (
							<p
								className="text-white text-md mb-[2%] cursor-pointer"
								onClick={() => setSideTurn(!sideTurn)}
							>
								<TbRotate360 size={28}/>
							</p>
						)}
					</div>

					{game?.oponent && game?.oponent.name && (
						<span
							className="inline-block max-w-[60%] text-ellipsis overflow-hidden text-center relative mb-2 text-xl bg-red-600 px-4 py-1 rounded-lg text-white">
            {game.oponent.name}
          </span>
					)}
					<Board board={board} position={position} sideTurn={sideTurn}/>
					{game?.member && game?.member.name && (
						<span
							className="inline-block max-w-[60%] text-center mt-2 text-xl bg-primary px-4 py-1 rounded-lg text-white">
            {game.member.name}
          </span>
					)}
				</section>
			</section>

			<AnimatePresence>
				{copiedLink && <Notification type='info' text='Copied link.'/>}
			</AnimatePresence>
		</>
	);
};

export default Game;