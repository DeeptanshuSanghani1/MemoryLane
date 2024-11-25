import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../constants/constants";
import User from "../types/User";
import { UserLoginInfo } from "../types/UserLoginInfo";
import { UserSignUpInfo } from "../types/UserSignupInfo";


interface LoginResponse {
    user: User;
    access_token : string
  }
  
  // Define a type for the signup response (if needed)
  interface SignupResponse {
    message: string; // Adjust based on the actual response
  }

export const useAuth = () => {
  const AUTH_URL = API_URL + "/api/auth";

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize user from localStorage
  useEffect(() => {
    setLoading(true);
    const localToken = localStorage.getItem("user");
    setUser(localToken ? (JSON.parse(localToken).user as User) : null);
    setLoading(false);
  }, []);

  

  const login = (userInfo: UserLoginInfo) => {
    return new Promise((resolve, reject) => {
      setLoading(true);
      axios
        .post<LoginResponse>(
          `${AUTH_URL}/login`,
          // Convert the data to URLSearchParams format
          new URLSearchParams({
            username: userInfo.username,
            password: userInfo.password,
          }),
          {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
          }
        )
        .then((response) => {
          // Save the response to localStorage
          localStorage.setItem("user", JSON.stringify(response.data));
          setUser({
            username: response.data.user.username,
            access_token: response.data.access_token,
          });
          resolve(response.data.user);
        })
        .catch((error) => {
          setLoading(false);
          console.error("Login Error:", error);
          reject(error);
        });
    });
  };
  
  

  const signup = (userInfo: UserSignUpInfo) => {
    return new Promise((resolve, reject) => {
      setLoading(true); // Set loading to true at the start
      axios
        .post(
          `${AUTH_URL}/signup`,
          {
            username: userInfo.username,
            password: userInfo.password,
          },
          {
            headers: { "Content-Type": "application/json" },
          }
        )
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          if (error.response) {
            reject({
              status: error.response.status,
              message: error.response.data.detail,
            });
          } else {
            console.error(error);
            reject(error);
          }
        })
    });
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };
  return { user, loading, login, logout, signup };
};

