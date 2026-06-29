"use client";
import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";
import { JwtProvider } from "@/context/JwtContext";

export default function Providers({ children }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <JwtProvider>
        {children}
      </JwtProvider>
      <Toaster position="top-center" />
    </ThemeProvider>
  );
}
