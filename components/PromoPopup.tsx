"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function PromoPopup() {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    // Popup hanya muncul sekali dalam satu sesi browser
    const alreadyShown = sessionStorage.getItem("promo-popup-shown");

    if (!alreadyShown) {
      const timer = setTimeout(() => {
        setShowPopup(true);
        sessionStorage.setItem("promo-popup-shown", "true");
      }, 500);

      return () => clearTimeout(timer);
    }
  }, []);

  if (!showPopup) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      {/* Popup */}
      <div className="relative w-full max-w-[410px] overflow-visible">
        {/* Tombol Close */}
        <button
          type="button"
          onClick={() => setShowPopup(false)}
          aria-label="Tutup banner"
          className="absolute -right-4 -top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white text-gray-800 shadow-lg transition hover:scale-105 hover:bg-gray-100"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-6 w-6"
          >
            <path d="M6 6l12 12" />
            <path d="M18 6 6 18" />
          </svg>
        </button>

        {/* Banner */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-2xl">
          <Image
            src="/images/iklan.jpg"
            alt="Informasi dan promosi PT Tiga Warna Primer"
            width={800}
            height={1200}
            priority
            className="h-auto w-full object-contain"
          />
        </div>
      </div>
    </div>
  );
}