import React, {useEffect, useState} from "react";
import {signInAnonymously} from "firebase/auth";
import {auth} from "../../firebase";
import {Link, useLocation, useNavigate} from "react-router-dom";
import Loader from "../utils/Loader/Loader";
import Notification from "../utils/Notifications/Notification";
import {motion} from "framer-motion";
import {showNotification} from "../../utils/notifications";

const UserForm = () => {
	const [name, setName] = useState("");
	const [loggedIn, setLoggedIn] = useState(false);
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const location = useLocation();

	const handleSubmit = async (e: any): Promise<void> => {
		e.preventDefault();

		if (loading) return;

		setLoading(true);

		await signInAnonymously(auth)
			.then(() => {
				setLoggedIn(true);
				localStorage.setItem("user", JSON.stringify({username: name}));
				localStorage.setItem("guest", "true");
				showNotification(setLoading);
			})
			.catch((error) => {
				console.log(error);
				setLoading(false);
			});
	};

	useEffect(() => {
		if (loggedIn && loading && location?.state?.lastURL) {
			navigate(`${location.state.lastURL}`);
		}
	}, [loggedIn, loading]);

	useEffect(() => {
		if (loggedIn && !loading && !location?.state?.lastURL) {
			navigate("/");
		}
	}, [loggedIn, loading]);

	return (
		<>
			<form
				className="flex justify-center items-center flex-col w-full h-[100vh] overflow-hidden bg-background-color relative m-0"
				onSubmit={handleSubmit}
			>
				<motion.div
					initial={{scale: 0}}
					animate={{scale: 1}}
					transition={{ease: [0.86, 0, 0.07, 1], duration: 0.4}}
					className="glass text-[#EBEBEB] rounded-3xl max-w-96 max-h-full px-24 sm:p-0 sm:max-w-full sm:w-full"
				>
					<div className="relative flex justify-center items-center w-[420px] h-full py-8 sm:p-4 sm:w-full">
						<div className="w-full h-full flex flex-col justify-center items-center">
							<h1 className="text-5xl font-black mb-2 font-heading text-center sm:text-3xl">
								Guest Sign In<span className="text-primary">.</span>
							</h1>
							<p className="text-xl mb-4 text-side_heading max-w-md text-center sm:text-lg">
								Sign in with just a username and play immediately.
							</p>
							<div
								className="max-w-96 w-full mt-8 bg-secondary_gray rounded-[20px] py-2 px-6 flex flex-col border-2 border-secondary_gray focus-within:border-primary_hover transition-all shadow-md">
								<label
									htmlFor="username"
									className="text-sm color-s-heading mb-1"
								>
									Username
								</label>
								<input
									className="bg-transparent outline-none w-full h-full"
									type="text"
									// placeholder="Enter your username"
									value={name}
									onChange={(e) => setName(e.target.value)}
									name="username"
									autoComplete="off"
									autoCapitalize="off"
									autoCorrect="off"
									required
								/>
							</div>

							{loading && <Loader position="absolute" center={true}/>}

							<button
								type="submit"
								className="mt-7 bg-primary hover:bg-primary_hover text-white font-bold w-44 px-6 py-2 rounded-md text-center text-lg cursor-pointer transition-all"
							>
								Start
							</button>

							<div className="flex gap-4 mt-4">
								<Link to="/login" className="text-lg hover:text-primary_hover">
									Login
								</Link>
								<Link
									to="/register"
									className="text-lg hover:text-primary_hover"
								>
									Register
								</Link>
							</div>
						</div>
					</div>
				</motion.div>

				<div
					className="absolute inset-0 w-full h-full z-[-1] sm:brightness-75"
					style={{
						backgroundImage: `url(${require("../../assets/images/wallpaper_authentiaction.webp")})`,
						backgroundSize: "cover",
						backgroundRepeat: "no-repeat",
						backgroundPosition: "center",
					}}
				></div>
			</form>

			{loggedIn && <Notification type="success" text="Successful sign in."/>}
		</>
	);
};

export default UserForm;
