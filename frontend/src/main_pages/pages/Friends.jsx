import React, { useContext, createContext, useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import UserFoundBox from "@components/UserFoundBox";
import { UserContext } from "@main_pages/Dashboard";

import FriendListBox from "@components/FriendListBox";
import { Helmet } from "react-helmet";
const Friends = ({ friends }) => {
  const [search, setSearch] = useState();
  const [searchResult, setSearchResult] = useState();
  const userInfo = useContext(UserContext);
  const [friendsInfo, setFriendsInfo] = useState([]);
  const [loadingState, setLoadingState] = useState(true);

  useEffect(() => {
    console.log("AMISCI", userInfo.friends);
    if (userInfo.friends != []) {
      const fetchFriendsInfos = async () => {
        await axios
          .post(
            "http://localhost:5555/users/fetch-friends-info",
            userInfo.friends
          )
          .then((res) => {
            console.log("ArrayAmici", res);
            setFriendsInfo(res.data);
            setLoadingState(false);
          });
      };
      fetchFriendsInfos();
    } else {
      console.log("VUOTO");
    }
  }, [userInfo.friends]);

  useEffect(() => {
    //userRoute to fetch all friends main info

    //continuare qui

    if (search == "") {
      setSearchResult("");
      return;
    }
    const timer = setTimeout(async () => {
      await axios
        .get(`http://localhost:5555/users/search?query=${search}`)
        .then((res) => {
          console.log("RisultatiSearch", res.data);
          console.log("UserInfoQUAA", userInfo);
          const filteredDataArray = res.data.filter((user) => {
            if (user.email == userInfo.email) {
              return null;
            }
            const foundInFriends = userInfo.friends.some(
              (friend) => friend.email === user.email
            );
            return !foundInFriends;
          });
          console.log("GUARDARE", res.data);
          setSearchResult(filteredDataArray);
        });
    }, 1000);
    return () => clearTimeout(timer);
  }, [search]);

  function handleChange(event) {
    const { value } = event.target;

    setSearch(value);
  }
  return (
    <div className="w-full md:w-5/6 bg-gray-700 h-full overflow-y-scroll">
      <Helmet>
        <title>Friends</title>
      </Helmet>
      {loadingState ? (
        <div role="status" className="flex justify-center items-center h-full ">
          <svg
            aria-hidden="true"
            class="inline w-10 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300 "
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span class="sr-only">Loading...</span>
        </div>
      ) : (
        <div className="">
          <div className="text-center text-blue-300 text-3xl font-bold my-5">
            Friend List
          </div>

          {userInfo.friends.length == 0 && (
            <div className="flex justify-center font-semibold text-white">
              You have no friends, go add some!
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 max-h-48 md:max-h-72 overflow-auto scrollbar-thumb-gray-900 scrollbar-thin ">
            {friendsInfo &&
              friendsInfo.map((friend) => {
                return <FriendListBox friend={friend} />;
              })}
          </div>
          <hr class=" h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-25 dark:opacity-100 mt-5" />
          <div class="my-6">
            <label
              for="large-input"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white text-center"
            >
              Search For A User
            </label>
            <input
              type="text"
              id="large-input"
              class="m-auto block w-2/3 p-2 md:p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              onChange={handleChange}
              name="searchInput"
            />
          </div>

          <div className="w-5/6 m-auto">
            {searchResult &&
              searchResult.map((user) => {
                return <UserFoundBox user={user} />;
              })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Friends;
