import { useState, useEffect } from "react";
import styled from "styled-components";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { registerRoute } from "../utils/AuthRoutes";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

function Register() {
  const [newUserData, setNewUserData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { register, handleSubmit, getValues } = useForm();

  const navigate = useNavigate();

  const afterSubmit = async (data) => {
    const formData = new FormData();

    // Append fields other than the file
    formData.append("name", data.name);
    formData.append("username", data.username);
    formData.append("email", data.email);
    formData.append("password", data.password);

    formData.append("avatar", data.avatar[0]);

    if (handleValidation(data)) {
      try {
        const response = await fetch(registerRoute, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json(data);

          toast.error(errorData.msg);
          return;
        }

        const data = await response.json();

        if (data.status === true) {
          // navigate("/");
        }
      } catch (error) {
        toast.error(error);
        console.log(error);
      }
    }
  };

  const onError = (errors) => {
    console.log(errors);
  };

  function handleValidation({ username, email, password, cpassword }) {
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
      <div className="w-[22rem] h-[40rem] flex flex-col items-center rounded-xl bg-zinc-50 shadow-[rgba(13,_38,_76,_0.5)_0px_9px_20px] ">
        <h1 className="py-5 mt-[3px] text-xl font-medium text-zinc-800">
          Signup
        </h1>
        <form
          className="flex flex-col gap-6 items-center px-10 w-full h-full mt-1"
          onSubmit={handleSubmit(afterSubmit, onError)}
        >
          <PhotoDiv>
            <PhotoLabel htmlFor="avatar" className="bg-red-200"></PhotoLabel>
            <PhotoInput
              type="file"
              id="avatar"
              {...register("avatar", { required: "this is required" })}
            />
          </PhotoDiv>
          <Input
            type="text"
            placeholder="Name"
            id="name"
            {...register("name", { required: "this is required" })}
          />

          <Input
            type="text"
            placeholder="Username"
            id="username"
            {...register("username", { required: "this is required" })}
          />

          <Input
            type="email"
            required
            placeholder="Email"
            id="email"
            {...register("email", { required: "this is required" })}
          />

          <Input
            type="password"
            required
            placeholder="Password"
            id="password"
            {...register("password", { required: "this is required" })}
          />

          <Input
            type="password"
            required
            placeholder="Confirm Password"
            id="cpassword"
            {...register("cpassword", { required: "this is required" })}
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

const PhotoInput = styled.input`
  display: none; /* Hide the input */
`;

const PhotoLabel = styled.label`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  font-weight: 400;
  font-size: 12px;
  border: 1.2px solid #3e3e3e;
  background-image: url("/userIcon.jpeg");
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  overflow: hidden;
`;

const PhotoDiv = styled.div`
  width: 100px;
  height: 100px;
  overflow: hidden;
`;

const Button = styled.button`
  width: 100%;
  background-color: #0171d3;
  box-shadow: 0px 10px 20px 1px #33333359;
`;
