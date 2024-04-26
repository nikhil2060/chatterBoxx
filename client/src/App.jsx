import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import SetAvatar from "./comp/SetAvatar";
import { UsersProvider } from "./contexts/UsersContext";
import Chat from "./pages/Chat";
import Login from "./pages/Login";
import Register from "./pages/Register";
import GlobalStyles from "./styles/GlobalStyles";

function App() {
  // useEffect(() => {
  //   axios
  //     .get(getMyProfileRoute, {
  //       withCredentials: true,
  //     })
  //     .then((res) => console.log(res))
  //     .catch((err) => console.error(err));
  // }, []);

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
