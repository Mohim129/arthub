"use client";
import { useState, useSyncExternalStore } from "react";
import { Button } from "@heroui/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Moon, Sun, Person, Bars, Xmark } from "@gravity-ui/icons";
import { authClient, useSession } from "@/lib/auth-client"; // adjust path
import toast from "react-hot-toast";

const emptySubscribe = () => () => {};

const publicLinks = [
  { href: "/", label: "Home" },
  { href: "/browse", label: "Browse Artworks" },
];

export default function Navbar() {
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
  const { setTheme, resolvedTheme } = useTheme();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: session, isPending } = useSession();

  const isActive = (href) => pathname === href;

  const linkClass =
    "font-body-large text-body-large pb-1 transition-colors text-on-surface-variant dark:text-outline-variant hover:text-primary dark:hover:text-primary-fixed-dim border-b-2 border-transparent";

  const mobileLinkClass =
    "py-3 px-4 rounded-lg transition-all duration-200 text-on-surface-variant dark:text-outline-variant hover:bg-surface-container-low hover:text-primary dark:hover:text-primary-fixed-dim";

  const mobileActiveLinkClass =
    "py-3 px-4 rounded-lg transition-all duration-200 text-primary dark:text-primary-fixed-dim font-semibold bg-primary-container/10";

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      toast.success("Logged out successfully");
      setMenuOpen(false);
      // Force a full page reload to clear client state
      window.location.href = "/";
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  // Build nav links array: always public, conditionally add Dashboard
  const navLinks = session
    ? [...publicLinks, { href: "/dashboard", label: "Dashboard" }]
    : publicLinks;

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
              className="font-body-large text-body-large pb-1 transition-colors text-on-surface-variant dark:text-outline-variant hover:text-primary dark:hover:text-primary-fixed-dim border-b-2 border-transparent"
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
            onPress={() =>
              setTheme(resolvedTheme === "dark" ? "light" : "dark")
            }
            aria-label="Toggle dark mode"
          >
            {mounted && resolvedTheme === "dark" ? <Sun /> : <Moon />}
          </Button>

          {/* Show user area only when not loading */}
          {!isPending && (
            <>
              {session ? (
                <>
                  {/* Profile icon / avatar */}
                  <Link
                    href="/dashboard"
                    aria-label="Dashboard"
                    className="hidden md:flex items-center justify-center w-10 h-10 rounded-lg hover:bg-outline-variant/10 text-on-surface dark:text-inverse-on-surface transition-colors overflow-hidden"
                  >
                    {session.user?.image ? (
                      <Image
                        src={session.user.image}
                        alt={session.user.name || "User"}
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <Person className="w-5 h-5" />
                    )}
                  </Link>

                  {/* Logout button – desktop only */}
                  <Button
                    onPress={handleLogout}
                    variant="light"
                    className="hidden md:flex text-on-surface-variant dark:text-outline-variant hover:text-error transition-colors font-medium"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  {/* Login button – desktop only */}
                  <Link
                    href="/signin"
                    className="hidden md:flex bg-primary text-on-primary px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition-all"
                  >
                    Login
                  </Link>
                </>
              )}
            </>
          )}

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

          {session && (
            <>
              <hr className="border-outline-variant/30 my-2" />
              <Link
                href="/dashboard"
                className="flex items-center gap-3 py-3 px-4 rounded-lg text-on-surface-variant dark:text-outline-variant hover:bg-surface-container-low hover:text-primary dark:hover:text-primary-fixed-dim transition-all duration-200"
                onClick={() => setMenuOpen(false)}
              >
                <Person className="w-5 h-5" />
                <span className="font-medium">Dashboard</span>
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left py-3 px-4 rounded-lg text-error hover:bg-error-container/20 transition-all duration-200 font-medium"
              >
                Logout
              </button>
            </>
          )}

          {!session && !isPending && (
            <>
              <hr className="border-outline-variant/30 my-2" />
              <Link
                href="/signin"
                className="w-full bg-primary text-on-primary py-3 rounded-lg font-semibold hover:opacity-90 transition-all mt-2 text-center block"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
