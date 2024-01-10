import React, { useContext } from "react";
import axios from "axios";

import FriendIcon from "@assets/friends.png";
import CrossIcon from "@assets/CrossIcon";
import DefaultProfileImg from "@assets/DefaultProfileImg";

import { UserContext, VisitContext } from "@main_pages/Dashboard";

const FriendListBox = ({ friend }) => {
  const { user } = useContext(UserContext);
  const [userInfo, setUserInfo] = user;
  const setVisitUser = useContext(VisitContext);

  async function removeFriend() {
    try {
      const result = await axios.post(
        "http://localhost:5555/users/remove-friend",
        {
          user: userInfo,
          friend: friend,
        }
      );
    } catch (error) {
      console.error("Error adding friend: ", error);
    }
  }
  return (
    <div className="w-full px-6 my-2">
      <div
        id="toast-notification"
        className=" p-2 md:p-4 text-gray-900 bg-white rounded-3xl shadow dark:bg-gray-800 dark:text-gray-300 "
        role="alert"
      >
        <div className="flex justify-between items-center ">
          <div
            class="flex items-center hover:cursor-pointer"
            onClick={() => setVisitUser(friend)}
          >
            <div class="relative inline-block shrink-0">
              {friend.image ? (
                <img
                  class="w-16 h-16 rounded-full"
                  src={friend.image}
                  alt="Jese Leos image"
                />
              ) : (
                <div className="w-16 h-16">
                  <DefaultProfileImg />
                </div>
              )}
              <span class="absolute bottom-0 right-0 inline-flex items-center justify-center w-6 h-6 bg-blue-600 rounded-full">
                <img className="w-3/5" src={FriendIcon} alt="" />
              </span>
            </div>
            <div class="ms-3 text-sm font-normal">
              <div class="text-sm font-semibold text-gray-900 dark:text-white">
                {friend.firstName} {friend.lastName}
              </div>
              <div class="text-sm font-normal">{friend.username}</div>
              <span class="text-xs font-medium text-blue-600 dark:text-blue-500"></span>
            </div>
          </div>
          <div
            className="rounded-full hover:cursor-pointer"
            onClick={removeFriend}
          >
            <CrossIcon />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FriendListBox;
