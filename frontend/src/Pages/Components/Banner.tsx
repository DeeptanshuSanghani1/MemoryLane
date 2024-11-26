import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const Banner = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="p-4 flex flex-row items-center gap-4 w-full border-neutral-700 bg-neutral-800 z-10 relative">
      <button
        className="text-white cursor-pointer hover:text-sky-400"
        onClick={() => {
          console.log("Logout clicked"); // Debugging log
          logout();
          navigate("/login");
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default Banner;