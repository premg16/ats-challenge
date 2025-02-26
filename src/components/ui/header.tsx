"use client";

import { useTheme } from "next-themes";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Button } from "./button";
import Notifications from "./notifications";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";


export default function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // useEffect runs only on client side
  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent flash of incorrect theme
  if (!mounted) {
    return null;
  }

  return (
    <header className="flex items-center justify-between p-4 bg-background border-b border-border">
      <div className="flex items-center">
        <div className="w-8 h-8 mr-2">
          <img src="/logo.png" alt="Logo" />
        </div>
        <span className="font-bold text-xl text-foreground">Recruit Raid</span>
      </div>

      <div className="flex items-center space-x-4">
        <button className="relative text-muted-foreground hover:text-foreground transition-colors">
          <Notifications />
          <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-destructive rounded-full"></span>
        </button>
        <Button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80"
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </Button>
        <Avatar className="h-8 w-8 border border-border">
          <AvatarImage
            src="https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250"
            alt="Profile"
          />
          <AvatarFallback className="bg-muted text-muted-foreground">
            CN
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
