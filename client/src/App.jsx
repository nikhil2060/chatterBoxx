import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Register from "./pages/Register";
import Login from "./pages/Login";
import SetAvatar from "./comp/SetAvatar";
import PhotoPicker from "./pages/PhotoPicker";
import GlobalStyles from "./styles/GlobalStyles";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import { UsersProvider } from "./contexts/UsersContext";
import axios from "axios";
import { getMyProfileRoute } from "./utils/AuthRoutes";

function App() {
  useEffect(() => {
    axios
      .get(getMyProfileRoute, {
        withCredentials: true,
      })
      .then((res) => console.log(res))
      .catch((err) => console.error(err));
  }, []);

  return (
    <UsersProvider>
      <BrowserRouter>
        <GlobalStyles />
        <Routes>
          {/* <Route index element={<LandingPage />}></Route> */}
          <Route path="chat/:userId" element={<Chat />}></Route>
          <Route path="register" element={<Register />}></Route>
          <Route path="/" element={<Login />}></Route>
          <Route path="login" element={<Login />}></Route>
          <Route path="setavatar/:userId" element={<SetAvatar />}></Route>
          {/* <Route path="photopicker" element={<PhotoPicker />}></Route> */}
        </Routes>
      </BrowserRouter>
    </UsersProvider>
  );
}

export default App;
