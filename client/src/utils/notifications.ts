export const showNotification = (setLoading: any, setError?: any) => {
  setTimeout(() => {
    setLoading(false);
    setError && setError("");
  }, 2000);
};

export const verifyEmailNotification = () => {
  setTimeout(() => {
    document.getElementById("verify-notification")?.remove();
  }, 1000);
};
