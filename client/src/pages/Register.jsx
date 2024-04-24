import { useState, useEffect } from "react";
import styled from "styled-components";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { registerRoute } from "../utils/ApiRoutes";
import { Link, useNavigate } from "react-router-dom";
function Register() {
  const [newUserData, setNewUserData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCPassword] = useState("");

  // useEffect(() => {
  //   if (localStorage.getItem("chat-app-user")) {
  //     navigate("/");
  //   }
  // }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (handleValidation()) {
      try {
        const response = await fetch(registerRoute, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, email, password }),
        });

        if (!response.ok) {
          const errorData = await response.json();

          toast.error(errorData.msg);
          return;
        }

        const data = await response.json();

        if (data.status === true) {
          localStorage.setItem("chat-app-user", JSON.stringify(data.user));
        }

        navigate(`/setavatar/${data.user._id}`);
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

    if (!/\S+@\S+\.\S+/.test(email)) {
      // Check if email is a valid email address
      isValid = false;
      toast.error("Invalid email address");
    }

    if (password.length < 6) {
      // Check if password is at least 6 characters long
      isValid = false;
      toast.error("Password must be at least 6 characters long");
      console.log("Password must be at least 6 characters long");
    }

    if (password !== cpassword) {
      // Check if password and confirm password match
      isValid = false;
      toast.error("Passwords do not match");
      console.log("Passwords do not match");
    }

    // Set the isValidated state based on the validation result
    return isValid;
  }

  return (
    <div className="w-full h-screen flex items-center justify-center text-zinc-800 bg-contain bg-no-repeat bg-center bg-gradient-to-r from-rose-50 to-teal-50">
      <div className="w-[22rem] h-[30rem] flex flex-col items-center rounded-xl bg-zinc-50 shadow-[rgba(13,_38,_76,_0.5)_0px_9px_20px] ">
        <h1 className="py-5 mt-[3px] text-xl font-medium text-zinc-800">
          Signup
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
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            required
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Input
            type="password"
            required
            placeholder="Confirm Password"
            value={cpassword}
            onChange={(e) => setCPassword(e.target.value)}
          />
          <Button className="rounded-[10px] p-2 text-zinc-50">Register</Button>
        </form>

        <span className="text-zinc-500 text-sm mb-6">
          Already have an account ?{" "}
          <Link to="/login" className="text-blue-400">
            Log in.
          </Link>
        </span>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Register;

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
