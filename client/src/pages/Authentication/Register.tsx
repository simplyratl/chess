import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { auth } from "../../firebase";
import { AnimatePresence, motion } from "framer-motion";
import Loader from "../../components/utils/Loader/Loader";
import Notification from "../../components/utils/Notifications/Notification";
import { showNotification } from "../../utils/notifications";
import { fireBaseErrorCatch } from "../../utils/errors";

interface UserDataProps {
  username: string;
  email: string;
  password: string;
  confirm_password: string;
}

const Register = () => {
  const [registered, setRegistered] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<UserDataProps>({
    username: "",
    password: "",
    confirm_password: "",
    email: "",
  });
  const [user, setUser] = useState<string | null>(null);

  const handleSubmit = async (e: any): Promise<void> => {
    e.preventDefault();
    const { username, password, confirm_password, email } = userData;

    setLoading(true);

    if (!username || !password || !confirm_password || !email) {
      setError(fireBaseErrorCatch("All inputs must be filled."));
      showNotification(setLoading, setError);

      return;
    }

    if (password !== confirm_password) {
      setError(fireBaseErrorCatch("Passwords don't match."));
      showNotification(setLoading, setError);
      return;
    }

    try {
      const user = await createUserWithEmailAndPassword(auth, email, password);
      const { currentUser } = auth;
      setUser(user.user.email);
      showNotification(setLoading);

      if (currentUser) {
        await sendEmailVerification(currentUser);

        await updateProfile(currentUser, {
          displayName: username,
        }).catch((err) => console.log(err));

        setRegistered(true);
      }
    } catch (FirebaseError: any) {
      setError(FirebaseError.code && fireBaseErrorCatch(FirebaseError.code));
      showNotification(setLoading, setError);
    }
  };

  useEffect(() => {
    const unSubscribeAuth = onAuthStateChanged(
      auth,
      async (authenticatedUser) => {
        if (authenticatedUser) {
          setUser(authenticatedUser.email);
        } else {
          setUser(null);
        }
      }
    );

    return unSubscribeAuth;
  }, [user]);

  return (
    <>
      <form
        className="flex justify-center items-center flex-col w-full h-[100vh] overflow-hidden bg-background-color relative m-0 pt-24"
        onSubmit={handleSubmit}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ ease: [0.86, 0, 0.07, 1], duration: 0.4 }}
          className="glass text-[#EBEBEB] rounded-3xl max-w-96 max-h-full px-24 sm:p-0 sm:max-w-full sm:w-full"
        >
          <div className="relative flex justify-center items-center w-[420px] h-full py-8 sm:p-4 sm:w-full">
            <div className="w-full h-full flex flex-col justify-center items-center">
              <h1 className="text-5xl font-black mb-2 font-heading text-center sm:text-3xl">
                Register<span className="text-primary">.</span>
              </h1>
              <p className="text-xl mb-4 text-side_heading max-w-md text-center sm:text-lg">
                Register with your existing account.
              </p>
              <div className="max-w-96 w-full sm:w-full mt-8 bg-secondary_gray rounded-[20px] py-2 px-6 flex flex-col border-2 border-secondary_gray focus-within:border-primary_hover transition-all shadow-md">
                <label
                  htmlFor="username"
                  className="text-sm color-s-heading mb-1"
                >
                  Username
                </label>
                <input
                  className="bg-transparent outline-none w-full h-full"
                  type="text"
                  value={userData.username}
                  onChange={(e) =>
                    setUserData({ ...userData, username: e.target.value })
                  }
                  name="username"
                  autoComplete="off"
                  autoCapitalize="off"
                  autoCorrect="off"
                />
              </div>
              <div className="max-w-96 w-full mt-8 bg-secondary_gray rounded-[20px] py-2 px-6 flex flex-col border-2 border-secondary_gray focus-within:border-primary_hover transition-all shadow-md">
                <label
                  htmlFor="password"
                  className="text-sm color-s-heading mb-1"
                >
                  Email
                </label>
                <input
                  className="bg-transparent outline-none w-full h-full"
                  type="email"
                  value={userData.email}
                  onChange={(e) =>
                    setUserData({ ...userData, email: e.target.value })
                  }
                  name="email"
                  autoComplete="off"
                  autoCapitalize="off"
                  autoCorrect="off"
                />
              </div>
              <div className="max-w-96 w-full mt-8 bg-secondary_gray rounded-[20px] py-2 px-6 flex flex-col border-2 border-secondary_gray focus-within:border-primary_hover transition-all shadow-md">
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
                    setUserData({ ...userData, password: e.target.value })
                  }
                  name="password"
                  autoComplete="off"
                  autoCapitalize="off"
                  autoCorrect="off"
                />
              </div>
              <div className="max-w-96 w-full mt-8 bg-secondary_gray rounded-[20px] py-2 px-6 flex flex-col border-2 border-secondary_gray focus-within:border-primary_hover transition-all shadow-md">
                <label
                  htmlFor="confirm_password"
                  className="text-sm color-s-heading mb-1"
                >
                  Confirm Password
                </label>
                <input
                  className="bg-transparent outline-none w-full h-full"
                  type="password"
                  value={userData.confirm_password}
                  onChange={(e) =>
                    setUserData({
                      ...userData,
                      confirm_password: e.target.value,
                    })
                  }
                  name="confirm_password"
                  autoComplete="off"
                  autoCapitalize="off"
                  autoCorrect="off"
                />
              </div>

              {loading && <Loader position="absolute" center={true} />}

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

      <AnimatePresence>
        {registered && (
          <Notification type="success" text="User successfuly created." />
        )}

        {error.length > 0 && <Notification type="error" text={error} />}
      </AnimatePresence>
    </>
  );
};

export default Register;
