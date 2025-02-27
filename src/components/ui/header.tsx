"use client";
import Image from "next/image";
import { useTheme } from "next-themes";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Button } from "./button";
import { Sun, Moon, Bell } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // useEffect runs only on client side
  useEffect(() => {
    setMounted(true);
  }, []);

  if (
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/forgot-password" ||
    pathname === "/reset-password"
  ) {
    return <></>;
  }

  // Prevent flash of incorrect theme
  if (!mounted) {
    return null;
  }

  return (
    <header className="flex items-center justify-between p-4 bg-background border-b border-border">
      <div className="flex items-center">
        <div className="w-8 h-8 mr-2 relative">
          <Image src="/logo.png" alt="Logo" fill sizes="2rem" className="object-contain" data-testid="logo-image" />
        </div>
        <span className="font-bold text-xl text-foreground">Recruit Raid</span>
      </div>

      <div className="flex items-center space-x-4">
        <button className="relative text-muted-foreground hover:text-foreground transition-colors" data-testid="bell-icon">
          <Bell />
          <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-destructive rounded-full"></span>
        </button>
        <Button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80"
          data-testid="theme-button"
        >
          {theme === "dark" ? <Sun size={18} data-testid="sun-icon" /> : <Moon size={18} data-testid="moon-icon" />}
        </Button>
        <Avatar className="h-8 w-8 border border-border" data-testid="avatar">
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
