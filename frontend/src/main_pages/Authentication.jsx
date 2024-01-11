import React, { useEffect, useState } from "react";
import Login from "@components/LoginForm";
import Register from "@components/RegisterForm";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
const Authentication = (props) => {
  const navigate = useNavigate();
  const [swapForm, setSwapForm] = useState("login");
  useEffect(() => {
    async function check() {
      await axios
        .get(
          "https://fullstack-project-jbqv.onrender.com:5555/users/auth-check",
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          if (res.status == 200) {
            navigate("/dashboard");
          }
        });
    }
    check();
  }, []);
  console.log(swapForm);
  if (props.isLogged) {
    navigate("/dashboard");
  }

  return (
    <div className="bg-gray-800 w-1/1 h-screen flex items-center justify-center">
      {swapForm == "login" ? (
        <Login
          setSwapForm={setSwapForm}
          toggleLoginStatus={props.toggleLoginStatus}
        />
      ) : (
        <Register setSwapForm={setSwapForm} />
      )}
    </div>
  );
};

export default Authentication;
