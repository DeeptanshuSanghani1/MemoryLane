import { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import User from "../types/User";
import { UserLoginInfo } from "../types/UserLoginInfo";
import { UserSignUpInfo } from "../types/UserSignupInfo";
import { LOGIN_MUTATION, SIGNUP_MUTATION } from "../graphql/mutations/auth-mutation";

interface LoginResponse {
  success: boolean;
  message: string;
  accessToken: string;
  tokenType: string;
}

interface SignupResponse {
  message: string; // Adjust based on the actual response
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Apollo mutations
  const [loginMutation] = useMutation<{ login: LoginResponse }>(LOGIN_MUTATION);
  const [signupMutation] = useMutation<{ signup: SignupResponse }>(SIGNUP_MUTATION);

  // Initialize user from localStorage
  useEffect(() => {
    setLoading(true);
    const localToken = localStorage.getItem("user");
    setUser(localToken ? JSON.parse(localToken) : null);
    setLoading(false);
    console.log("Local Token: ",user)
  }, []);

  const login = (userInfo: UserLoginInfo) => {
    return new Promise((resolve, reject) => {
      setLoading(true);
      loginMutation({
        variables: {
          input:{
            username: userInfo.username,
            password: userInfo.password,
          }
        },
      })
        .then((response) => {
          const data = response.data?.login;
          if (data) {
            // Save the user and token to localStorage
            const userData = {
              username: userInfo.username,
              accessToken: data.accessToken,
              tokenType : data.tokenType
            };
            localStorage.setItem("user", JSON.stringify(userData));
            setUser({
              username: userInfo.username,
              access_token: data.accessToken,
            });
            resolve(userData);
          } else {
            reject(data || "Login failed");
          }
        })
        .catch((error) => {
          console.error("Login Error:", error);
          reject(error.message || "An error occurred during login");
        })
        .finally(() => {
          setLoading(false);
        });
    });
  };

  const signup = (userInfo: UserSignUpInfo) => {
    return new Promise((resolve, reject) => {
      setLoading(true);
      signupMutation({
        variables: {
          input: {
            username: userInfo.username,
            password: userInfo.password,
          },
        },
      })
        .then((response) => {
          const data = response.data?.signup;
          if (data) {
            resolve(data.message);
          } else {
            reject("Signup failed");
          }
        })
        .catch((error) => {
          console.error("Signup Error:", error);
          reject(error.message || "An error occurred during signup");
        })
        .finally(() => {
          setLoading(false);
        });
    });
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return { user, loading, login, logout, signup };
};
