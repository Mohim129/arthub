"use client";
import { useState, useSyncExternalStore } from "react";
import { Button } from "@heroui/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Moon, Sun, Person, Bars, Xmark } from "@gravity-ui/icons";

const emptySubscribe = () => () => {};

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/browse", label: "Browse Artworks" },
  { href: "/dashboard", label: "Dashboard" },
];

export default function Navbar() {
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const { setTheme, resolvedTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="fixed top-0 w-full z-50 bg-surface/90 dark:bg-inverse-surface/90 backdrop-blur-md shadow-sm transition-shadow duration-300">
      <div className="w-full max-w-container-max mx-auto px-gutter flex justify-between items-center h-20 relative">
        <Link
          href="/"
          className="font-h1-desktop text-h1-desktop font-bold text-primary dark:text-primary-fixed-dim"
        >
          ArtHub
        </Link>
        <nav className="hidden md:flex gap-md absolute left-1/2 transform -translate-x-1/2">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`font-body-large text-body-large pb-1 transition-colors ${
                isActive(href)
                  ? "text-primary dark:text-primary-fixed-dim border-b-2 border-primary dark:border-primary-fixed-dim"
                  : "text-on-surface-variant dark:text-outline-variant hover:text-primary dark:hover:text-primary-fixed-dim border-b-2 border-transparent"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-md">
          <Button
            isIconOnly
            variant="light"
            onPress={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            aria-label="Toggle dark mode"
          >
            {mounted && resolvedTheme === "dark" ? <Sun /> : <Moon />}
          </Button>
          <Button
            isIconOnly
            variant="light"
            aria-label="Account"
            className="hidden md:flex"
          >
            <Person />
          </Button>
          <Button className="hidden md:flex bg-primary text-on-primary px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition-all">
            Login
          </Button>
          {/* Mobile menu button */}
          <Button
            isIconOnly
            variant="light"
            className="md:hidden"
            onPress={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <Xmark /> : <Bars />}
          </Button>
        </div>
      </div>
      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-surface dark:bg-inverse-surface border-t border-outline-variant/20">
          <nav className="flex flex-col gap-sm p-gutter">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`py-sm transition-colors ${
                  isActive(href)
                    ? "text-primary dark:text-primary-fixed-dim font-semibold"
                    : "text-on-surface-variant dark:text-outline-variant"
                }`}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
