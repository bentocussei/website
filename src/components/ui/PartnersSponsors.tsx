 "use client";

import React from "react";
import Image from "next/image";

const PartnersSponsors = () => {
  const sponsors = [
    {
      name: "ABB",
      logo: "/img/sponsors&partners/sponsors/ABB_logo.png",
      url: "https://www.abb.com",
      width: 24,
      height: 12,
      invert: false
    },
    {
      name: "SynerLeap",
      logo: "/img/sponsors&partners/sponsors/synerleap_logo_black.png",
      url: "https://synerleap.com",
      width: 32,
      height: 12,
      invert: true
    }
  ];

  const partners = [
    {
      name: "Innovation Factory",
      logo: "/img/sponsors&partners/partners/iF-Logo_white.webp",
      url: "https://innovationfactory.ca",
      width: 32,
      height: 12,
      invert: false
    }
  ];

  return (
    <div className="mt-12 pt-6 border-t border-gray-800">
      <div className="flex flex-col items-center">
        {/* Sponsors Section */}
        <p className="text-gray-400 mb-4">
          Sponsored by
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 mb-8">
          {sponsors.map((sponsor) => (
            <a 
              key={sponsor.name}
              href={sponsor.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="block"
            >
              <div className={`relative h-${sponsor.height} w-${sponsor.width} md:h-14 md:w-30 bg-white/5 p-2 rounded-md`}>
                <Image
                  src={sponsor.logo}
                  alt={`${sponsor.name} Logo`}
                  fill
                  style={{ objectFit: 'contain' }}
                  className={sponsor.invert ? "filter brightness-0 invert" : "filter"}
                />
              </div>
            </a>
          ))}
        </div>

        {/* Partners Section */}
        <p className="text-gray-400 mb-4">
          Our partners
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8">
          {partners.map((partner) => (
            <a 
              key={partner.name}
              href={partner.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="block"
            >
              <div className={`relative h-${partner.height} w-${partner.width} md:h-14 md:w-30 bg-white/5 p-2 rounded-md`}>
                <Image
                  src={partner.logo}
                  alt={`${partner.name} Logo`}
                  fill
                  style={{ objectFit: 'contain' }}
                  className={partner.invert ? "filter brightness-0 invert" : "filter"}
                />
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PartnersSponsors; 