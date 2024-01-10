import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";
import Error from "@components/Error";
import axios from "axios";
const Login = (props) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      await axios
        .post("http://localhost:5555/users/login", formData, {
          withCredentials: true,
        })
        .then((res) => {
          if (res.status == 200) {
            props.toggleLoginStatus();
          }
        });
    } catch (err) {
      if (err.response.status == 404) {
        setErrorMessage("User doesnt exists");
      }
      if (err.response.status == 401) {
        setErrorMessage("Wrong Password");
      }
      console.log("Errore");
      console.log(err);
    }
  }
  return (
    <div className="w-2/3 md:w-1/3">
      <div className="dark:text-white text-5xl flex items-center justify-center mb-10">
        Login
      </div>
      <form onSubmit={handleSubmit} className="">
        <div className="mb-6">
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Email address
          </label>
          <input
            type="email"
            id="email"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="john.doe@company.com"
            onChange={handleChange}
            name="email"
            required
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="•••••••••"
            onChange={handleChange}
            name="password"
            required
          />
        </div>
        <div className="flex justify-between text-white">
          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none max-h-12 focus:ring-blue-300 font-medium rounded-lg text-sm w-28  sm:w-auto md:px-5 md:py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Login
          </button>
          <div>
            <div>Not Registered yet?</div>
            <div className="flex justify-end">
              <a
                href="#"
                class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                onClick={() => {
                  navigate("/register");
                }}
              >
                Register
              </a>
            </div>
          </div>
        </div>
        {errorMessage && (
          <Error
            errorMessage={errorMessage}
            setErrorMessage={setErrorMessage}
          />
        )}
      </form>
    </div>
  );
};

export default Login;
