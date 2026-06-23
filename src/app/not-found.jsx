"use client";
import { Button } from "@heroui/react";
import { House, ArrowLeft } from "@gravity-ui/icons";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background">
      {/* Background Neon Glowing Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-secondary/15 rounded-full blur-[120px] animate-pulse pointer-events-none animate-delay-1000" />

      <main className="relative z-10 max-w-2xl w-full text-center px-gutter py-xl flex flex-col items-center">
        {/* Abstract CSS Digital Art Piece (The "Broken Canvas" Concept) */}
        <div className="relative w-64 h-64 mb-xl flex items-center justify-center">
          {/* Rotating outer ring */}
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-primary/40 animate-[spin_20s_linear_infinite]" />
          {/* Outer glow ring */}
          <div className="absolute w-52 h-52 rounded-full border border-secondary/30 animate-[spin_10s_linear_infinite_reverse] blur-xs" />

          {/* Glassmorphic Canvas Card */}
          <div className="w-44 h-44 rounded-2xl bg-surface-container-lowest/30 backdrop-blur-md border border-white/10 shadow-2xl flex flex-col items-center justify-center p-md relative overflow-hidden group hover:scale-105 transition-transform duration-500">
            {/* Inner neon gradient lines */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-secondary/10 pointer-events-none" />
            <span className="font-extrabold text-[72px] tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary select-none animate-pulse">
              404
            </span>
            <div className="w-12 h-1 bg-gradient-to-r from-primary to-secondary rounded-full mt-xs" />
          </div>

          {/* Floating abstract decorative geometry */}
          <div className="absolute -top-4 -left-4 w-8 h-8 rounded-lg bg-primary/20 backdrop-blur-xs border border-white/10 animate-bounce" style={{ animationDuration: "3s" }} />
          <div className="absolute -bottom-2 -right-2 w-12 h-12 rounded-full bg-secondary/25 backdrop-blur-xs border border-white/10 animate-bounce" style={{ animationDuration: "4s", animationDelay: "1s" }} />
        </div>

        {/* Message */}
        <div className="space-y-md mb-lg">
          <h1 className="font-h1-desktop text-h1-desktop text-on-surface font-extrabold tracking-tight">
            Lost in the Gallery
          </h1>
          <p className="font-body-large text-body-large text-on-surface-variant mx-auto leading-relaxed">
            Every masterpiece has its mysteries. The piece you are looking for is missing, moved, or was never painted.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row gap-md justify-center items-center w-full max-w-md">
          <Link
            href="/"
            className="w-full sm:w-auto flex-1 h-[48px] bg-primary dark:bg-primary-container hover:bg-primary/90 dark:hover:bg-primary-container/90 text-on-primary font-semibold rounded-xl shadow-md hover:shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-xs px-2"
          >
            <House className="w-5 h-5" />
            Home
          </Link>
          <Button
            onPress={() => window.history.back()}
            variant="bordered"
            className="w-full sm:w-auto flex-1 h-[48px] border-2 border-outline-variant hover:bg-surface-container-low text-on-surface font-semibold rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-xs"
          >
            <ArrowLeft className="w-5 h-5" />
            Previous Page
          </Button>
        </div>
      </main>
    </div>
  );
}
