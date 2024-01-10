import React, { useEffect } from "react";
import axios from "axios";
import { useState, createContext, useContext } from "react";
import { UserContext } from "@main_pages/Dashboard";
import DefaultProfileImg from "@assets/DefaultProfileImg";
const UserFoundBox = (props) => {
  const { user } = useContext(UserContext);
  const [userInfo, setUserInfo] = user;

  const [sentState, setSentState] = useState("none");
  useEffect(() => {
    if (userInfo?.pendingRequests) {
      for (let request of userInfo.pendingRequests) {
        if (request == props.user.email) {
          setSentState("pending");
        }
      }
      //This happens if the request the user sent gets accepted while still having the search results

      if (userInfo.friends.some((user) => user.email == props.user.email)) {
        setSentState("friend");
      }
    }
  }, [userInfo.pendingRequests, userInfo.friends]);

  async function addFriend() {
    try {
      const result = await axios
        .post("http://localhost:5555/users/add-friend", {
          senderUser: userInfo,
          receiverUser: props.user,
        })
        .then((res) => {
          if (res.status == 200) {
            setSentState("pending");
          }
        });
    } catch (error) {
      console.error("Error adding friend: ", error);
    }
  }

  return (
    <div className="w-full h-20 flex text-sm justify-between items-center bg-gray-800 rounded-full px-6 py-2 my-5 shadow-[rgba(222,222,222,0.2)_0px_0px_4px_2px]">
      <div className="flex">
        <div className="mr-3">
          {props.user?.image ? (
            <img
              className="w-14 h-14 rounded-full"
              src={props.user?.image}
              alt=""
            />
          ) : (
            <div className="h-12 w-12">
              <DefaultProfileImg />
            </div>
          )}
        </div>
        <div>
          <div className="text-white font-bold">
            {props.user.firstName} {props.user?.lastName}
          </div>

          <div className="text-gray-200 italic">{props.user?.username}</div>
        </div>
      </div>
      <div className="h-full flex items-center justify-center">
        {sentState === "pending" ? (
          <div className="h-3/4  font-semibold border border-yellow-500 text-yellow-500 rounded-full px-3 hover:bg-white hover:text-gray-800 flex items-center ">
            Pending
          </div>
        ) : sentState === "friend" ? (
          ""
        ) : (
          <button
            className="h-3/4 border font-semibold border-white text-white rounded-full px-3 hover:bg-white hover:text-gray-800"
            onClick={addFriend}
          >
            Add Friend
          </button>
        )}
      </div>
    </div>
  );
};

export default UserFoundBox;
