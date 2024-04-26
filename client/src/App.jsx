import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { UsersProvider } from "./contexts/UsersContext";
import Chat from "./pages/Chat";
import Login from "./pages/Login";
import Register from "./pages/Register";
import GlobalStyles from "./styles/GlobalStyles";

import axios from "axios";
import { useEffect } from "react";
import { userExists, userNotExists } from "./redux/reducer/auth";
import { getMyProfileRoute } from "./utils/AuthRoutes";

function App() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    axios
      .get(getMyProfileRoute, {
        withCredentials: true,
      })
      .then(({ data }) => {
        if (!data.status) {
          toast.error(data.msg);
          dispatch(userNotExists());
        } else {
          dispatch(userExists(data.user));
        }
      })
      .catch((err) => dispatch(userNotExists()));
  }, [dispatch]);

  return (
    <UsersProvider>
      <BrowserRouter>
        <GlobalStyles />
        {user && <Navigate to={`/chat/${user._id}`} />}
        <Routes>
          <Route path="chat/:chatId" element={<Chat />} />
          <Route path="register" element={<Register />}></Route>
          <Route index element={<Login />}></Route>
          <Route path="login" element={<Login />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition:Bounce
      />
    </UsersProvider>
  );
}

export default App;
