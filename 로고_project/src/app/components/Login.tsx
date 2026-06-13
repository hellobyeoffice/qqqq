import { useState } from "react";
import { useNavigate } from "react-router";
import { X } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import type { AuthUser, OAuthProvider } from "../contexts/AuthContext";

type DemoUser = Partial<AuthUser> & Pick<AuthUser, "name" | "email" | "avatar">;

const GOOGLE_USERS: DemoUser[] = [
  { name: "Admin", email: "admin@logo.app", avatar: "https://i.pravatar.cc/150?img=8", role: "ADMIN" },
  { name: "Google User", email: "same@logo.app", avatar: "https://i.pravatar.cc/150?img=11" },
];

const KAKAO_USERS: DemoUser[] = [
  { name: "Kakao User", email: "same@logo.app", avatar: "https://i.pravatar.cc/150?img=21" },
  { name: "Member", email: "user@logo.app", avatar: "https://i.pravatar.cc/150?img=12" },
];

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [oauthModal, setOauthModal] = useState<OAuthProvider | null>(null);
  const users = oauthModal === "google" ? GOOGLE_USERS : KAKAO_USERS;

  const handleSelect = (provider: OAuthProvider, selectedUser: DemoUser) => {
    login(provider, { ...selectedUser, provider } as AuthUser);
    setOauthModal(null);
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-6 pt-20">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="text-center mb-8">
          <button onClick={() => navigate("/")} className="text-4xl font-bold text-black dark:text-white mb-2">LOGO</button>
          <p className="text-gray-600 dark:text-gray-300">Sign in with an OAuth 2.0 provider.</p>
        </div>
        <div className="space-y-4">
          <button onClick={() => setOauthModal("google")} className="w-full flex items-center justify-center gap-3 px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <span className="font-bold text-[#4285F4]">G</span>
            <span className="text-gray-900 dark:text-white">Continue with Google</span>
          </button>
          <button onClick={() => setOauthModal("kakao")} className="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-lg transition-colors text-black" style={{ backgroundColor: "#FEE500" }}>
            <span className="font-bold">K</span>
            <span>Continue with Kakao</span>
          </button>
        </div>
        <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">Accounts with the same email are merged.</div>
      </div>

      {oauthModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-80 overflow-hidden">
            <div className="px-6 py-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700" style={oauthModal === "kakao" ? { backgroundColor: "#FEE500" } : {}}>
              <span className="font-semibold text-gray-900">{oauthModal === "google" ? "Choose Google account" : "Choose Kakao account"}</span>
              <button onClick={() => setOauthModal(null)} className="p-1 hover:bg-black/10 rounded-full transition-colors"><X className="w-4 h-4 text-gray-700" /></button>
            </div>
            <div className="p-4 space-y-2">
              {users.map((item) => (
                <button key={item.email} onClick={() => handleSelect(oauthModal, item)} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border border-gray-100 dark:border-gray-700">
                  <img src={item.avatar} alt={item.name} className="w-10 h-10 rounded-full" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{item.email}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
