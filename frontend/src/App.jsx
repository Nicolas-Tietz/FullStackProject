import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";

import Dashboard from "@main_pages/Dashboard";
import Login from "@pages/Login";
import Register from "@pages/Register";
import { useEffect } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import NotFound from "@main_pages/pages/NotFound";

const App = () => {
  const [isLogged, setIsLogged] = useState();
  const [email, setEmail] = useState();

  function toggleLoginStatus() {
    setIsLogged(!isLogged);
  }
  useEffect(() => {
    async function check() {
      try {
        await axios
          .get(
            "https://fullstack-project-jbqv.onrender.com:5555/users/auth-check",
            {
              withCredentials: true,
            }
          )
          .then((res) => {
            if (res.status == 200) {
              setIsLogged(true);
              setEmail(res.data.email);
            }
          });
      } catch (err) {
        if (err.response.status == 401) {
          console.log("No valid Token Found");
        }
      }
    }
    check();
  }, []);
  return (
    <Routes>
      <Route
        path="/"
        element={
          isLogged ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
        }
      />
      <Route
        path="/dashboard"
        element={
          isLogged ? (
            <Dashboard toggleLoginStatus={toggleLoginStatus} />
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      <Route
        path="/register"
        element={isLogged ? <Navigate to="/dashboard" /> : <Register />}
      />
      <Route
        path="/login"
        element={
          isLogged ? (
            <Navigate to="/dashboard" />
          ) : (
            <Login toggleLoginStatus={toggleLoginStatus} />
          )
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
