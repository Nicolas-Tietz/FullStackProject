import React, { useEffect, useState, useRef, createContext } from "react";

import { useLocation, useNavigate, redirect } from "react-router-dom";
import { Navigate } from "react-router-dom";
import axios from "axios";
import * as fs from "fs";
import Friends from "@pages/Friends";
import Profile from "@pages/Profile";
import io from "socket.io-client";
import Notifications from "@pages/Notifications";
import NotificationAlert from "@components/NotificationAlert";
import ProfileIcon from "@assets/ProfileIcon";
import FriendsIcon from "@assets/FriendsIcon";
import NotificationIcon from "@assets/NotificationIcon";
import VisitProfile from "@pages/VisitProfile";
import { Helmet } from "react-helmet";
export const SocketContext = React.createContext();
export const UserContext = React.createContext();
export const NotificationsContext = React.createContext();
export const FriendsContext = React.createContext();
export const VisitContext = React.createContext();
const Dashboard = (props) => {
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState();
  const [friends, setFriends] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const socketRef = useRef();
  let prevNotifications = useRef(notifications);
  const [newNotification, setNewNotification] = useState([]);
  const [showedNewNotifications, setShowedNewNotifications] = useState([]);
  const [fetchState, setFetchState] = useState(false);
  const [visitUser, setVisitUser] = useState();
  const [pendingRequests, setPendingRequests] = useState();

  const ref = useRef(null);

  const [page, setPage] = useState("profile");
  const [additionalInfo, setAdditionalInfo] = useState();

  useEffect(() => {
    const fetchInfo = async () => {
      const data = await axios
        .get(
          `https://fullstack-project-jbqv.onrender.com/users/dashboard-info`,
          {
            withCredentials: true,
          }
        )
        .then(async (user) => {
          console.log("Dashboard info received,", user);
          setUserInfo(user.data);
          setFetchState(true);

          const notificationsWithImages = await Promise.all(
            user.data.notifications.map(async (notification) => {
              const userImg = await getUserImage(notification.sender);
              return { ...notification, userImg };
            })
          );

          setNotifications(notificationsWithImages);

          socketRef.current = io(
            "https://fullstack-project-jbqv.onrender.com",
            {
              query: {
                email: user.data.email,
              },
            }
          );

          socketRef.current.on("connect", () => {
            console.log("Connected To The Server");
          });
          socketRef.current.on(
            "notificationsUpdate",
            async (updatedNotifications) => {
              const notificationsWithImages = await Promise.all(
                updatedNotifications.map(async (notification) => {
                  const userImg = await getUserImage(notification.sender);
                  return { ...notification, userImg };
                })
              );

              setNotifications(notificationsWithImages);
            }
          );
          socketRef.current.on("friendsUpdate", (updatedFriends) => {
            setFriends(updatedFriends);
          });
          socketRef.current.on("additionalInfoUpdate", (updatedInfo) => {
            setAdditionalInfo(updatedInfo);
          });
          socketRef.current.on("pendingRequestsUpdate", (pendingRequests) => {
            setPendingRequests(pendingRequests);
          });
        });
    };
    fetchInfo().catch(console.error);

    return () => {
      // Disconnect the socket when the component is unmounted
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    setUserInfo({ ...userInfo, pendingRequests: pendingRequests });
  }, [pendingRequests]);
  useEffect(() => {
    //VisitUser cambia se clicchiamo su un utente da visitare per ora
    if (visitUser) {
      setPage("visitProfile");
    }
  }, [visitUser]);

  //Whenever friends gets updated, change it in the userinfo
  useEffect(() => {
    setUserInfo({ ...userInfo, friends: friends });
  }, [friends]);
  useEffect(() => {
    setUserInfo({ ...userInfo, additionalInfo: additionalInfo });
  }, [additionalInfo]);

  async function getUserImage(email) {
    const response = await axios.get(
      `https://fullstack-project-jbqv.onrender.com/users/get-image${email}`
    );

    return response.data;
  }

  //Appena c'è l'email, fetcho l'immagine

  useEffect(() => {
    if (notifications.length) {
      if (notifications.length > userInfo.notifications.length) {
        setShowedNewNotifications([
          <NotificationAlert
            notification={notifications[notifications.length - 1]}
          />,
        ]);

        setTimeout(() => {
          setShowedNewNotifications([]);
        }, 5000);
        //Nuova notifica
      } else {
        //C'è una notifica in meno
      }
    }

    setUserInfo({ ...userInfo, notifications: notifications });
  }, [notifications]);

  return (
    <UserContext.Provider value={{ user: [userInfo, setUserInfo] }}>
      <Helmet>
        <title>Full Stack Project</title>
      </Helmet>
      <div className="flex flex-col  md:flex md:flex-row h-screen overflow-hidden relative ">
        <div ref={ref} className="absolute top-5 right-5 w-auto z-10">
          {showedNewNotifications != [] &&
            showedNewNotifications.map((notification) => {
              return notification;
            })}
        </div>
        <div className="w-full order-last md:order-first bottom-0 left-0 md:static md:w-1/6 bg-gray-800 h-16 md:h-screen flex flex-col justify-center items-center gap-5 text-xl border-t-2 md:border-0">
          <div className="w-full flex justify-center">
            <div className="w-full md:w-36 font-semibold text-lg flex md:flex-col justify-around">
              <div
                className="flex justify-start text-white md:my-8 hover:cursor-pointer "
                onClick={() => setPage("profile")}
              >
                <div className="p-1 ">
                  <ProfileIcon />
                </div>
                <div className="md:flex items-center hidden md:visible">
                  Profile
                </div>
              </div>
              <div
                className="flex justify-start text-white md:my-8 hover:cursor-pointer"
                onClick={() => setPage("friends")}
              >
                <div className="p-1">
                  <FriendsIcon />
                </div>

                <div className="md:flex items-center hidden md:visible">
                  Friends
                </div>
              </div>
              <div
                className="flex justify-start text-white md:my-8 hover:cursor-pointer"
                onClick={() => setPage("notifications")}
              >
                <div>
                  <NotificationIcon />
                </div>
                <div className="md:flex items-center hidden md:visible">
                  Notifications
                </div>
              </div>
            </div>
          </div>
        </div>
        {page == "profile" && userInfo && (
          <Profile
            userInfo={userInfo}
            toggleLoginStatus={props.toggleLoginStatus}
          />
        )}
        {page == "friends" && fetchState && (
          <VisitContext.Provider value={setVisitUser}>
            <Friends friends={friends} />
          </VisitContext.Provider>
        )}

        {page == "notifications" && fetchState && (
          <NotificationsContext.Provider value={notifications}>
            <Notifications notifications={notifications} />
          </NotificationsContext.Provider>
        )}
        {page == "visitProfile" && fetchState && (
          <VisitProfile visitUser={visitUser} />
        )}
      </div>
    </UserContext.Provider>
  );
};

export default Dashboard;
