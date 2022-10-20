import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Loader from "../components/utils/Loader/Loader";
import { IoImage } from "react-icons/io5";
import { auth } from "../firebase";

interface UserInfoProps {
  username: string;
  email: string;
  password: string;
  image: any;
}

const Settings = () => {
  const { currentUser } = auth;
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfoProps>({
    username: currentUser?.displayName ?? "",
    email: currentUser?.email ?? "",
    password: "",
    image: currentUser?.photoURL ?? "",
  });

  useEffect(() => {
    const handleSubmit = () => {
      if (!userInfo.image) return alert("Error uploading files.");
    };
    handleSubmit();
  }, [userInfo.image]);

  return (
    <>
      <form className="flex justify-center items-center flex-col w-full h-[100vh] overflow-hidden bg-background-color relative m-0">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ ease: [0.86, 0, 0.07, 1], duration: 0.4 }}
          className="glass text-[#EBEBEB] rounded-3xl max-w-96 max-h-full px-24 sm:p-0 sm:max-w-full sm:w-full"
        >
          <div className="relative flex justify-center items-center w-[420px] h-full py-8 sm:p-4 sm:w-full">
            <div className="w-full h-full flex flex-col justify-center items-center">
              <h1 className="text-5xl font-black mb-2 font-heading text-center sm:text-3xl">
                Update your account<span className="text-primary">.</span>
              </h1>
              <p className="text-xl mb-4 text-side_heading max-w-md text-center sm:text-lg">
                Change your profile by your liking.
              </p>
              <div className="max-w-96 w-full mt-8 bg-secondary_gray rounded-[20px] py-2 px-6 flex flex-col border-2 border-secondary_gray focus-within:border-primary_hover transition-all shadow-md">
                <label
                  htmlFor="username"
                  className="text-sm color-s-heading mb-1"
                >
                  Username
                </label>
                <input
                  className="bg-transparent outline-none w-full h-full"
                  type="text"
                  value={userInfo.username}
                  onChange={(e) =>
                    setUserInfo({ ...userInfo, username: e.target.value })
                  }
                  name="username"
                  autoComplete="off"
                  autoCapitalize="off"
                  autoCorrect="off"
                  required
                />
              </div>
              <div className="max-w-96 w-full mt-8 bg-secondary_gray rounded-[20px] py-2 px-6 flex flex-col border-2 border-secondary_gray focus-within:border-primary_hover transition-all shadow-md">
                <label htmlFor="email" className="text-sm color-s-heading mb-1">
                  Email
                </label>
                <input
                  className="bg-transparent outline-none w-full h-full"
                  type="email"
                  name="email"
                  value={userInfo.email}
                  onChange={(e) =>
                    setUserInfo({ ...userInfo, email: e.target.value })
                  }
                  autoComplete="off"
                  autoCapitalize="off"
                  autoCorrect="off"
                  required
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
                  name="password"
                  value={userInfo.password}
                  onChange={(e) =>
                    setUserInfo({ ...userInfo, password: e.target.value })
                  }
                  autoComplete="off"
                  autoCapitalize="off"
                  autoCorrect="off"
                  required
                />
              </div>
              <div className="mt-8 w-full">
                <label className="block mb-2">Profile Picture</label>
                <div className="flex flex-wrap justify-center items-center gap-6">
                  <img
                    src={userInfo.image}
                    alt="Profile Image"
                    className="w-32 aspect-square rounded-3xl"
                  />
                  <div className="relative group overflow-hidden">
                    <input
                      type="file"
                      onChange={(e) => {
                        setUserInfo({
                          ...userInfo,
                          // @ts-ignore
                          image: e.target.files[0] ?? "",
                        });
                      }}
                      name="image"
                      accept="image/*"
                      className="absolute inset-0 cursor-pointer scale-[10] opacity-0"
                    />
                    <label
                      htmlFor="image"
                      className="bg-primary text-white inline-block flex-1 h-14 flex justify-center items-center rounded-md whitespace-nowrap px-8 gap-1 overflow-hidden group-hover:bg-primary_hover cursor-pointer"
                    >
                      <IoImage size={21} />
                      Choose new image
                    </label>
                  </div>
                </div>
              </div>

              {loading && <Loader position="absolute" center={true} />}

              <button
                type="submit"
                className="mt-7 bg-primary hover:bg-primary_hover text-white font-bold w-44 px-6 py-2 rounded-md text-center text-lg cursor-pointer transition-all"
              >
                Submit
              </button>
            </div>
          </div>
        </motion.div>

        <div
          className="absolute inset-0 w-full h-full z-[-1] sm:brightness-75"
          style={{
            backgroundImage: `url(${require("../assets/images/wallpaper_authentiaction.webp")})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
        ></div>
      </form>
    </>
  );
};

export default Settings;
