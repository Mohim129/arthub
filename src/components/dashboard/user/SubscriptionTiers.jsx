"use client";
import { useState } from "react";
import { Button } from "@heroui/react";
import { Check, Xmark } from "@gravity-ui/icons";
import { toast } from "react-hot-toast";

export default function SubscriptionTiers() {
  const [currentTier, setCurrentTier] = useState("Free");

  const handleUpgrade = (tierName) => {
    if (tierName === currentTier) {
      toast.error(`You are already subscribed to the ${tierName} plan.`);
      return;
    }
    setCurrentTier(tierName);
    toast.success(`Successfully switched to the ${tierName} plan!`);
  };

  const tiers = [
    {
      name: "Free",
      price: "$0",
      description: "Default plan for new collectors. Access basic browsing.",
      maxPurchases: "3 paintings allowed",
      features: [
        "Max Purchases: 3 paintings",
        "Unlimited Gallery Browsing",
        "Standard Resolution Preview",
        "Public Curation Board",
      ],
      missing: ["High-Res VR View", "Artist Direct Messaging", "1-on-1 Art Concierge"],
      buttonText: currentTier === "Free" ? "Current Plan" : "Downgrade to Free",
      isCurrent: currentTier === "Free",
      highlighted: false,
    },
    {
      name: "Pro",
      price: "$9.99",
      period: "/mo",
      description: "For active collectors looking for expanded features and curation.",
      maxPurchases: "9 paintings allowed",
      features: [
        "Max Purchases: 9 paintings",
        "Unlimited Gallery Browsing",
        "High-Res VR View",
        "Artist Direct Messaging",
        "Early Access Drops",
      ],
      missing: ["1-on-1 Art Concierge", "Free Global Shipping"],
      buttonText: currentTier === "Pro" ? "Current Plan" : "Upgrade to Pro",
      isCurrent: currentTier === "Pro",
      highlighted: true,
    },
    {
      name: "Premium",
      price: "$19.99",
      period: "/mo",
      description: "Full unlimited access with white-glove concierge services.",
      maxPurchases: "Unlimited paintings allowed",
      features: [
        "Max Purchases: Unlimited",
        "Everything in Pro",
        "1-on-1 Art Concierge",
        "Free Global Shipping",
        "Private Auctions Access",
      ],
      missing: [],
      buttonText: currentTier === "Premium" ? "Current Plan" : "Upgrade to Premium",
      isCurrent: currentTier === "Premium",
      highlighted: false,
    },
  ];

  return (
    <section className="flex flex-col gap-md">
      <div className="flex flex-col">
        <h2 className="font-h2 text-h2 text-on-surface">Subscription Tier Overview</h2>
        <p className="font-body-large text-body-large text-on-surface-variant">
          Select a subscription tier to expand your allowed purchase capacity.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
        {tiers.map((tier) => (
          <div
            key={tier.name}
            className={`relative p-lg rounded-xl flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${
              tier.isCurrent
                ? "bg-primary/5 border-2 border-primary shadow-sm scale-102"
                : "bg-surface-container-low border border-outline-variant/30"
            }`}
          >
            {tier.isCurrent && (
              <div className="absolute -top-4 bg-primary text-on-primary px-sm py-xs rounded-full font-label-caps text-label-caps font-bold">
                CURRENT PLAN
              </div>
            )}
            <span
              className={`font-label-caps text-label-caps mb-base uppercase tracking-wider font-bold ${
                tier.highlighted ? "text-primary font-bold" : "text-outline"
              }`}
            >
              {tier.name} Tier
            </span>
            <h3 className="font-h1-desktop font-bold mb-base text-on-surface">
              {tier.price}
              {tier.period && (
                <span className="text-h3 font-normal opacity-70">
                  {tier.period}
                </span>
              )}
            </h3>
            <div className="bg-primary-container/20 text-primary-container px-sm py-xs rounded-lg font-bold text-body-small mb-md w-full">
              {tier.maxPurchases}
            </div>
            <p className="font-body-small mb-lg text-on-surface-variant h-12">
              {tier.description}
            </p>
            <ul className="flex flex-col gap-sm w-full mb-xl text-left border-t border-outline-variant/20 pt-md">
              {tier.features.map((feat) => (
                <li
                  key={feat}
                  className="flex items-center gap-xs font-body-small text-on-surface-variant"
                >
                  <Check className="text-primary text-sm shrink-0" />
                  <span>{feat}</span>
                </li>
              ))}
              {tier.missing?.map((feat) => (
                <li
                  key={feat}
                  className="flex items-center gap-xs font-body-small text-outline/50"
                >
                  <Xmark className="text-sm shrink-0" />
                  <span className="line-through">{feat}</span>
                </li>
              ))}
            </ul>
            <Button
              onClick={() => handleUpgrade(tier.name)}
              className={`w-full py-md px-lg rounded-lg font-bold transition-all ${
                tier.isCurrent
                  ? "bg-outline-variant/20 text-on-surface-variant cursor-default border border-transparent"
                  : "bg-primary text-on-primary hover:opacity-90 hover:shadow-md cursor-pointer active:scale-95"
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
