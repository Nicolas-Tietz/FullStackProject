import React from "react";
import DefaultProfileImg from "@assets/DefaultProfileImg";
import BirthIcon from "@assets/BirthIcon";
import PhoneIcon from "@assets/PhoneIcon";
import JobIcon from "@assets/JobIcon";
import CityIcon from "@assets/CityIcon";
import GenderIcon from "@assets/GenderIcon";
import { Helmet } from "react-helmet";
const VisitProfile = ({ visitUser }) => {
  return (
    <div className="w-full h-full bg-gray-700 overflow-y-scroll">
      <Helmet>
        <title>{visitUser.username}'s Profile</title>
      </Helmet>
      <div className="h-auto md:h-1/4 flex bg-gray-800 rounded-full py-4 justify-between px-10 m-5 relative shadow shadow-blue-300">
        <div className="flex justify-center items-center gap-2">
          <div className="h-full flex justify-center items-center">
            <div className="group relative rounded-full md:w-40 md:h-40 ">
              {visitUser?.image ? (
                <img
                  src={visitUser.image}
                  alt="ProfilePicture"
                  className="h-full w-full max-h-40 max-w-40 object-cover rounded-full"
                />
              ) : (
                <div className="w-24 h-24 md:w-40 md:h-40">
                  <DefaultProfileImg />
                </div>
              )}
            </div>
          </div>
          <div>
            <div className="font-bold text-2xl md:text-3xl text-blue-200">
              {visitUser?.firstName} {visitUser?.lastName}
            </div>
            <div className="flex flex-col justify-center">
              <div className="text-gray-300 font-bold">{visitUser?.email}</div>
            </div>
          </div>
        </div>
      </div>
      <div className=""></div>
      <>
        <div className="text-center font-bold text-xl text-blue-300">
          Additional Info
        </div>

        <div className="flex flex-wrap justify-center text-white font-bold text-m py-12 mx-5 rounded-3xl mt-4 md:mt-4 gap-y-20 bg-gray-800  shadow shadow-blue-300">
          <div className="more-info w-full flex flex-col justify-center items-center basis-1/2 md:basis-1/3">
            <div className=" mr-2 flex text-gray-800 ">
              <BirthIcon size="70px" />
            </div>
            <div className="text-center ">
              <div className="text-xl mt-2">Birth Date</div>
              <div className="text-blue-300">
                {visitUser?.additionalInfo?.birthDate == ""
                  ? "Unknown"
                  : visitUser?.additionalInfo?.birthDate}
              </div>
            </div>
          </div>
          <div className="more-info w-full flex flex-col justify-center items-center basis-1/2 md:basis-1/3">
            <div className=" mr-2 flex text-gray-800 ">
              <CityIcon size="70px" />
            </div>
            <div className="text-center mt-2">
              <div className="text-xl">City</div>
              <div className="text-blue-300">
                {visitUser?.additionalInfo?.city == ""
                  ? "Unknown"
                  : visitUser?.additionalInfo?.city}
              </div>
            </div>
          </div>
          <div className="more-info w-full flex flex-col justify-center items-center basis-1/2 md:basis-1/3">
            <div className="  flex text-gray-800 ">
              <JobIcon size="70px" />
            </div>
            <div className="text-center">
              <div className="text-xl">Job</div>
              <div className="text-blue-300">
                {visitUser?.additionalInfo?.job == ""
                  ? "Unknown"
                  : visitUser?.additionalInfo?.job}
              </div>
            </div>
          </div>
          <div className="more-info w-full flex flex-col justify-center items-center basis-1/2 md:basis-1/3">
            <div className=" mr-2 flex text-gray-800 ">
              <PhoneIcon size="70px" />
            </div>
            <div className="text-center">
              <div className="text-xl">Phone Number</div>
              <div className="text-blue-300">
                {visitUser?.additionalInfo?.phone == ""
                  ? "Unknown"
                  : visitUser?.additionalInfo?.phone}
              </div>
            </div>
          </div>
          <div className="more-info w-full flex flex-col justify-center items-center basis-1/2 md:basis-1/3">
            <div className=" mr-2 flex text-gray-800 ">
              <GenderIcon size="70px" />
            </div>
            <div className="text-center">
              <div className="text-xl">Gender</div>
              <div className="text-blue-300">
                {visitUser?.additionalInfo?.gender == ""
                  ? "Unknown"
                  : visitUser?.additionalInfo?.gender}
              </div>
            </div>
          </div>
        </div>
      </>
    </div>
  );
};

export default VisitProfile;
