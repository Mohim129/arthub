"use client";
import { useState, useEffect, useRef } from "react";
import { Button } from "@heroui/react";
import { ArrowRight } from "@gravity-ui/icons";

const slides = [
  {
    background:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC9CiuKiHtuovjorJJSNdpcolIFCo8q3wZ82cJ4leza3HWOKIOKWSEI9G9MJvfSX8nZ0cuUC0rFfr0mI92yxdU1m_Nz8X41LVxD91dirjUMqwZgSh_pSa8nW0O7zOotqJ-okQ_zcpRBEsH0mAofF1FaqfeBBq3qW3shZsJgJa6bql5py4Kod1rWdX4hq-QxoA1w5tvNLQhwDQGUwUtQx2x_kP-f9KrsalbZP07gYxAX3Ib7lPJjHAsx8DkpAEry6b_aTur8xhfKfBJ8",
    title: "Discover & Buy Original Art",
    subtitle:
      "Connecting artists and collectors worldwide. Explore a curated selection of physical and digital masterpieces.",
    cta: "Browse Artworks",
    ctaLink: "/browse",
  },
  {
    background:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAayb4-IWzB2IKd--ahDevP5FAfYdzcj4L13HTWRqoI-xBxBjS5EoCdHrnYW19dhctgkCYesTK2JSyUfrThtvpgl_OWDjImivsoVvoZHqc_Fo4Kh0HrV6nvjpgwHNjh1Zj-jh6t83Ajap7QMW4bTV17ZpEXDd1ipY0IJdFj95L02P2vEO_iDszi5aiEbMPxfWlxBMtY6wYa35MeZEPnAEzqprubt4--p5OdDT7LjdkLM_HUPpWMdW7fQXCPeloV9g1q6jUyBQAgImv3",
    title: "Exclusive Digital Collections",
    subtitle:
      "Unlock ownership of verified digital art from leading contemporary creators.",
    cta: "Explore Digital Art",
    ctaLink: "/browse?category=digital",
  },
];

export default function HeroCarousel() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const intervalRef = useRef(null);

  const startInterval = () => {
    stopInterval();
    intervalRef.current = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % slides.length);
    }, 5000);
  };

  const stopInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    startInterval();
    return () => stopInterval();
  }, []);

  const handleDotClick = (index) => {
    setCurrentIdx(index);
    startInterval();
  };

  return (
    <section className="relative overflow-hidden h-[600px] w-full">
      <div
        className="flex transition-transform duration-700 ease-out h-full"
        style={{ transform: `translateX(-${currentIdx * 100}%)` }}
      >
        {slides.map((slide, idx) => (
          <div key={idx} className="min-w-full h-full relative">
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent z-10" />
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url('${slide.background}')` }}
            />
            <div className="relative z-20 h-full max-w-[1280px] mx-auto px-6 flex flex-col justify-center text-white">
              <h1 className="text-[56px] leading-tight max-w-2xl mb-6 font-bold">
                {slide.title}
              </h1>
              <p className="text-xl max-w-xl mb-12 opacity-90">
                {slide.subtitle}
              </p>
              <Button
                as="a"
                href={slide.ctaLink}
                className="bg-primary-container text-on-primary w-fit px-8 py-4 rounded-lg font-bold hover:scale-105 transition-transform"
                endContent={<ArrowRight />}
              >
                {slide.cta}
              </Button>
            </div>
          </div>
        ))}
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-3">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => handleDotClick(idx)}
            className={`w-3 h-3 rounded-full ${
              idx === currentIdx
                ? "bg-white opacity-100"
                : "bg-white opacity-40"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
