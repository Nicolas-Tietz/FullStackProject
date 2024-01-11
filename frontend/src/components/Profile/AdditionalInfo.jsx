import React, { useCallback, useContext, useEffect, useState } from "react";
import axios from "axios";
import CityIcon from "@assets/CityIcon";
import JobIcon from "@assets/JobIcon";
import GenderIcon from "@assets/GenderIcon";
import PhoneIcon from "@assets/PhoneIcon";
import BirthIcon from "@assets/BirthIcon";
import { UserContext } from "@main_pages/Dashboard";
const AdditionalInfo = () => {
  const [modifyState, setModifyState] = useState(false);
  const { user } = useContext(UserContext);
  const [userInfo, setUserInfo] = user;
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({});
  function swapForm() {
    setModifyState(!modifyState);
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  }
  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setLoading(true);
      const body = {};
      body["formData"] = formData;
      body["email"] = userInfo.email;

      await axios
        .post(
          "https://fullstack-project-jbqv.onrender.com/users/additional-info",
          body
        )
        .then((res) => {
          setLoading(false);
          if (res.status == 201) {
            navigate("/dashboard");
          }
        });
    } catch (err) {
      setLoading(false);

      console.log("Errore Completo", err);
    }

    swapForm();
  }
  return (
    <div>
      {modifyState ? (
        <>
          {/* This is the Modify One */}
          <form onSubmit={(event) => handleSubmit(event)}>
            <div className="flex flex-wrap justify-center text-white font-bold text-sm mt-12 gap-y-20 ">
              <div className="more-info w-full flex flex-col justify-center items-center md:basis-1/3">
                <div className=" mr-2 flex text-gray-800 ">
                  <BirthIcon size="70px" />
                </div>
                <div className="text-center ">
                  <div className="text-base mt-2 pb-3">Birth Date</div>
                  <div>
                    <input
                      type="date"
                      className="bg-gray-800 text-white rounded-xl px-4 py-1 border "
                      onChange={handleChange}
                      name="birthDate"
                      placeholder={userInfo.additionalInfo.birthDate}
                    />
                  </div>
                </div>
              </div>
              <div className="more-info w-full flex flex-col justify-center items-center md:basis-1/3">
                <div className=" mr-2 flex text-gray-800 ">
                  <CityIcon size="70px" />
                </div>
                <div className="text-center mt-2">
                  <div className="text-base pb-3">City</div>
                  <input
                    placeholder={userInfo.additionalInfo.city}
                    type="text"
                    className="bg-gray-800 py-1 px-3 rounded-xl w-48 border placeholder:text-gray-300"
                    onChange={handleChange}
                    name="city"
                  />
                </div>
              </div>
              <div className="more-info w-full flex flex-col justify-end items-center md:basis-1/3">
                <div className="  flex text-gray-800 ">
                  <JobIcon />
                </div>
                <div className="text-center">
                  <div className="text-base pb-3">Job</div>
                  <input
                    placeholder={userInfo.additionalInfo.job}
                    type="text"
                    className="bg-gray-800 py-1 px-3 rounded-xl w-48 border placeholder:text-gray-300"
                    onChange={handleChange}
                    name="job"
                  />
                </div>
              </div>
              <div className="more-info w-full flex flex-col justify-center items-center md:basis-1/3">
                <div className=" mr-2 flex text-gray-800 ">
                  <PhoneIcon />
                </div>
                <div className="text-center">
                  <div className="text-base pb-3">Phone Number</div>

                  <div className="relative">
                    <div className="absolute inset-y-0 start-0 top-0 flex items-center ps-3.5 pointer-events-none">
                      <svg
                        className="w-4 h-4 text-gray-500 dark:text-gray-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="white"
                        viewBox="0 0 19 18"
                      >
                        <path d="M18 13.446a3.02 3.02 0 0 0-.946-1.985l-1.4-1.4a3.054 3.054 0 0 0-4.218 0l-.7.7a.983.983 0 0 1-1.39 0l-2.1-2.1a.983.983 0 0 1 0-1.389l.7-.7a2.98 2.98 0 0 0 0-4.217l-1.4-1.4a2.824 2.824 0 0 0-4.218 0c-3.619 3.619-3 8.229 1.752 12.979C6.785 16.639 9.45 18 11.912 18a7.175 7.175 0 0 0 5.139-2.325A2.9 2.9 0 0 0 18 13.446Z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      id="phone-input"
                      aria-describedby="helper-text-explanation"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-800 focus:border-gray-800 block w-full ps-10 p-2.5  dark:bg-gray-800 dark:border-white dark:placeholder-gray-200 dark:text-white dark:focus:ring-gray-800 dark:focus:border-gray-800"
                      pattern="[0-9]{3}[0-9]{3}[0-9]{4}"
                      placeholder={userInfo.additionalInfo.phone}
                      onChange={handleChange}
                      name="phone"
                    />
                  </div>
                </div>
              </div>
              <div className="more-info w-full flex flex-col justify-center items-center md:basis-1/3">
                <div className=" mr-2 flex text-gray-800 ">
                  <GenderIcon />
                </div>
                <div className="text-center">
                  <div className="text-base pb-3">Gender</div>
                  <div className="inline-block relative w-48 h-10">
                    <select
                      placeholder={userInfo.additionalInfo.gender}
                      onChange={handleChange}
                      name="gender"
                      className="block appearance-none w-full bg-gray-800 border  hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                    >
                      <option>Select</option>
                      <option>Male</option>
                      <option>Female</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg
                        className="fill-current h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center w-full my-10">
              <button
                className="bg-transparent hover:bg-slate-200 text-white font-semibold hover:text-gray-800 py-2 px-4 border border-white hover:border-transparent rounded-full"
                type="submit"
              >
                Confirm Update
              </button>
            </div>
          </form>
        </>
      ) : (
        <>
          {/* This is the one for the Actual Info */}

          <div className="flex flex-wrap justify-center text-white font-bold text-base py-4 md:py-12 mx-5 rounded-3xl mt-12  gap-y-8 md:gap-y-20 bg-gray-800  shadow shadow-blue-300">
            <div className="more-info w-full flex flex-col justify-center items-center basis-1/2 md:basis-1/3">
              <div className=" mr-2 flex text-gray-800 ">
                <BirthIcon size="70px" />
              </div>
              <div className="text-center ">
                <div className="text-lg mt-2">Birth Date</div>
                <div className="text-blue-300">
                  {userInfo?.additionalInfo?.birthDate == ""
                    ? "Unknown"
                    : userInfo?.additionalInfo?.birthDate}
                </div>
              </div>
            </div>
            <div className="more-info w-full flex flex-col justify-center items-center basis-1/2 md:basis-1/3">
              <div className=" mr-2 flex text-gray-800 ">
                <CityIcon size="70px" />
              </div>
              <div className="text-center mt-2">
                <div className="text-lg">City</div>
                <div className="text-blue-300">
                  {userInfo?.additionalInfo?.city == ""
                    ? "Unknown"
                    : userInfo?.additionalInfo?.city}
                </div>
              </div>
            </div>
            <div className="more-info w-full flex flex-col justify-center items-center basis-1/2 md:basis-1/3">
              <div className="  flex text-gray-800 ">
                <JobIcon size="70px" />
              </div>
              <div className="text-center">
                <div className="text-lg">Job</div>
                <div className="text-blue-300">
                  {userInfo?.additionalInfo?.job == ""
                    ? "Unknown"
                    : userInfo?.additionalInfo?.job}
                </div>
              </div>
            </div>
            <div className="more-info w-full flex flex-col justify-center items-center basis-1/2 md:basis-1/3">
              <div className=" mr-2 flex text-gray-800 ">
                <PhoneIcon size="70px" />
              </div>
              <div className="text-center">
                <div className="text-lg">Phone Number</div>
                <div className="text-blue-300">
                  {userInfo?.additionalInfo?.phone == ""
                    ? "Unknown"
                    : userInfo?.additionalInfo?.phone}
                </div>
              </div>
            </div>
            <div className="more-info w-full flex flex-col justify-center items-center basis-1/2 md:basis-1/3">
              <div className=" mr-2 flex text-gray-800 ">
                <GenderIcon size="70px" />
              </div>
              <div className="text-center">
                <div className="text-lg">Gender</div>
                <div className="text-blue-300">
                  {userInfo?.additionalInfo?.gender == ""
                    ? "Unknown"
                    : userInfo?.additionalInfo?.gender}
                </div>
              </div>
            </div>
          </div>
          <div className="text-center w-full my-10">
            <button
              onClick={swapForm}
              className="bg-transparent hover:bg-slate-200 text-white font-semibold hover:text-blue-500 py-2 px-4 border border-white hover:border-transparent rounded-full"
            >
              Modify Profile
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AdditionalInfo;
