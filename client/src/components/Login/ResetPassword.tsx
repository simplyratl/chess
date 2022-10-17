import React, {useState} from 'react';
import {IoMdClose} from "react-icons/io";
import { auth } from "../../firebase";
import {sendPasswordResetEmail } from "firebase/auth";
import Notification from "../utils/Notifications/Notification";
import {AnimatePresence} from "framer-motion";
import {showNotification} from "../../utils/notifications";

interface ForgotPasswordProps{
	modal:boolean;
	email:string;
}

interface Props {
	forgotPassword:ForgotPasswordProps;
	setForgotPassword: React.Dispatch<React.SetStateAction<ForgotPasswordProps>>;
}

const ResetPassword = ({forgotPassword, setForgotPassword}:Props) => {
	const [error,setError] = useState("");
	const [sent, setSent] = useState(false);

	const handleResetPassword = async (e:any) => {
		e.preventDefault();
		const {email} = forgotPassword;

		try {
			const res = sendPasswordResetEmail(auth, email);

			try {
				setSent(true)
				setTimeout(() => {
					setSent(false);
				}, 1500)
			} catch (e){
				console.log(e);
			}
			return res;
		}catch (e) {
			console.log(e);
		}
	}

	return (
		<>
		<form className="fixed inset-0 bg-[rgba(0,0,0,0.84)] flex justify-center items-center z-40  w-full h-[100vh] overflow-hidden text-white" onSubmit={handleResetPassword}>
			<div className="relative flex justify-center items-center w-[600px] h-auto px-8 py-4 sm:p-4 sm:w-full flex-col bg-background rounded-lg mx-4">

				<span className="absolute right-4 top-4 cursor-pointer hover:text-primary_hover" onClick={() => setForgotPassword({...forgotPassword, modal: false})}><IoMdClose size={28}/></span>

				<h1 className="text-5xl font-black mb-2 font-heading text-center sm:text-3xl">
					Reset password<span className="text-primary">.</span>
				</h1>
				<p className="text-xl mb-4 text-side_heading max-w-md text-center sm:text-lg">
					Fill in the email and get verification code.
				</p>

				<div
					className="max-w-96 w-full mt-8 bg-secondary_gray rounded-[20px] py-2 px-6 flex flex-col border-2 border-secondary_gray focus-within:border-primary_hover transition-all shadow-md">
					<label htmlFor="email" className="text-sm color-s-heading mb-1">
						Email
					</label>
					<input
						className="bg-transparent outline-none w-full h-full"
						type="text"
						name="email"
						value={forgotPassword.email}
						onChange={(e) => setForgotPassword({...forgotPassword, email: e.target.value})}
						autoComplete="off"
						autoCapitalize="off"
						autoCorrect="off"
						required
					/>
				</div>

				<button
					type="submit"
					className="mt-7 bg-primary hover:bg-primary_hover text-white font-bold w-44 px-6 py-2 rounded-md text-center text-lg cursor-pointer transition-all"
				>
					Submit
				</button>
			</div>
		</form>

			<AnimatePresence>
				{sent && <Notification type="success" text="Email sent. If you don't receive it check the spam box."/>}
				{error && error.length > 0 && (
					<Notification type="error" text={error}/>
				)}
			</AnimatePresence>
		</>
	);
}

export default ResetPassword;