import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { useAuth } from "../../hooks/useAuth";

const SignupSchema = z
  .object({
    username: z.string().min(1, "Username is required"),
    password: z.string().min(1, "Password is required"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignupSchemaType = z.infer<typeof SignupSchema>;

export default function RegisterComponent() {
  const [loading, setLoading] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SignupSchemaType>({ resolver: zodResolver(SignupSchema) });

  const onSubmit: SubmitHandler<SignupSchemaType> = (
    data: SignupSchemaType
  ) => {
    setLoading(true);
    signup(data)
      .then((response) => {
        setLoading(false);
        console.log(response);
        navigate("/login");
      })
      .catch((error) => {
        setLoading(false);
        if (error.response.status === 400) {
          setError("confirmPassword", { message: error.response.data.detail });
        } else {
          setError("confirmPassword", {
            message: "An error occurred. Please try again",
          });
        }
        console.log(error);
      });
  };

  return (
    <div
      id="topo"
      className="flex flex-row justify-evenly items-center w-full h-screen"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-[60%] md:w-[45%] lg:w-[30%]"
      >
        <div className="rounded-xl px-10 p-12 bg-neutral-800">
          <div className="flex flex-col items-center">
            <h1 className="text-xl text-center font-semibold text-gray-300 dark:text-white">
              Sign up for Gaurdian
            </h1>
            <p className="text-sm text-center tracking-wide text-gray-400">
              Already have an account?{" "}
              <a
                href=""
                onClick={() => navigate("/login")}
                className="text-blue-600 transition duration-200 hover:underline dark:text-blue-400"
              >
                Login
              </a>
            </p>
          </div>
          <div className="flex flex-col justify-center items-center gap-6">
            <div className="flex flex-col justify-center gap-4 mt-8 w-full">
              <input
                className={`w-full rounded-md border border-gray-300 px-3 py-2 text-sm`}
                placeholder="username"
                type="username"
                {...register("username")}
              />
              {errors.username && (
                <span className="text-red-500">{errors.username.message}</span>
              )}

              <input
                className={`w-full rounded-md border border-gray-300 px-3 py-2 text-sm`}
                placeholder="Password"
                type="password"
                {...register("password")}
              />
              {errors.password && (
                <span className="text-red-500">{errors.password.message}</span>
              )}

              <input
                className={` w-full rounded-md border border-gray-300 px-3 py-2 text-sm`}
                placeholder="Confirm password"
                type="password"
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <span className="text-red-500">
                  {errors.confirmPassword.message}
                </span>
              )}
            </div>

            <button
              className="h-9 px-3 w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 focus:bg-blue-700 transition ease-in-out duration-200 rounded-md text-white text-center"
              type="submit"
            >
              {loading ? (
                <div
                  className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
                  role="status"
                >
                  <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                    Loading...
                  </span>
                </div>
              ) : (
                "Sign up"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}