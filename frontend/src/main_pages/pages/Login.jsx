import React, { useEffect, useState } from "react";
import LoginForm from "@components/LoginForm";

import { Navigate, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
const Authentication = (props) => {
  const navigate = useNavigate();

  if (props.isLogged) {
    navigate("/");
  }

  return (
    <div className="bg-gray-800 w-1/1 h-screen flex items-center justify-center">
      <Helmet>
        <title>Login</title>
      </Helmet>
      <LoginForm toggleLoginStatus={props.toggleLoginStatus} />
    </div>
  );
};

export default Authentication;
