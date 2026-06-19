import { FaceSmile, Globe, Envelope } from "@gravity-ui/icons";

export default function Footer() {
  return (
    <footer className="bg-inverse-surface text-surface-variant w-full py-xl">
      <div className="max-w-container-max mx-auto px-gutter grid grid-cols-1 md:grid-cols-4 gap-lg">
        <div>
          <span className="font-h3 text-h3 font-bold text-surface-bright mb-md block">
            ArtHub
          </span>
          <p className="font-body-small text-body-small opacity-80 leading-relaxed">
            Elevating digital artistry by connecting creators and connoisseurs
            in a seamless global marketplace.
          </p>
        </div>
        <div>
          <h4 className="text-white font-bold mb-md">Explore</h4>
          <nav className="flex flex-col gap-sm">
            <a
              href="#"
              className="font-body-small text-body-small text-surface-variant hover:text-surface-bright transition-colors"
            >
              About
            </a>
            <a
              href="#"
              className="font-body-small text-body-small text-surface-variant hover:text-surface-bright transition-colors"
            >
              Careers
            </a>
            <a
              href="#"
              className="font-body-small text-body-small text-surface-variant hover:text-surface-bright transition-colors"
            >
              Press
            </a>
          </nav>
        </div>
        <div>
          <h4 className="text-white font-bold mb-md">Legal</h4>
          <nav className="flex flex-col gap-sm">
            <a
              href="#"
              className="font-body-small text-body-small text-surface-variant hover:text-surface-bright transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="font-body-small text-body-small text-surface-variant hover:text-surface-bright transition-colors"
            >
              Terms of Service
            </a>
          </nav>
        </div>
        <div>
          <h4 className="text-white font-bold mb-md">Support</h4>
          <nav className="flex flex-col gap-sm">
            <a
              href="#"
              className="font-body-small text-body-small text-surface-variant hover:text-surface-bright transition-colors"
            >
              Help Center
            </a>
            <a
              href="#"
              className="font-body-small text-body-small text-surface-variant hover:text-surface-bright transition-colors"
            >
              Community Guidelines
            </a>
          </nav>
        </div>
      </div>
      <div className="max-w-container-max mx-auto px-gutter mt-xl pt-lg border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-md">
        <span className="font-body-small text-body-small opacity-60">
          © 2024 ArtHub. Elevating digital artistry.
        </span>
        <div className="flex gap-md">
          <FaceSmile className="hover:text-surface-bright cursor-pointer transition-colors" />
          <Globe className="hover:text-surface-bright cursor-pointer transition-colors" />
          <Envelope className="hover:text-surface-bright cursor-pointer transition-colors" />
        </div>
      </div>
    </footer>
  );
}
