/* eslint react/prop-types: 0 */
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Buffer } from "buffer";
import axios from "axios";
import styled from "styled-components";
import { uploadPic } from "../utils/AuthRoutes";
import { toast } from "react-toastify";
import { Smiley, Heart, Horse, CameraPlus } from "@phosphor-icons/react";

function SetAvatar() {
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);

  const setProfilePicture = async () => {
    try {
      const response = await fetch(uploadPic, {
        method: "POST",
        headers: {
          "content/type": "application/json",
        },
        body: JSON.stringify(selectedAvatar),
      });

      if (!response.ok) {
        toast.error(response.msg);
      }

      console.log(response);
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center text-zinc-800  bg-contain bg-no-repeat bg-center bg-gradient-to-r from-rose-50 to-teal-50">
      <div className="w-[25rem] h-[15rem] flex flex-col items-center rounded-xl  bg-zinc-50 shadow-[rgba(13,_38,_76,_0.5)_0px_9px_20px] overflow-hidden relative">
        {/* <Avatar
          selectedAvatar={selectedAvatar}
          setSelectedAvatar={setSelectedAvatar}
        /> */}
        {/* <div className="absolute top-[50%] -translate-y-[50%] bg-slate-100 h-[5px] w-[5px]rounded-full flex items-center justify-center p-2 text-sm font-regular text-zinc-500">
          <h1>OR</h1>
        </div> */}
        <Photopicker />
        {/* <Button className="submit-btn w-1/2 mb-10" onClick={setProfilePicture}>
          submit
        </Button> */}
      </div>
    </div>
  );
}

function Avatar({ selectedAvatar, setSelectedAvatar }) {
  const [avatars, setAvatars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selected, setSelected] = useState(undefined);

  const api = `https://api.multiavatar.com/Binx Bond.png`;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = [];
        for (let i = 0; i < 4; i++) {
          const response = await axios.get(
            `${api}/${Math.round(Math.random() * 1000)}`
          );
          const buffer = Buffer.from(response.data, "binary");
          data.push(buffer.toString("base64"));
        }
        console.log(data);
        setAvatars(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error.message);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Container
      className="w-full h-1/2 border-b-[1px] border-zinc-500 flex
    flex-col items-center gap-2 "
    >
      <div className="title-container mt-5">
        <h1 className="text-xl font-medium">Pick Avatar</h1>
      </div>
      <div className="avatars p-10">
        {avatars.map((item, index) => {
          return (
            <div
              key={index}
              className={`avatar ${
                selected === index ? "selected" : ""
              } overflow-hidden`}
            >
              <img
                src={`data:image/svg+xml;base64,${item}`}
                alt="avatar"
                onClick={() => setSelected(index)}
              />
            </div>
          );
        })}
      </div>
    </Container>
  );
}

function Photopicker({ selectedAvatar, setSelectedAvatar }) {
  const navigate = useNavigate();

  const [image, setImage] = useState();

  // const storedUserData = localStorage.getItem("chat-app-user");
  // const userData = JSON.parse(storedUserData);

  const { userId } = useParams();

  // useEffect(() => {
  //   if (storedUserData.isAvatarImageSet === true) {
  //     navigate("/");
  //   }
  // }, [storedUserData, navigate]);

  const onInputChange = (e) => {
    const file = e.target.files[0];

    setImage(file);
  };
  const submitImage = async (e) => {
    e.preventDefault();
    try {
      if (!image) return;

      const formData = new FormData();

      formData.append("image", image);

      formData.append("userId", userId);

      const response = await fetch(uploadPic, {
        method: "POST",
        headers: {
          // "content/type": "application/json",
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();

        toast.error(errorData.msg);
        return;
      }

      const data = await response.json();

      console.log(data);

      if (data.status === true) {
        toast(data.msg);
        // localStorage.setItem("chat-app-user", JSON.stringify(data.user));
        navigate("/login");
      }
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <div
      className="w-full h-full flex
  flex-col items-center gap-5 justify-center"
    >
      <div className="title-container">
        <h1 className="text-xl font-medium">Choose your profile picture</h1>
      </div>

      <form
        className="flex flex-col gap-5 justify-center items-center"
        onSubmit={submitImage}
      >
        <label
          htmlFor="imageInput"
          className="rounded-full w-20 h-20 relative
          bg-gradient-to-r from-indigo-500 to-blue-500
          backdrop-blur-3xl
          cursor-pointer shadow-[0_3px_10px_rgb(0,0,0,0.2)]
          "
        >
          <input
            type="file"
            id="imageInput"
            accept="images/*"
            onChange={onInputChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ">
            <CameraPlus size={32} />
          </span>
        </label>

        <Button className="rounded-[10px] p-2 text-zinc-50" type="submit">
          Submit
        </Button>
      </form>
    </div>
  );
}

// bg-[url('./src/assets/9240809.jpg')] bg-contain bg-no-repeat bg-center
export default SetAvatar;

const Container = styled.div`
  .avatars {
    display: flex;
    gap: 20px;

    .avatar {
      /* border: 0.4rem solid transparent; */
      /* padding: 0.4rem; */
      border-radius: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: 0.2s ease-in-out;
      box-shadow: 0px 0px 10px #555;
      height: 5rem;
      width: 5rem;

      img {
        height: 6rem;
        width: 6rem;
        border-radius: 100%;
        /* transition: 0.1s ease-in-out; */
      }
    }

    .avatar:hover {
      transform: scale(1.2);
      box-shadow: 0px 0px 10px #ededed;
    }
    .selected {
      border: 3px solid #333;
      transform: scale(1.2);
    }
  }
`;

const Button = styled.button`
  width: 100%;
  background-color: #0171d3;
  box-shadow: 0px 10px 20px 1px #33333335;
`;
