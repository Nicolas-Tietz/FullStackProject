import React, { useEffect, useState } from "react";
import Spinner from "./Spinner";
import axios from "axios";
import Error from "@components/Error";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const Register = (props) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  const [errorMessage, setErrorMessage] = useState("");

  const [swapForm, setSwapForm] = useState();

  const [loading, setLoading] = useState(false);
  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  }

  function removeError() {
    setErrorMessage();
  }

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      setLoading(true);

      await axios.post("http://localhost:5555/users", formData).then((res) => {
        setLoading(false);
        if (res.status == 201) {
          navigate("/dashboard");
        }
      });
    } catch (err) {
      setLoading(false);

      if (err.response.status == 409) {
        setErrorMessage("User already exists");
      }
      console.log("Errore");
      console.log(err);
    }
  }

  return (
    <div className="w-2/3 md:w-1/3 content-center ">
      <div className="dark:text-white text-5xl flex items-center justify-center mb-10">
        Register
      </div>
      <form onSubmit={handleSubmit}>
        <div class="grid gap-6 mb-6 md:grid-cols-2">
          <div>
            <label
              for="first_name"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              First name
            </label>
            <input
              type="text"
              id="first_name"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="John"
              required
              onChange={handleChange}
              name="firstName"
            />
          </div>
          <div>
            <label
              for="last_name"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Last name
            </label>
            <input
              type="text"
              id="last_name"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Doe"
              onChange={handleChange}
              required
              name="lastName"
            />
          </div>
        </div>
        <div class="mb-6">
          <label
            for="email"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Email address
          </label>
          <input
            type="email"
            id="email"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="john.doe@company.com"
            required
            onChange={handleChange}
            name="email"
          />
        </div>
        <div class="mb-6">
          <label
            for="username"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
            onChange={handleChange}
            name="username"
          />
        </div>
        <div class="mb-6">
          <label
            for="password"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="•••••••••"
            required
            onChange={handleChange}
            name="password"
          />
        </div>

        <div className="flex justify-between">
          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-28  sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Register
          </button>
          <div className="text-white">
            <div>Already Registered?</div>
            <div className="flex justify-end">
              <a
                href="#"
                class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                onClick={() => {
                  navigate("/login");
                }}
              >
                Login
              </a>
            </div>
          </div>
        </div>
        <div>
          {errorMessage && (
            <Error
              errorMessage={errorMessage}
              setErrorMessage={setErrorMessage}
            />
          )}
        </div>
      </form>
    </div>
  );
};

export default Register;
