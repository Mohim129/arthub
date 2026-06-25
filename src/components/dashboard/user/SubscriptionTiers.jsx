"use client";
import { useState, useEffect } from "react";
import { Button } from "@heroui/react";
import { Check, Xmark } from "@gravity-ui/icons";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function SubscriptionTiers() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [currentTier, setCurrentTier] = useState("free");

  // Set current tier from session
  useEffect(() => {
    const tier = session?.user?.tier || session?.user?.subscriptionTier;
    if (tier) {
      setCurrentTier(tier.toLowerCase());
    }
  }, [session?.user?.tier, session?.user?.subscriptionTier]);

  const handleUpgrade = async (tierName) => {
    const tierKey = tierName.toLowerCase();
    if (tierKey === currentTier) {
      toast.error(`You are already subscribed to the ${tierName} plan.`);
      return;
    }

    if (tierKey === "free") {
      setCurrentTier("free");
      toast.success("Downgraded to Free plan!");
      return;
    }

    try {
      toast.loading("Redirecting to Stripe Checkout...", { id: "subscription" });
      
      const response = await fetch("/api/stripe/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier: tierKey })
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Failed to create subscription session", { id: "subscription" });
        return;
      }

      // Redirect to Stripe checkout
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      toast.error(err.message || "Subscription error", { id: "subscription" });
    }
  };

  const tiers = [
    {
      name: "Free",
      key: "free",
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
      buttonText: currentTier === "free" ? "Current Plan" : "Downgrade to Free",
      isCurrent: currentTier === "free",
      highlighted: false,
    },
    {
      name: "Pro",
      key: "pro",
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
      buttonText: currentTier === "pro" ? "Current Plan" : "Upgrade to Pro",
      isCurrent: currentTier === "pro",
      highlighted: true,
    },
    {
      name: "Premium",
      key: "premium",
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
      buttonText: currentTier === "premium" ? "Current Plan" : "Upgrade to Premium",
      isCurrent: currentTier === "premium",
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
