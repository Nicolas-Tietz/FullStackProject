import React, { useEffect, useState } from "react";

import Login from "@components/LoginForm";
import RegisterForm from "@components/RegisterForm";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
const Authentication = (props) => {
  const navigate = useNavigate();
  const [swapForm, setSwapForm] = useState("login");
  console.log("form", props.form);
  useEffect(() => {
    async function check() {
      try {
        await axios
          .get("http://localhost:5555/users/auth-check", {
            withCredentials: true,
          })
          .then((res) => {
            if (res.status == 201) {
              navigate("/dashboard");
            }
          });
      } catch (err) {
        console.log(err);
      }
    }
    check();
  }, []);
  console.log(swapForm);
  if (props.isLogged) {
    navigate("/dashboard");
  }

  return (
    <div className="bg-gray-800 w-1/1 h-screen flex items-center justify-center">
      <Helmet>
        <title>Register</title>
      </Helmet>
      <RegisterForm setSwapForm={setSwapForm} />
    </div>
  );
};

export default Authentication;
