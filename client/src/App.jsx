import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { UsersProvider } from "./contexts/UsersContext";
import GlobalStyles from "./styles/GlobalStyles";

import axios from "axios";
import { useEffect, Suspense, lazy } from "react";
import { userExists, userNotExists } from "./redux/reducer/authSlice";
import { getMyProfileRoute } from "./utils/AuthRoutes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";
import { SocketProvider } from "./contexts/socketContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
    },
  },
});

// Lazy load components
const Chat = lazy(() => import("./pages/Chat"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));

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
      .catch((err) => {
        console.error(err); // Log the error or handle it
        dispatch(userNotExists());
      });
  }, [dispatch]);

  return (
    <QueryClientProvider client={queryClient}>
      <SocketProvider>
        <UsersProvider>
          <BrowserRouter>
            <GlobalStyles />
            {user && <Navigate to={`/chat/${user._id}`} />}
            <Suspense fallback={<div>Loading...</div>}>
              <Routes>
                <Route path="chat/:chatId" element={<Chat />} />
                <Route path="register" element={<Register />} />
                <Route index element={<Login />} />
                <Route path="login" element={<Login />} />
              </Routes>
            </Suspense>
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
