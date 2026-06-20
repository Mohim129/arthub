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
        {/* Logo */}
        <Link
          href="/"
          className="font-h1-mobile text-h1-mobile md:font-h1-desktop md:text-h1-desktop font-bold text-primary dark:text-primary-fixed-dim transition-colors"
        >
          ArtHub
        </Link>

        {/* Desktop nav links – centered */}
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

        {/* Right side actions */}
        <div className="flex items-center gap-md">
          {/* Dark mode toggle */}
          <Button
            isIconOnly
            variant="light"
            onPress={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            aria-label="Toggle dark mode"
          >
            {mounted && resolvedTheme === "dark" ? <Sun /> : <Moon />}
          </Button>

          {/* Profile icon – desktop only */}
          <Button
            isIconOnly
            variant="light"
            aria-label="Account"
            className="hidden md:flex"
            as={Link}
            href="/signin"
          >
            <Person />
          </Button>

          {/* Login button – desktop only */}
          <Button
            as={Link}
            href="/signin"
            className="hidden md:flex bg-primary text-on-primary px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition-all"
          >
            Login
          </Button>

          {/* Hamburger button – mobile only */}
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

      {/* Mobile menu dropdown */}
      <div
        className={`md:hidden absolute top-full left-0 w-full bg-surface/95 dark:bg-inverse-surface/95 backdrop-blur-lg border-b border-t border-outline-variant/20 shadow-lg transition-all duration-300 ease-in-out ${
          menuOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <nav className="flex flex-col gap-1 p-gutter">
          {/* Main navigation links */}
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`py-3 px-4 rounded-lg transition-all duration-200 ${
                isActive(href)
                  ? "text-primary dark:text-primary-fixed-dim font-semibold bg-primary-container/10"
                  : "text-on-surface-variant dark:text-outline-variant hover:bg-surface-container-low hover:text-primary dark:hover:text-primary-fixed-dim"
              }`}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </Link>
          ))}

          {/* Separator */}
          <hr className="border-outline-variant/30 my-2" />

          {/* User actions */}
          <Link
            href="/signin"
            className="flex items-center gap-3 py-3 px-4 rounded-lg text-on-surface-variant dark:text-outline-variant hover:bg-surface-container-low hover:text-primary dark:hover:text-primary-fixed-dim transition-all duration-200"
            onClick={() => setMenuOpen(false)}
          >
            <Person className="w-5 h-5" />
            <span className="font-medium">Profile</span>
          </Link>

          <Button
            as={Link}
            href="/signin"
            className="w-full bg-primary text-on-primary py-3 rounded-lg font-semibold hover:opacity-90 transition-all mt-2"
            onPress={() => setMenuOpen(false)}
          >
            Login
          </Button>
        </nav>
      </div>
    </header>
  );
}
