"use client";

import { sidebarItems } from "./sidebarItems";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  return (
    <aside className="w-full md:w-56 flex-shrink-0">

      <nav className="flex md:hidden justify-between bg-card border rounded-xl p-2 mb-4">
        {sidebarItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`p-3 rounded-lg ${
              activeTab === item.id ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-muted"
            }`}
          >
            <item.icon className="w-5 h-5" />
          </button>
        ))}
      </nav>

      <nav className="hidden md:flex flex-col gap-1">
        {sidebarItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl ${
              activeTab === item.id ? "bg-accent text-accent-foreground" : "text-foreground hover:bg-muted"
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-sm font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

    </aside>
  );
}
