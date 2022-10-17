export const fireBaseErrorCatch = (code: any) => {
  switch (code) {
    case "auth/wrong-password":
      return "Wrong password, try again.";
    case "auth/email-already-in-use":
      return "Email already in use.";
    case "auth/user-not-found":
      return "User not found.";
    default:
      return code;
  }
};
