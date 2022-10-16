import "./style/style.scss";
import Game from "./pages/Game";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "./firebase";
import UserForm from "./components/Login/UserForm";
import GuestHome from "./components/Login/GuestHome";
import Navbar from "./components/Navbar";
import Loader from "./components/utils/Loader/Loader";
import Login from "./pages/Authentication/Login";
import Register from "./pages/Authentication/Register";
import AuthHome from "./pages/AuthHome";

function App() {
    const [user, loading, error] = useAuthState(auth);

    if (loading) {
        return (
          <div className="h-[100vh]">
              <h2>
                  <Loader position="absolute" center={true}/>
              </h2>
          </div>
        );
    }
    if (error) {
        return (
          <>
              <h2>There was an error ...</h2>
          </>
        );
    }

    return (
      <main className="min-h-[100vh] overflow-x-hidden">
          <Router>
              <Navbar/>
              <Routes>
                  <Route path="/guest" element={<GuestHome/>}/>
                  <Route path="/" element={<AuthHome/>}/>
                  <Route path="/login-guest" element={<UserForm/>}/>
                  <Route path="/login" element={<Login/>}/>
                  <Route path="/register" element={<Register/>}/>
                  <Route path="/game/:id" element={<Game/>}/>
                  <Route path="/game/offline" element={<Game/>}/>
              </Routes>
          </Router>
      </main>
    );
}

export default App;
