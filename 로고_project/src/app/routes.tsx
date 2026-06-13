import { createBrowserRouter } from "react-router";
import { Home } from "./components/Home";
import { Login } from "./components/Login";
import { Profile } from "./components/Profile";
import { History } from "./components/History";
import { Settings } from "./components/Settings";
import { Ranking } from "./components/Ranking";
import { Realtime } from "./components/Realtime";
import { Layout } from "./components/Layout";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "login", Component: Login },
      { path: "profile", Component: Profile },
      { path: "history", Component: History },
      { path: "settings", Component: Settings },
      { path: "ranking/:category", Component: Ranking },
      { path: "realtime", Component: Realtime },
    ],
  },
]);
