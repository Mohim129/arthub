"use client";
import { Button } from "@heroui/react";
import { Check, Xmark } from "@gravity-ui/icons";

export default function SubscriptionTiers() {
  const currentTier = "Pro"; // mock

  const tiers = [
    {
      name: "BASIC",
      price: "Free",
      description: "Browse public galleries and save favorites.",
      features: ["Unlimited Browsing", "Up to 10 Favorites"],
      missing: ["Early Access Drops"],
      buttonText: currentTier === "Free" ? "Down-grade" : "Get Started",
      isCurrent: currentTier === "Free",
      highlighted: false,
    },
    {
      name: "PRO",
      price: "$9.99",
      period: "/mo",
      description: "Advanced curation and artist interaction.",
      features: [
        "Early Access Drops",
        "High-Res VR View",
        "Artist Direct Messaging",
      ],
      missing: [],
      buttonText: currentTier === "Pro" ? "Manage Plan" : "Upgrade to Pro",
      isCurrent: currentTier === "Pro",
      highlighted: true,
    },
    {
      name: "PREMIUM",
      price: "$19.99",
      period: "/mo",
      description: "White-glove concierge and private auctions.",
      features: [
        "Everything in Pro",
        "1-on-1 Art Concierge",
        "Free Global Shipping",
      ],
      missing: [],
      buttonText: currentTier === "Premium" ? "Manage Plan" : "Upgrade Now",
      isCurrent: currentTier === "Premium",
      highlighted: false,
    },
  ];

  return (
    <section className="flex flex-col gap-md">
      <div className="flex flex-col">
        <h2 className="font-h2 text-h2 text-on-surface">Subscription Tiers</h2>
        <p className="font-body-large text-body-large text-on-surface-variant">
          Choose the plan that fits your collecting needs.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
        {tiers.map((tier) => (
          <div
            key={tier.name}
            className={`relative p-lg rounded-xl flex flex-col items-center text-center transition-all hover:-translate-y-1 hover:shadow-md ${
              tier.highlighted
                ? "bg-primary-container shadow-lg scale-105 z-10"
                : "bg-surface-container-low border border-outline-variant/30"
            }`}
          >
            {tier.isCurrent && (
              <div className="absolute -top-4 bg-secondary text-on-secondary px-sm py-xs rounded-full font-label-caps text-label-caps">
                CURRENT PLAN
              </div>
            )}
            <span
              className={`font-label-caps text-label-caps mb-base ${tier.highlighted ? "text-primary-fixed" : "text-outline"}`}
            >
              {tier.name}
            </span>
            <h3
              className={`font-h1-desktop font-bold mb-base ${tier.highlighted ? "text-white" : "text-on-surface"}`}
            >
              {tier.price}
              {tier.period && (
                <span className="text-h3 font-normal opacity-70">
                  {tier.period}
                </span>
              )}
            </h3>
            <p
              className={`font-body-small mb-lg ${tier.highlighted ? "text-primary-fixed" : "text-on-surface-variant"}`}
            >
              {tier.description}
            </p>
            <ul className="flex flex-col gap-sm w-full mb-xl text-left">
              {tier.features.map((feat) => (
                <li
                  key={feat}
                  className={`flex items-center gap-xs font-body-small ${tier.highlighted ? "text-white" : "text-on-surface-variant"}`}
                >
                  <Check className="text-sm" />
                  {feat}
                </li>
              ))}
              {tier.missing?.map((feat) => (
                <li
                  key={feat}
                  className="flex items-center gap-xs font-body-small text-outline/50"
                >
                  <Xmark className="text-sm" />
                  {feat}
                </li>
              ))}
            </ul>
            <Button
              className={`w-full py-md px-lg rounded-lg font-bold transition-all ${
                tier.highlighted
                  ? "bg-white text-primary hover:bg-surface-bright"
                  : tier.isCurrent
                    ? "border border-primary text-primary hover:bg-primary-container/5"
                    : "bg-primary text-on-primary hover:opacity-90"
              }`}
            >
              {tier.buttonText}
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
}
