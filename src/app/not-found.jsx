"use client";
import { Button } from "@heroui/react";
import { House, ArrowLeft, Paintbrush } from "@gravity-ui/icons";
import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <main className="min-h-screen flex flex-col items-center justify-center pt-20 px-gutter">
        <div className="max-w-2xl w-full text-center gallery-fade-in">
          {/* Central Illustration: Broken Canvas */}
          <div className="relative w-full aspect-video md:aspect-[16/9] mb-lg canvas-float">
            <div className="absolute inset-0 bg-surface-container-high rounded-xl overflow-hidden shadow-sm border border-outline-variant">
              <img
                className="w-full h-full object-cover opacity-80 mix-blend-multiply"
                alt="Broken canvas illustration"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDyd48mXfgfB67RvQZseKRW3qFenN0Bc0DAH-ckB9rsPS-_rqBWKEjygQzPwDffW7fdXXTd4A1_x56A0-xnpWw1EAbDXJkKnhajx6H2p5Vx6qdqz3HLCx-YXPnUBBT8apcMh405TWN8O1xUC6sCgM4LYnyXYqtA_gvymJnEN-D_K61fmzbYcyihrQOheixfArElNcms0sdY-IYB930LRCQOTCTIo4MHyqAwF0I2E6Y5fjPW9jJ2Pb64fe7jicEnvFgmUYmpnlFQ7OcB"
              />
              {/* Overlay Graphics for "Broken" effect */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-background/40 backdrop-blur-sm p-lg rounded-full border border-white/20">
                  <Paintbrush className="text-[80px] text-primary opacity-90" />
                </div>
              </div>
            </div>
            {/* 404 Visual Anchor */}
            <div className="absolute -bottom-6 -right-6 md:-bottom-10 md:-right-10">
              <span className="font-h1-desktop text-[120px] md:text-[180px] font-extrabold text-primary/5 select-none pointer-events-none">
                404
              </span>
            </div>
          </div>

          {/* Error Message */}
          <div className="space-y-sm mb-lg">
            <h1 className="font-h1-desktop text-h1-desktop text-on-background">
              Page Not Found
            </h1>
            <p className="font-body-large text-body-large text-on-surface-variant max-w-md mx-auto">
              Even the finest masterpieces have missing fragments. The page you
              are looking for has been moved or archived from our digital
              gallery.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-md justify-center items-center mb-12">
            <Link
              href="/"
              className="w-full sm:w-auto px-lg py-md bg-primary text-on-primary font-semibold rounded-lg shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300 active:scale-95 flex items-center justify-center gap-base"
            >
              <House />
              Go Home
            </Link>
            <Button
              onPress={() => window.history.back()}
              variant="bordered"
              className="w-full sm:w-auto px-lg py-md border border-primary text-primary font-semibold rounded-lg hover:bg-primary/5 transition-colors"
              startContent={<ArrowLeft />}
            >
              Previous Page
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}
