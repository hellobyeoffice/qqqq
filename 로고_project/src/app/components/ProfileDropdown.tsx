import { useNavigate } from "react-router";
import { LogIn, LogOut } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

interface ProfileDropdownProps {
  isLoggedIn: boolean;
  onLogout: () => void;
}

export function ProfileDropdown({ isLoggedIn, onLogout }: ProfileDropdownProps) {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!isLoggedIn) {
    return (
      <button onClick={() => navigate("/login")} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
        <LogIn className="w-4 h-4" />
        <span className="text-sm font-medium">Login</span>
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button onClick={() => navigate("/profile")} className="flex items-center gap-2 hover:opacity-80 transition-opacity" title={user?.name ?? "Profile"}>
        {user?.avatar ? <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full object-cover border-2 border-blue-500" /> : <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">{(user?.name ?? "U")[0]}</div>}
        {user?.role === "ADMIN" && <span className="text-xs font-bold px-2 py-1 rounded-full bg-gray-900 text-white">ADMIN</span>}
      </button>
      <button onClick={onLogout} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors" title="Logout">
        <LogOut className="w-4 h-4 text-gray-700 dark:text-gray-300" />
      </button>
    </div>
  );
}
