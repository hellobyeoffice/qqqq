import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { Activity, ArrowLeft, Image, Mail, Settings } from "lucide-react";
import { MailModal } from "./MailModal";
import { NotificationPopover } from "./NotificationPopover";
import { ProfileDropdown } from "./ProfileDropdown";
import { RankingDropdown } from "./RankingDropdown";
import { UploadModal } from "./UploadModal";
import { useAuth } from "../contexts/AuthContext";

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, logout } = useAuth();
  const [mailOpen, setMailOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);

  const handleLogout = () => {
    logout();
    alert("Logged out.");
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-50 transition-colors">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            {location.pathname !== "/" && (
              <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors" title="Back">
                <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </button>
            )}
            <button onClick={() => navigate("/")} className="text-xl font-bold text-black dark:text-white hover:opacity-80 transition-opacity" title="Go home">LOGO</button>
            <nav className="flex items-center gap-6">
              <RankingDropdown />
              <button onClick={() => navigate("/realtime")} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Realtime
              </button>
            </nav>
          </div>
          <div className="flex items-center gap-6">
            <NotificationPopover />
            <button onClick={() => setUploadOpen(true)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors" title="Upload">
              <Image className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>
            <button onClick={() => navigate("/settings")} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors" title="Settings">
              <Settings className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>
            <button onClick={() => setMailOpen(true)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors" title="Mail">
              <Mail className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>
            <ProfileDropdown isLoggedIn={isLoggedIn} onLogout={handleLogout} />
          </div>
        </div>
      </header>
      <MailModal open={mailOpen} onOpenChange={setMailOpen} />
      <UploadModal open={uploadOpen} onOpenChange={setUploadOpen} />
    </>
  );
}
