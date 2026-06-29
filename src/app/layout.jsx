import Providers from "@/components/Providers";
import ErrorBoundary from "@/components/ErrorBoundary";
import "./globals.css";

export const metadata = {
  title: "ArtHub | Discover & Buy Original Art",
  description: "Connecting artists and collectors worldwide.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-surface text-on-surface dark:bg-inverse-surface dark:text-inverse-on-surface font-body-large transition-colors duration-300">
        <ErrorBoundary>
          <Providers>{children}</Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}

