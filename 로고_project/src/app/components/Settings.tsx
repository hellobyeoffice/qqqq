import { useEffect, useState } from "react";
import { Bell, Globe, HelpCircle, Lock, Monitor, Moon, Sun } from "lucide-react";

type Theme = "light" | "dark" | "system";

export function Settings() {
  const [theme, setTheme] = useState<Theme>("light");
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [language, setLanguage] = useState("ko");
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    if (savedTheme) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    }
  }, []);
  const applyTheme = (newTheme: Theme) => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.classList.toggle("dark", newTheme === "dark" || (newTheme === "system" && prefersDark));
  };
  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
  };
  return (
    <div className="pt-20 pb-12 min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Settings</h1>
        <div className="space-y-6">
          <section className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-colors">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Theme</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Choose how the app looks.</p>
            <div className="grid grid-cols-3 gap-4">
              {([{ id: "light", label: "Light", icon: Sun }, { id: "dark", label: "Dark", icon: Moon }, { id: "system", label: "System", icon: Monitor }] as const).map((item) => {
                const Icon = item.icon;
                const active = theme === item.id;
                return <button key={item.id} onClick={() => handleThemeChange(item.id)} className={`p-4 rounded-lg border-2 transition-all ${active ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20" : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"}`}><Icon className={`w-6 h-6 mx-auto mb-2 ${active ? "text-blue-600" : "text-gray-600 dark:text-gray-400"}`} /><p className={`text-sm font-medium ${active ? "text-blue-600" : "text-gray-700 dark:text-gray-300"}`}>{item.label}</p></button>;
              })}
            </div>
          </section>
          <section className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-colors">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><Bell className="w-5 h-5" />Notifications</h2>
            {[
              { label: "Realtime notifications", description: "Receive new activity alerts.", value: notifications, onChange: setNotifications },
              { label: "Email notifications", description: "Receive notices by email.", value: emailNotifications, onChange: setEmailNotifications },
            ].map((item) => <div key={item.label} className="flex items-center justify-between mb-4"><div><p className="font-medium text-gray-900 dark:text-white">{item.label}</p><p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p></div><button onClick={() => item.onChange(!item.value)} className={`relative w-12 h-6 rounded-full transition-colors ${item.value ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"}`}><span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${item.value ? "translate-x-6" : ""}`} /></button></div>)}
          </section>
          <section className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-colors">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><Globe className="w-5 h-5" />Language</h2>
            <select value={language} onChange={(event) => setLanguage(event.target.value)} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="ko">Korean</option><option value="en">English</option><option value="ja">Japanese</option><option value="zh">Chinese</option>
            </select>
          </section>
          <section className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-colors">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><Lock className="w-5 h-5" />Privacy and security</h2>
            {["Change password", "Two-step verification", "Download personal data"].map((label) => <button key={label} className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-900 dark:text-white">{label}</button>)}
          </section>
          <section className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-colors">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><HelpCircle className="w-5 h-5" />Help</h2>
            {["FAQ", "Contact", "Terms", "Privacy policy"].map((label) => <button key={label} className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-900 dark:text-white">{label}</button>)}
          </section>
        </div>
      </div>
    </div>
  );
}
