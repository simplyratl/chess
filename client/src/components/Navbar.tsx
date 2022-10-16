import {signOut} from "firebase/auth";
import React, {useEffect, useState} from "react";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "../firebase";
import {IoMdSettings} from "react-icons/io";
import {Link, useLocation} from "react-router-dom";
import BoardStyles from '../json/board_styles.json';
import {changeBoardColor} from "../utils/utils";
import {AnimatePresence, motion} from 'framer-motion';


const Navbar = () => {
	const [user] = useAuthState(auth);
	const [showSettings, setShowSettings] = useState(false);
	const location = useLocation();

	useEffect(() => {
		setShowSettings(false);
	}, [location])

	const handleSignOut = (e: any) => {
		if (user) {
			e.preventDefault();
			localStorage.removeItem("user");
			localStorage.removeItem("guest");
			signOut(auth);
		}
	};

	const handleSettings = (e: any) => {
		if (!user) return;

		e.preventDefault();
		setShowSettings(!showSettings);
	}

	useEffect(() => {
		if (localStorage.getItem('board-style')) {

			// @ts-ignore
			const style = JSON.parse(localStorage.getItem('board-style')) ?? {
				white: "#FFCC9C",
				black: "#CF8948"
			};
			changeBoardColor(style.white, style.black);
		}
	}, [])

	const selectBoardStyle = (style: any) => {
		changeBoardColor(style.white, style.black);
		localStorage.setItem('board-style', JSON.stringify(style));
	}

	return (
		<div className="absolute top-0 left-0 w-full z-50">
			<div className="flex justify-between items-center px-8 py-6 sm:px-4">
				<div className="flex items-center">
					<Link to="/" className="w-16 sm:w-10">
						<img
							src="https://images.vexels.com/media/users/3/254909/isolated/preview/77c9c816f3811004b63c2d18f363544e-pawn-black-chess-piece-color-illustration.png"
							alt="Logo"
							className="w-full h-full object-contain"
						/>
					</Link>

					<ul className="flex text-white gap-6 ml-6 sm:gap-3">
						<li className="text-xl sm:text-sm font-medium hover:text-primary_hover transition-colors">
							<Link to="/">Home</Link>
						</li>
						<li className="text-xl sm:text-sm font-medium hover:text-primary_hover transition-colors">
							<Link to="/">Play</Link>
						</li>
					</ul>
				</div>

				<ul className="text-white flex items-center gap-6 sm:gap-3">
					<li className="text-xl sm:text-sm font-medium hover:text-primary_hover transition-colors">
						{!user && (
							<Link to="/login">
								<span className="cursor-pointer">Login</span>
							</Link>
						)}
					</li>
					<li className="text-xl sm:text-sm font-medium hover:text-primary_hover transition-colors">
						<Link to="/register" className="flex justify-center items-center" onClick={handleSettings}>
							<button
								type="submit"
								className={`${
									!user &&
									"bg-primary w-32 h-12 sm:w-max-w-18 sm:w-full sm:h-full sm:px-4 sm:py-1 rounded-md "
								}shadow-md hover:scale-105 transition-transform`}
							>
								{user ? <IoMdSettings size={32} onClick={() => setShowSettings(!showSettings)}/> : "Sign in"}
							</button>
						</Link>
					</li>
				</ul>

				<AnimatePresence>
					{showSettings &&
              <motion.div
                  className="absolute right-8 top-20 max-w-[400px] h-auto bg-secondary_gray p-4 rounded-lg origin-top overflow-hidden"
                  initial={{height: 0, opacity: 0}}
                  animate={{height: 'auto', opacity: 1}}
                  exit={{height: 0, opacity: 0}}
                  transition={{ease: 'easeInOut', duration: 0.2}}
              >
                  <ul className="text-white">
                      <a href="#">
                          <li className="text-lg hover:bg-primary_hover transition-colors rounded-md p-2">Settings</li>
                      </a>
                      <li>
                          <div className="p-2">
                              <p className="text-lg mb-2">Board style</p>

                              <div className="grid grid-cols-3 gap-2">
																{BoardStyles.map((style, index) => (
																	<div
																		className="flex flex-col w-full h-full hover:bg-primary_hover p-1 rounded-lg cursor-pointer transition-colors"
																		key={index}
																		onClick={() => selectBoardStyle(style.squares)}
																	>
																		<img
																			src={style.image}
																			alt="Okay" className="w-full h-full object-contain aspect-square rounded-lg"/>
																		<p className="text-white text-center mt-1">{style.title}</p>
																	</div>
																))}

                              </div>
                          </div>
                      </li>
                      <li className="text-lg hover:bg-primary_hover transition-colors rounded-md p-2 cursor-pointer"
                          onClick={handleSignOut}>Sign Out
                      </li>
                  </ul>
              </motion.div>}
				</AnimatePresence>
			</div>
		</div>
	);
};

export default Navbar;
