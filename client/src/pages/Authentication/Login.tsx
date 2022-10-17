import {signInWithEmailAndPassword} from "firebase/auth";
import React, {useEffect, useState} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {auth} from "../../firebase";
import {showNotification} from "../../utils/notifications";
import {AnimatePresence, motion} from "framer-motion";
import Loader from "../../components/utils/Loader/Loader";
import Notification from "../../components/utils/Notifications/Notification";
import {returnError} from "../../utils/utils";
import {fireBaseErrorCatch} from "../../utils/errors";
import ResetPassword from "../../components/Login/ResetPassword";

interface UserDataProps {
	email: string;
	password: string;
}

interface ForgotPasswordProps{
	modal:boolean;
	email:string;
}

const Login = () => {
	const [loggedIn, setLoggedIn] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const navigate = useNavigate();
	const location = useLocation();
	const [userData, setUserData] = useState<UserDataProps>({
		email: "",
		password: "",
	});
	const [forgotPassword, setForgotPassword] = useState<ForgotPasswordProps>({
		modal: false,
		email: ""
	});

	const handleSubmit = async (e: any): Promise<void> => {
		e.preventDefault();

		const {email, password} = userData;

		if (!email || !password) returnError("You have to input all the fields.");

		setLoading(true);

		try {
			const getUser = await signInWithEmailAndPassword(auth, email, password);
			localStorage.setItem("user", JSON.stringify(getUser));
			setLoggedIn(true);
			showNotification(setLoading);
		} catch (FirebaseError: any) {
			setLoading(false);
			setError(FirebaseError.code && fireBaseErrorCatch(FirebaseError.code));
			showNotification(setLoading, setError);
		}
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
								Login<span className="text-primary">.</span>
							</h1>
							<p className="text-xl mb-4 text-side_heading max-w-md text-center sm:text-lg">
								Login with your existing account.
							</p>
							<div
								className="max-w-96 w-full mt-8 bg-secondary_gray rounded-[20px] py-2 px-6 flex flex-col border-2 border-secondary_gray focus-within:border-primary_hover transition-all shadow-md">
								<label htmlFor="email" className="text-sm color-s-heading mb-1">
									Email
								</label>
								<input
									className="bg-transparent outline-none w-full h-full"
									type="text"
									value={userData.email}
									onChange={(e) =>
										setUserData({...userData, email: e.target.value})
									}
									name="email"
									autoComplete="off"
									autoCapitalize="off"
									autoCorrect="off"
									required
								/>
							</div>
							<div
								className="max-w-96 w-full mt-8 bg-secondary_gray rounded-[20px] py-2 px-6 flex flex-col border-2 border-secondary_gray focus-within:border-primary_hover transition-all shadow-md">
								<label
									htmlFor="password"
									className="text-sm color-s-heading mb-1"
								>
									Password
								</label>
								<input
									className="bg-transparent outline-none w-full h-full"
									type="password"
									value={userData.password}
									onChange={(e) =>
										setUserData({...userData, password: e.target.value})
									}
									name="password"
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
								<button type="button" className="text-lg hover:text-primary_hover" onClick={() => setForgotPassword({...forgotPassword, modal: true})}>
									Forgot password?
								</button>
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

			<AnimatePresence>
				{loggedIn && <Notification type="success" text="Successful sign in."/>}
				{error && error.length > 0 && (
					<Notification type="error" text={error}/>
				)}
			</AnimatePresence>

			{forgotPassword.modal && <ResetPassword forgotPassword={forgotPassword} setForgotPassword={setForgotPassword} />}
		</>
	);
};

export default Login;
