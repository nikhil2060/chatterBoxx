import { motion } from "framer-motion";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import styled from "styled-components";
import { userExists, userNotExists } from "../redux/reducer/authSlice";
import { loginRoute } from "../utils/AuthRoutes";

function Login() {
  // const { user, isLoggedIn } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (handleValidation()) {
      try {
        const response = await fetch(loginRoute, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
          credentials: "include",
        });

        if (!response.ok) {
          const errorData = await response.json();
          dispatch(userNotExists());
          toast.error(errorData.msg);
          return;
        }

        const data = await response.json();

        if (data.status === true) {
          // navigate("/");
          console.log(data);
          dispatch(userExists(data.user));
          toast.success("Login successfull");
          navigate(`/chat/${data.user._id}`);
        } else {
          dispatch(userExists());
          toast.error(`Login failed ${data.msg}`);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  function handleValidation() {
    let isValid = true;

    // Validation checks
    if (username.trim() === "") {
      // Check if name is empty or only contains spaces
      isValid = false;
      toast.error("Name is required");

      // You can set an error message or perform any other action
    }

    if (password.length === "") {
      // Check if password is at least 6 characters long
      isValid = false;
      toast.error("Password is required");
    }

    // Set the isValidated state based on the validation result
    return isValid;
  }

  return (
    <div className="w-full h-screen flex items-center justify-center text-zinc-800  bg-contain bg-no-repeat bg-center bg-gradient-to-r from-indigo-50 to-yellow-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="w-[22rem] h-[21rem] flex flex-col items-center rounded-xl  bg-zinc-50 shadow-[rgba(13,_38,_76,_0.5)_0px_9px_20px] "
      >
        <h1 className="py-5 mt-[3px] text-xl font-medium text-zinc-800">
          Login
        </h1>
        <form
          className="flex flex-col gap-8 items-center px-10 w-full h-full mt-1"
          onSubmit={handleSubmit}
        >
          <Input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <Input
            type="password"
            required
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button className="rounded-[10px] p-2 text-zinc-50">Login</Button>
        </form>
        <span className="text-zinc-500 text-sm mb-6">
          Dont have an account ?{" "}
          <Link to="/register" className="text-blue-400">
            Create One.
          </Link>
        </span>
      </motion.div>
    </div>
  );
}

export default Login;

const Input = styled.input`
  width: 100%;
  border-radius: 10px;
  height: 40px;
  padding: 10px;
  font-weight: 400;
  font-size: 12px;
  border: 1.2px solid #3e3e3e;
  box-shadow: 0px 10px 20px 1px #3333331d;
`;

const Button = styled.button`
  width: 100%;
  background-color: #0171d3;
  box-shadow: 0px 10px 20px 1px #33333359;
`;
