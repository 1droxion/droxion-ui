import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Clapperboard,
  LayoutDashboard,
  Brush,
  Settings,
  Wallet,
  Shield,
  BookOpenText,
  ScrollText,
  FolderOpenDot,
  Bot,
  ImagePlus,
  Sparkles
} from "lucide-react";

import logo from "./assets/droxion-logo.png"; // ✅ Import logo

function Sidebar() {
  const location = useLocation();

  const navLink = (to, icon, label) => (
    <Link
      to={to}
      className={`flex items-center gap-2 px-3 py-2 rounded transition-all ${
        location.pathname === to ? "bg-blue-600 text-white" : "hover:text-green-400"
      }`}
    >
      {icon} {label}
    </Link>
  );

  return (
    <div className="fixed top-0 left-0 h-full w-56 bg-black text-white shadow-md flex flex-col overflow-y-auto">
      {/* Logo */}
      <div className="pt-3 px-4">
        <img src={logo} alt="Droxion Logo" className="h-40 object-contain mx-auto mb-2" />
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2 px-4 mt-2 text-sm font-medium">
        {navLink("/generator", <Clapperboard size={20} />, "Generator")}
        {navLink("/dashboard", <LayoutDashboard size={20} />, "Dashboard")}
        {navLink("/projects", <FolderOpenDot size={20} />, "Projects")}
        {navLink("/ai-image", <ImagePlus size={20} />, "AI Image")}
        {navLink("/ai-style", <Sparkles size={20} />, "AI Style")}
        {navLink("/editor", <Brush size={20} />, "Editor")}
        {navLink("/settings", <Settings size={20} />, "Settings")}
        {navLink("/plans", <Wallet size={20} />, "Plans")}
        {navLink("/support", <BookOpenText size={20} />, "Support")}
        {navLink("/privacy", <Shield size={20} />, "Privacy")}
        {navLink("/terms", <ScrollText size={20} />, "Terms")}
        {navLink("/chat", <Bot size={20} />, "Chatboard")}
        {navLink("/connect", <Wallet size={20} />, "Connect")}
        {navLink("/templates", <FolderOpenDot size={20} />, "Templates")}
      </nav>
    </div>
  );
}

export default Sidebar;
