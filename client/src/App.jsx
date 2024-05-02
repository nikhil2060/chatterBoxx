import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { UsersProvider } from "./contexts/UsersContext";
import Chat from "./pages/Chat";
import Login from "./pages/Login";
import Register from "./pages/Register";
import GlobalStyles from "./styles/GlobalStyles";

import axios from "axios";
import { useEffect } from "react";
import { userExists, userNotExists } from "./redux/reducer/authSlice";
import { getMyProfileRoute } from "./utils/AuthRoutes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";
import { SocketProvider } from "./contexts/socketContext";

const queryClient = new QueryClient({
  // sets cache behind the scenes
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // time upto which data will remain fresh in the cache
    },
  },
});

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
    <QueryClientProvider client={queryClient}>
      <SocketProvider>
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
        </UsersProvider>
      </SocketProvider>
      <Toaster
        position="top-center"
        gutter={12}
        containerStyle={{ margin: "8px" }}
        toastOptions={{
          success: {
            duration: 3000,
          },
          error: {
            duration: 5000,
          },
          style: {
            fontSize: "16px",
            maxWidth: "500px",
            padding: "16px 24px",
            backgroundColor: "var(--color-grey-0)",
            color: "var(--color-grey-700)",
          },
        }}
      />
    </QueryClientProvider>
  );
}

export default App;
