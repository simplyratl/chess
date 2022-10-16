import React, {useEffect, useState} from "react";
import {IoIosCheckmarkCircle, IoMdClose} from "react-icons/io";
import {MdOutlineError} from "react-icons/md";
import {AiFillInfoCircle} from "react-icons/ai";
import {motion} from "framer-motion";

interface Props {
	type: string;
	text: string;
}

const Notification = ({type, text}: Props) => {
	const [color, setColor] = useState("#202020");
	const [icon, setIcon] = useState<any>(null);
	const [removed, setRemoved] = useState(false);

	useEffect(() => {
		const getType = () => {
			if (type === "success") {
				setColor("#31C48D");
				setIcon(<IoIosCheckmarkCircle size={28}/>);
			} else if (type === "error") {
				setColor("#E63E3D");
				setIcon(<MdOutlineError size={28}/>);
			} else if (type === "info") {
				setColor("#1A56DB");
				setIcon(<AiFillInfoCircle size={28}/>);
			}
		};

		getType();
	}, []);

	return (
		<>
			{!removed ? (
				<motion.div
					className="sm:mx-4 sm:text-center"
					initial={{opacity: 0, x: "100%"}}
					animate={{opacity: 1, x: "0"}}
					exit={{opacity: 0, x: "100%"}}
					transition={{ease: 'easeInOut', duration: 0.4}}
				>
					<div
						className={`fixed bottom-12 right-12 max-w-80 px-8 py-4 rounded-xl shadow-lg text-white sm:right-0 sm:max-w-full sm:w-full`}
						style={{
							border: `2px solid ${color}`,
							backgroundColor: `${color}60`,
						}}
					>
						<div className="flex justify-center items-center gap-2">
							{icon}
							<p className="text-lg sm:text-base">{text}</p>

							{type === "info" && (
								<div
									className="hover:text-red-600 cursor-pointer"
									onClick={() => setRemoved(true)}
								>
									<IoMdClose size={28}/>
								</div>
							)}
						</div>
					</div>
				</motion.div>
			) : null}
		</>
	);
};

export default Notification;
