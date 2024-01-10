import React, { useEffect, useState, useRef, useContext } from "react";
import PlusIcon from "@assets/PlusIcon";
import axios from "axios";
import AdditionalInfo from "@components/Profile/AdditionalInfo";
import { UserContext } from "@main_pages/Dashboard";
import DefaultProfileImg from "@assets/DefaultProfileImg";
import { Helmet } from "react-helmet";
const Profile = (props) => {
  const inputFile = useRef(null);
  const { user } = useContext(UserContext);
  const [userInfo, setUserInfo] = user;
  const [profilePicture, setProfilePicture] = useState(null);
  const [percentage, setPercentage] = useState();
  async function logout() {
    const data = await axios
      .get(`http://localhost:5555/users/logout`, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.status == 200) {
          props.toggleLoginStatus();
        }
      });
  }

  useEffect(() => {
    if (userInfo.image != "" && userInfo.image != null) {
      setProfilePicture(userInfo.image);
    }
  }, [userInfo]);
  useEffect(() => {
    if (userInfo?.additionalInfo) {
      const newPercentage = updatePercentage(userInfo.additionalInfo);
      setPercentage(newPercentage);
    }
  }, [userInfo?.additionalInfo]);

  function updatePercentage(additionalInfo) {
    let counter = 0;
    for (let field in additionalInfo) {
      if (additionalInfo[field] != "") counter++;
    }

    const result = (counter * 100) / 5;
    return result;
  }

  useEffect(() => {
    if (profilePicture != null && profilePicture != "") {
      uploadImage();
      setUserInfo({ ...userInfo, image: profilePicture });
    }
  }, [profilePicture]);

  async function uploadImage() {
    const body = { base64: profilePicture, email: userInfo.email };

    await axios
      .post("http://localhost:5555/users/upload-image", body)
      .then((data) => {});
  }
  async function getImage() {
    await axios
      .get(`http://localhost:5555/users/get-image${userInfo?.email}`)

      .then((data) => {
        setProfilePicture(data.data);
      });
  }

  function convertToBase64(e) {
    var reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = () => {
      setProfilePicture(reader.result);
    };
    reader.onerror = (error) => {
      console.log("error:", error);
    };
  }
  const onImageClick = () => {
    inputFile.current.click();
  };
  return (
    <div className="w-full h-full md:w-5/6 bg-gray-700 overflow-y-auto overflow-x-hidden">
      <Helmet>
        <title>Profile</title>
      </Helmet>
      <div className="h-auto md:h-1/4 flex bg-gray-800 rounded-full  justify-between p-5 md:px-10 m-5 relative shadow shadow-blue-300">
        <div className="flex items-centers">
          <div className="flex justify-center items-center gap-2 md:gap-10">
            <div className="h-full flex justify-center items-center">
              <div
                className="group relative rounded-full hover:bg-gray-500 cursor-pointer h-20 w-20 md:h-40 md:w-40"
                onClick={onImageClick}
              >
                {userInfo.image ? (
                  <img
                    src={userInfo.image}
                    alt="ProfilePicture"
                    className="h-full w-full group-hover:opacity-50 max-h-40 max-w-40 object-cover rounded-full"
                  />
                ) : (
                  <DefaultProfileImg />
                )}

                <div
                  className="absolute top-1/2 left-1/2 opacity-0 group-hover:opacity-100 rounded-full text-gray-200 "
                  style={{ transform: "translate(-50%,-50%)" }}
                >
                  <PlusIcon size="40px" />
                </div>
              </div>

              <input
                id="file"
                className="hidden"
                type="file"
                accept="image/*"
                name="file"
                onChange={convertToBase64}
                ref={inputFile}
              />
            </div>
            <div>
              <div className="font-bold text-xl md:text-3xl text-blue-200">
                {userInfo?.firstName} {userInfo?.lastName}
              </div>
              <div className="flex flex-col justify-center">
                <div className="text-gray-300 font-bold">{userInfo?.email}</div>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="md:absolute bottom-3 left-1/2 w-full ">
              <div className="mb-3 flex justify-center text-xl font-bold text-white md:w-fit md:-translate-x-1/2 md:-translate-y-1/2 w-full">
                Complete your Profile
              </div>
              <div className=" w-1/2 bg-gray-200 rounded-full dark:bg-gray-700 md:-translate-x-1/2 md:-translate-y-1/2">
                <div
                  className="bg-blue-400 text-xs  text-white font-bold text-center py-0.5 leading-none rounded-full"
                  style={{ width: `${percentage}%` }}
                >
                  {percentage == 0 ? "" : percentage + "%"}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center ">
          <button
            className="bg-transparent hover:bg-slate-200 text-white text-sm md:text-lg font-semibold hover:text-blue-500 py-2 px-3 md:py-2 md:px-4 border border-white hover:border-transparent rounded-full"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </div>
      <div className="block md:hidden">
        <div className="bottom-3 left-1/2 w-full ">
          <div className="mb-3 flex justify-center text-xl font-bold text-white md:w-fit w-full">
            Complete your Profile
          </div>
          <div className=" w-2/3 bg-gray-200 rounded-full dark:bg-gray-700 m-auto">
            <div
              className="bg-blue-400 text-xs  text-white font-bold text-center py-0.5 leading-none rounded-full m-auto"
              style={{ width: `${percentage}%` }}
            >
              {percentage == 0 ? "" : percentage + "%"}
            </div>
          </div>
        </div>
      </div>
      <div className=""></div>
      <AdditionalInfo />
    </div>
  );
};

export default Profile;
