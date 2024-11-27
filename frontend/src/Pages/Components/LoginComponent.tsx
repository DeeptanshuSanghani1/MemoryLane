import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";

const LoginSchema = z.object({
  username: z.string().min(1, "username is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginSchemaType = z.infer<typeof LoginSchema>;

const LoginComponent = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginSchemaType>({ resolver: zodResolver(LoginSchema) });

  const onSubmit: SubmitHandler<LoginSchemaType> = (data: LoginSchemaType) => {
    setLoading(true);
    console.log("Data: ", data)
    login(data)
      .then((response) => {
        setLoading(false);
        console.log(response);
        navigate("/home");
      })
      .catch((err) => {
        setLoading(false);
        setError("password", { message: "Incorrect email or " });
        if (err.status === 401) {
          console.log("Error?????")
          console.log("Invalid username or password");
        } //else {
          //console.log("An error occurred. Please try again later", err.status);
        //}
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
              Login to your account
            </h1>
            <p className="text-sm text-center tracking-wide text-gray-400">
              Don't have an account?{" "}
              <a
                href=""
                onClick={() => navigate("/register")}
                className="text-blue-600 transition duration-200 hover:underline dark:text-blue-400"
              >
                Sign up
              </a>
            </p>
          </div>
          <div className="flex flex-col justify-center items-center gap-6">
            <div className="flex flex-col justify-center gap-4 mt-8 w-full">
              <input
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                placeholder="Username"
                type="username"
                {...register("username")}
              />
              {errors.username && (
                <span className="text-red-500">{errors.username.message}</span>
              )}
              <input
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                placeholder="Password"
                type="password"
                {...register("password")}
              />
              {errors.password && (
                <span className="text-red-500">{errors.password.message}</span>
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
                "Login"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LoginComponent;