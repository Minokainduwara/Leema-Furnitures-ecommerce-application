import React from "react";
import { Bell, ChevronRight, Menu } from "lucide-react";
import { Avatar } from "../ui/admin-ui/index";

interface TopbarProps {
  currentLabel:   string;
  onMenuClick:    () => void;
  onProfileClick: () => void;
}

const Topbar: React.FC<TopbarProps> = ({ currentLabel, onMenuClick, onProfileClick }) => (
  <header className="bg-white border-b border-stone-100 px-5 py-3.5 flex items-center justify-between flex-shrink-0">
    {/* Left */}
    <div className="flex items-center gap-3">
      <button
        onClick={onMenuClick}
        className="lg:hidden p-1.5 rounded-lg hover:bg-stone-100 text-stone-500"
      >
        <Menu size={18} />
      </button>
      <div className="flex items-center gap-1.5 text-sm text-stone-400">
        <span>Admin</span>
        <ChevronRight size={13} />
        <span className="text-stone-700 font-medium">{currentLabel}</span>
      </div>
    </div>

    {/* Right */}
    <div className="flex items-center gap-2">
      <button className="relative p-2 rounded-xl hover:bg-stone-100 text-stone-500 transition-colors">
        <Bell size={17} />
        <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-amber-500 rounded-full" />
      </button>
      <button
        onClick={onProfileClick}
        className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-stone-100 transition-colors"
      >
        <Avatar initials="LA" size="sm" className="rounded-lg" />
        <span className="text-sm font-medium text-stone-700 hidden sm:block">Admin</span>
      </button>
    </div>
  </header>
);

export default Topbar;