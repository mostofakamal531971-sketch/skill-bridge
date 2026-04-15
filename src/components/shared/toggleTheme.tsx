"use client"
import React from 'react'
import { Button } from '../ui/button'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes';

const ToggleTheme = () => {
    const { theme, setTheme } = useTheme();
  return (
    <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="text-zinc-600 dark:text-zinc-400 rounded-full hover:bg-zinc-200 bg-zinc-100 dark:hover:bg-zinc-800 dark:bg-zinc-900"
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
  )
}

export default ToggleTheme
