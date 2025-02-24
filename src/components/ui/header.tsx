"use client";

import { useTheme } from "next-themes";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Button } from "./button";
import { Input } from "./input";
import Notifications from "./notifications";
import { Sun, Moon } from "lucide-react";

export default function Header() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="flex items-center justify-between p-4 bg-background border-b border-border">
      {/* Logo */}
      <div className="flex items-center">
        <div className="w-8 h-8 mr-2">
          <img src="/logo.png" alt="Logo"/> Supa@6789
        </div>
        <span className="font-bold text-xl text-foreground">Recruit Raid</span>
      </div>

      {/* Search Bar */}
      <div className="flex-1 mx-4">
        <Input
          type="text"
          placeholder="Search"
          className="w-full"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-4">
        <Button className="bg-brand-green hover:bg-brand-green/90 text-white">
          Add Job
        </Button>
        
        <button className="relative text-muted-foreground hover:text-foreground transition-colors">
          <Notifications />
          <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-destructive rounded-full"></span>
        </button>
        
        <button 
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80"
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        
        <Avatar className="h-8 w-8 border border-border">
          <AvatarImage src="https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250" alt="Profile"/>
          <AvatarFallback className="bg-muted text-muted-foreground">CN</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}