import { Button, Input } from "@heroui/react";

export default function NewsletterCTA() {
  return (
    <section className="py-xl bg-inverse-surface text-white">
      <div className="max-w-container-max mx-auto px-gutter grid grid-cols-1 md:grid-cols-2 gap-lg items-center">
        <div>
          <h2 className="font-h1-desktop text-h1-desktop mb-md">
            Stay Curated
          </h2>
          <p className="font-body-large opacity-80 max-w-md">
            Join our exclusive newsletter to receive early access to new
            collections and artist spotlights.
          </p>
        </div>
        <div className="flex gap-sm sm:flex-row flex-col">
          <Input
            className="flex-grow bg-white/10 border border-white/20 rounded-lg px-md py-4 focus:ring-2 focus:ring-primary-fixed outline-none text-white"
            placeholder="Enter your email"
            type="email"
          />
          <Button className="bg-secondary text-white px-lg py-4 rounded-lg font-bold hover:opacity-90 transition-opacity">
            Subscribe
          </Button>
        </div>
      </div>
    </section>
  );
}
