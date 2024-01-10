import React, { useEffect } from "react";
import { useState, useContext } from "react";

import SingleNotificationBox from "@components/SingleNotificationBox";
import { UserContext } from "@main_pages/Dashboard";
import { Helmet } from "react-helmet";
const Notifications = () => {
  const { user } = useContext(UserContext);
  const [userInfo, setUserInfo] = user;

  return (
    <div className="bg-gray-700 w-full md:w-5/6 h-full">
      <Helmet>
        <title>Notifications</title>
      </Helmet>
      <div className="text-center text-blue-300 text-3xl font-bold my-5">
        Notifications
      </div>

      {userInfo.notifications.length == 0 && (
        <div className="flex justify-center items-center text-white font-bold border-2 border-white py-2 w-2/3 md:w-1/2 m-auto rounded-full">
          You have 0 notifications
        </div>
      )}

      <div>
        {userInfo.notifications &&
          userInfo.notifications.map((not) => {
            return <SingleNotificationBox notification={not} />;
          })}
      </div>
    </div>
  );
};

export default Notifications;
