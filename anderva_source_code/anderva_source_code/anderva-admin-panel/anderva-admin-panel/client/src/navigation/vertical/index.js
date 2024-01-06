import { Mail, Home, User, Calendar, List, FileText, Flag } from "react-feather"

export const admin_menu = [
  {
    id: "home",
    title: "Home",
    icon: <Home size={20} />,
    navLink: "/home"
  },
  {
    id: "users",
    title: "Users",
    icon: <User size={20} />,
    navLink: "/users"
  },
  {
    id: "events",
    title: "Events",
    icon: <Calendar size={20} />,
    navLink: "/events"
  },
  {
    id: "businesses",
    title: "Businesses",
    icon: <List size={20} />,
    navLink: "/businesses"
  },
  {
    id: "articles",
    title: "Articles",
    icon: <FileText size={20} />,
    navLink: "/articles"
  },
  {
    id: "categories",
    title: "Categories",
    icon: <Flag size={20} />,
    navLink: "/categories"
  }
]

export const org_menu = [
  {
    id: "home",
    title: "Home",
    icon: <Home size={20} />,
    navLink: "/home"
  },
  {
    id: "events",
    title: "Events",
    icon: <Calendar size={20} />,
    navLink: "/events"
  }
]

export default admin_menu
